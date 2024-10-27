import networkx as nx
from Bio import Entrez
import os
Entrez.email = os.getenv('EMAIL_ADDRESS')

def create_graph_with_spd(full_graph, seed_nodes):
    """
    Create a graph of seed nodes with added participation degree values.
    """
    # Filter the seed nodes
    filtered_seeds = filter_seeds(full_graph, seed_nodes)

    # Create a subgraph based on the seed nodes
    graph = nx.subgraph(full_graph, filtered_seeds)

    # Calculate the participation degree values and add them to the graph
    graph_with_spd = calculate_and_add_degrees(graph, full_graph)

    return graph_with_spd

def calculate_participation_degree(node, subgraph, full_graph):
    subgraph_degree = subgraph.degree(node)
    full_graph_degree = full_graph.degree(node)
    if full_graph_degree == 0:
        return 0
    return subgraph_degree / full_graph_degree

def calculate_and_add_degrees(graph, full_graph):
    participation_degrees = {node: calculate_participation_degree(node, graph, full_graph) for node in graph.nodes()}
    nx.set_node_attributes(graph, participation_degrees, 'spd')
    return graph

def filter_seeds(graph, seed_nodes):
    return [node for node in seed_nodes if node in graph.nodes()]

def perform_clustering(interactome, proteins_list):
    # Create a subnetwork of the overall interactome based on the proteins
    subgraph = interactome.subgraph(proteins_list)

    mutable_subgraph = nx.Graph(subgraph)

    # Apply the clustering
    communities = nx.community.louvain_communities(mutable_subgraph)

    # Get a group for each protein
    groups = {f'group {i}': list(community) for i, community in enumerate(communities)}

    return groups



def fetch_abstracts(pmids_list):
    handle = Entrez.efetch(db="pubmed", id=','.join(map(str, pmids_list)),
                           rettype="xml", retmode="text")
    records = Entrez.read(handle)
    abstracts = []
    for pubmed_article in records['PubmedArticle']:
        try:
            abstract = pubmed_article['MedlineCitation']['Article']['Abstract']['AbstractText'][0]
        except Exception:
            abstract = "Abstract not found"
        abstracts.append(abstract)
    abstract_dict = dict(zip(pmids_list, abstracts))
    return abstract_dict
