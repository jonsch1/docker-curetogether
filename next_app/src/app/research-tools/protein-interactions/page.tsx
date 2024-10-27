"use client";

import React, { useState, useRef, useEffect } from "react";
import { CosmographRef } from "@cosmograph/react";
import GraphView from "@/components/graph-view";
import NetworkRecipeDrawer from "@/components/network-recipe-drawer";
import FilterPanel from "@/components/network-filter-panel";
import { Graph, Node, Edge } from "@/lib/types";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import NodeDetailsDialog from "@/components/node-details-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
export default function ProteinInteractions() {
  const [seeds, setSeeds] = useState<string[]>([]);
  const [expansionMethod, setExpansionMethod] = useState<string>("PageRank");
  const [interactome, setInteractome] = useState<string>("string");
  const [completeGraph, setCompleteGraph] = useState<Graph | null>(null);
  const [filteredNodes, setFilteredNodes] = useState<Node[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<Edge[]>([]);
  const [combinedScore, setCombinedScore] = useState<number>(0);
  const [isGraphLoading, setIsGraphLoading] = useState<boolean>(false);
  const [selectedElement, setSelectedElement] = useState<Node | null>(null);
  const cosmographRef = useRef<CosmographRef<Node, Edge>>();
  const [visiblePanels, setVisiblePanels] = useState<string[]>(["graph"]);
  const [isNodeDetailsOpen, setIsNodeDetailsOpen] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    if (seeds.length > 0) {
      fetchNetwork();
    }
  }, [seeds, expansionMethod, interactome]);

  useEffect(() => {
    if (completeGraph) {
      filterGraph();
    }
  }, [completeGraph, combinedScore]);

  const fetchNetwork = async () => {
    setIsGraphLoading(true);
    try {
      const response = await fetch(
        `/api/protein-network?seeds=${seeds.join(",")}&expansionMethod=${expansionMethod}&interactome=${interactome}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Graph = await response.json();
      if (!data || !data.nodes || !data.links) {
        throw new Error('Invalid network data received');
      }
      
      setCompleteGraph(data);
    } catch (error) {
      console.error("Error fetching network:", error);
      toast.error("Failed to fetch protein network. Please try again later.");
      // Reset to initial state or maintain previous state
      setCompleteGraph(null);
      setFilteredNodes([]);
      setFilteredLinks([]);
    } finally {
      setIsGraphLoading(false);
    }
  };

  const filterGraph = () => {
    if (!completeGraph) return;

    const newFilteredLinks = completeGraph.links.filter(
      (link) => (link.combined_score || 0) >= combinedScore
    );
    const newFilteredNodes = completeGraph.nodes.filter((node) =>
      newFilteredLinks.some(
        (link) => link.source === node.id || link.target === node.id
      )
    );

    setFilteredLinks(newFilteredLinks);
    setFilteredNodes(newFilteredNodes);
  };

  const togglePanel = (panelName: string) => {
    setVisiblePanels((prev) =>
      prev.includes(panelName)
        ? prev.filter((p) => p !== panelName)
        : [...prev, panelName]
    );
  };

  const showPrompt = seeds.length === 0 && !completeGraph;

  const handleNodeClick = (node: Node | null) => {
    setSelectedElement(node);
    setIsNodeDetailsOpen(!!node);
  };

  return (
    <div className="flex flex-col relative h-[calc(100vh-2rem)]">
      {showPrompt ? (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center space-y-6">
            <p className="text-lg text-gray-600">
              Please input network settings to begin.
            </p>
            <NetworkRecipeDrawer
              seeds={seeds}
              setSeeds={setSeeds}
              interactome={interactome}
              setInteractome={setInteractome}
              expansionMethod={expansionMethod}
              setExpansionMethod={setExpansionMethod}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="absolute top-4 left-4 z-10 flex space-x-2">
            <NetworkRecipeDrawer
              seeds={seeds}
              setSeeds={setSeeds}
              interactome={interactome}
              setInteractome={setInteractome}
              expansionMethod={expansionMethod}
              setExpansionMethod={setExpansionMethod}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => togglePanel("filter")}
            >
              <FilterIcon className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => cosmographRef.current?.fitView(250)}
            >
              Fit View
            </Button>
          </div>
          <ResizablePanelGroup 
            direction={isMobile ? "vertical" : "horizontal"} 
            className="flex-grow rounded-lg"
          >
            {visiblePanels.map((panel, index) => (
              <React.Fragment key={panel}>
                {index > 0 && <ResizableHandle withHandle />}
                <ResizablePanel defaultSize={50} minSize={30}>
                  {panel === "graph" && (
                    <GraphView
                      cosmographRef={cosmographRef}
                      setSelectedElement={handleNodeClick}
                      completeGraph={completeGraph}
                      isGraphLoading={isGraphLoading}
                      expansionMethod={expansionMethod}
                      seeds={seeds}
                      filteredLinks={filteredLinks}
                      filteredNodes={filteredNodes}
                      isMobile={isMobile}
                    />
                  )}
                  {panel === "filter" && (
                    <FilterPanel
                      completeGraph={completeGraph}
                      filteredLinks={filteredLinks}
                      combinedScore={combinedScore}
                      setCombinedScore={setCombinedScore}
                    />
                  )}
                </ResizablePanel>
              </React.Fragment>
            ))}
          </ResizablePanelGroup>
        </>
      )}
      <NodeDetailsDialog
        node={selectedElement}
        isOpen={isNodeDetailsOpen}
        onClose={() => setIsNodeDetailsOpen(false)}
      />
    </div>
  );
}
