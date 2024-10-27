"use client";

import React, { useCallback } from "react";
import {
  Cosmograph,
  CosmographRef,
  CosmographProvider,
} from "@cosmograph/react";
import { useTheme } from "next-themes";
import { Graph, Node, Edge } from "@/lib/types";
import { LoadingSpinner } from "@/components/ui/spinner";
import dynamic from "next/dynamic";

interface GraphViewProps {
  cosmographRef: React.RefObject<CosmographRef<Node, Edge> | undefined>;
  setSelectedElement: (node: Node | null) => void;
  completeGraph: Graph | null;
  expansionMethod: string;
  seeds: string[];
  filteredLinks: Edge[];
  filteredNodes: Node[];
  isGraphLoading: boolean;
  isMobile: boolean; // Add this new prop
}

const GraphView: React.FC<GraphViewProps> = ({
  cosmographRef,
  setSelectedElement,
  completeGraph,
  isGraphLoading,
  expansionMethod,
  seeds,
  filteredLinks,
  filteredNodes,
  isMobile, // Add this new prop
}) => {
  const { theme } = useTheme();

  const handleNodeClick = useCallback(
    (clickedNode: Node | undefined) => {
      if (clickedNode && completeGraph) {
        setSelectedElement(clickedNode);
        console.log(clickedNode);
        cosmographRef.current?.focusNode(clickedNode);
      }
    },
    [completeGraph, setSelectedElement, cosmographRef]
  );

  return (
    <div className="w-full h-full relative">
      {isGraphLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size={40} />
        </div>
      ) : (
        completeGraph && (
          <CosmographProvider nodes={filteredNodes} links={filteredLinks}>
            {!isMobile && ( // Only show this panel on non-mobile devices
              <div className="absolute top-0 right-0 m-4 p-4 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white shadow-md z-50">
                <p>Nodes: {filteredNodes.length}</p>
                <p>Edges: {filteredLinks.length}</p>
              </div>
            )}
            <Cosmograph
              ref={cosmographRef}
              linkWidth={2}
              backgroundColor={theme === "dark" ? "#1a1a1a" : "#f0f0f0"}
              nodeLabelColor="#ffffff"
              disableSimulation={false}
              nodeLabelAccessor={(d) => {
                const drugCentralAmount = d.Drugcentral_data?.DRUG_NAME?.length || 0;
                const drugBankAmount = d.Drugbank_data?.Name?.length || 0;
                const combinedAmount = drugCentralAmount + drugBankAmount;
                return combinedAmount > 0 ? `${d.id} 💊 ${combinedAmount}` : d.id;
              }}
              linkColor={(d) =>
                d.Omnipath_PPI_data
                  ? d.Omnipath_PPI_data.consensus_inhibition
                    ? "#FF0000"
                    : d.Omnipath_PPI_data.consensus_stimulation
                    ? "#008000"
                    : d.Omnipath_Enzyme_PTM_data
                    ? "#0000FF"
                    : "#808080"
                  : d.Omnipath_Enzyme_PTM_data
                  ? "#0000FF"
                  : "#808080"
              }
              nodeColor={(d) => {
                if (expansionMethod !== "Subgraph" && seeds.includes(d.id)) {
                  return "#FF0000";
                }
                return theme === "dark" ? "#FFFFFF" : "#000000";
              }}
              simulationRepulsion={2}
              simulationFriction={0.6}
              nodeSize={10}
              useQuadtree={true}
              fitViewOnInit={true}
              fitViewDelay={500}
              simulationDecay={500}
              simulationLinkSpring={0.5}
              simulationLinkDistance={2.0}
              onClick={handleNodeClick}
              onLabelClick={handleNodeClick}
              scaleNodesOnZoom={false}
              focusedNodeRingColor={"#ffd700"}
            />
          </CosmographProvider>
        )
      )}
    </div>
  );
};

const GraphViewNoSSR = dynamic(() => Promise.resolve(GraphView), {
  ssr: false,
});

export default GraphViewNoSSR;
