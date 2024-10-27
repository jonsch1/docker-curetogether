from flask import Flask, jsonify
from flask_cors import CORS
import networkx as nx
from networkx.readwrite import json_graph
import pickle as pkl
from helpers import create_graph_with_spd, fetch_abstracts
import os
import requests 
from networkx.exception import PowerIterationFailedConvergence
import time

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins

# Get the directory containing this script
dir_path = os.path.dirname(os.path.realpath(__file__))

# Load the graph
file_path_interactome = os.path.join(dir_path, './data/G.pkl')

with open(file_path_interactome, 'rb') as f:
    interactome = pkl.load(f)

api_key = os.getenv('INDRA_API_KEY')
    
if not api_key:
    app.logger.error("API key not found in environment variables")
    
def process_nodes(G, random_walk, adjust_by_degree=False, N=100):
    scores = ((node, score / G.nodes[node]['degree'] if adjust_by_degree else score)
              for node, score in random_walk.items())
    
    # Use a generator expression and heapq to efficiently get top N nodes
    import heapq
    top_nodes = heapq.nlargest(N, scores, key=lambda x: x[1])
    
    # Unzip the nodes and scores
    nodes, scores = zip(*top_nodes)
    
    return nodes, scores

@app.route('/api/return_network/<seeds>/<expansion_method>/<interactome_type>/')
def return_network(seeds, expansion_method, interactome_type):
    try:
        seeds_list = [x.upper() for x in seeds.split(',')]
        
        if expansion_method == 'PageRank':
            start_time = time.time()
            try:
                personalization = {seed: 1 for seed in seeds_list}
                random_walk = nx.pagerank(interactome, personalization=personalization, alpha=0.7, max_iter=100, tol=1e-06)
            except PowerIterationFailedConvergence:
                return jsonify({"error": "PageRank computation did not converge"}), 400
            
            computation_time = time.time() - start_time
            app.logger.info(f"PageRank computation time: {computation_time} seconds")
            
            if computation_time > 30:  # Adjust this threshold as needed
                app.logger.warning("PageRank computation took longer than expected")
            
            top_nodes, scores = process_nodes(interactome, random_walk, adjust_by_degree=True)
            graph = create_graph_with_spd(interactome, top_nodes)
            
            # Use a generator expression to set pagerank scores
            for node, score in zip(top_nodes, scores):
                graph.nodes[node]['pagerank'] = score
        
        elif expansion_method == 'Subgraph':
            graph = create_graph_with_spd(interactome, seeds_list)
        else:
            return jsonify({"error": "Invalid expansion method"}), 400
        
        graph_json = json_graph.node_link_data(graph)        
        return jsonify(graph_json)
    except Exception as e:
        app.logger.error(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/return_indra_statements/<gene_list>/<offset>')
def return_indra_statements(gene_list, offset):
    url = "https://db.indra.bio/statements/from_agents"

    # Split the gene_list by commas to handle multiple genes
    genes = gene_list.split(',')

    # Construct the params dictionary with unique keys for each gene
    params = {f'agent{i}': gene for i, gene in enumerate(genes)}
    params['api_key'] = api_key

    try:
        response = requests.get(url, params=params)
        
        # Check if the request was successful
        if response.status_code == 200:
            return response.json()
        else:
            app.logger.error(f"Request failed with status code {response.status_code}")
            return jsonify({"error": "Failed to fetch data from INDRA"}), response.status_code
    except Exception as e:
        app.logger.error(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/abstracts/<pmids>', methods=['GET'])
def get_abstracts(pmids):
    try:
        pmids_list = pmids.split(',')
        abstract_dict = fetch_abstracts(pmids_list)
        return jsonify(abstract_dict)
    except Exception as e:
        app.logger.error(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8080)
