import React, { useState } from "react";
import { Node } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NodeDetailsDialogProps {
  node: Node | null;
  isOpen: boolean;
  onClose: () => void;
}

const NodeDetailsDialog: React.FC<NodeDetailsDialogProps> = ({
  node,
  isOpen,
  onClose,
}) => {
  if (!node) return null;

  const renderPubMedLinks = (references: string) => {
    return references.split(", ").map((ref, index) => (
      <React.Fragment key={index}>
        <a
          href={`https://pubmed.ncbi.nlm.nih.gov/${ref}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {ref}
        </a>
        {index < references.split(", ").length - 1 && ", "}
      </React.Fragment>
    ));
  };

  const formatPubMedReferences = (text: string) => {
    const parts = text.split(/(\([^)]+\))/);
    return parts.map((part, index) => {
      if (part.startsWith("(") && part.endsWith(")")) {
        const content = part.slice(1, -1);
        if (content.includes("PubMed:") || /^\d+(,\s*\d+)*$/.test(content)) {
          const pubmedIds = content
            .split(", ")
            .map((id) => id.replace("PubMed:", "").trim());
          return (
            <React.Fragment key={index}>
              ({renderPubMedLinks(pubmedIds.join(", "))})
              <br />
              <br />
            </React.Fragment>
          );
        }
      }
      return part.replace(". ", "");
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[80vh] flex flex-col rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <DialogHeader className="flex items-center justify-between p-4 border-b">
          <DialogTitle className="text-lg font-semibold">{node.id}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {node.uniprot_data && (
              <>
                <p className="text-sm text-gray-500 mb-2">
                  {node.uniprot_data["Protein names"]}
                </p>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-1">Gene Names</h4>
                  <p className="text-sm">
                    Primary: {node.uniprot_data["Gene Names (primary)"]}
                  </p>
                  {node.uniprot_data["Gene Names (synonym)"] && (
                    <p className="text-sm text-gray-500">
                      Synonyms: {node.uniprot_data["Gene Names (synonym)"]}
                    </p>
                  )}
                </div>

                {node.uniprot_data["Function [CC]"] && (
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold mb-1">Function</h4>
                    <p className="text-sm">
                      {formatPubMedReferences(node.uniprot_data["Function [CC]"])}
                    </p>
                  </div>
                )}

                {node.uniprot_data["Subcellular location [CC]"] && (
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold mb-1">Subcellular Location</h4>
                    <p className="text-sm">
                      {formatPubMedReferences(node.uniprot_data["Subcellular location [CC]"])}
                    </p>
                  </div>
                )}
              </>
            )}

            {node.Drugcentral_data && (
              <div className="mb-3">
                <h4 className="text-sm font-semibold mb-1">Drugcentral Data</h4>
                <div className="flex flex-wrap gap-1">
                  {node.Drugcentral_data.DRUG_NAME.map((drug, index) => (
                    <Badge key={index} variant="secondary">
                      {drug}
                      {node.Drugcentral_data?.ACTION_TYPE?.[index] && 
                        ` (${node.Drugcentral_data.ACTION_TYPE[index]})`}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {node.Drugbank_data && (
              <div className="mb-3">
                <h4 className="text-sm font-semibold mb-1">Drugbank Data</h4>
                <div className="flex flex-wrap gap-1">
                  {node.Drugbank_data.Name?.map((drug, index) => (
                    <Badge key={index} variant="secondary">
                      {drug}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => {
              if (node.uniprot_data?.["Entry"]) {
                window.open(
                  `https://apps.pathwaycommons.org/search?q=${node.uniprot_data["Entry"]}`,
                  "_blank"
                );
              }
              if (node.id) {
                window.open(
                  `https://pfocr.wikipathways.org/search.html?query=${node.id}`,
                  "_blank"
                );
              }
            }}
            className="w-full mt-4"
          >
            Search Pathways
          </Button>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NodeDetailsDialog;
