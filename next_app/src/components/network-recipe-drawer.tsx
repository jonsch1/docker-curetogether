import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  Drawer,
  DrawerTitle,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Network } from "lucide-react";

interface RecipeDrawerProps {
  seeds: string[];
  setSeeds: (seeds: string[]) => void;
  interactome: string;
  expansionMethod: string;
  setExpansionMethod: (expansionMethod: string) => void;
  setInteractome: (interactome: string) => void;
}

const NetworkRecipeDrawer: React.FC<RecipeDrawerProps> = ({
  seeds,
  setSeeds,
  interactome,
  setInteractome,
  expansionMethod,
  setExpansionMethod,
}) => {
  const [seedsInput, setSeedsInput] = useState<string>(seeds.join(", "));

  const handleSeedsChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setSeedsInput(event.target.value);
  };

  const handleSeedsSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedInput = seedsInput.trim();
    setSeeds(
      trimmedInput
        ? trimmedInput.split(/\s*,\s*/).map((seed) => seed.trim().toUpperCase())
        : ["PLN", "SLN"]
    );
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="sm" variant="outline">
          <Network className="h-4 w-4 mr-2" />
          Network
        </Button>
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-[425px] mx-auto">
        <div className="max-h-[85vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Network Recipe</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div>
              <Label htmlFor="interactome" className="block mb-2 font-medium">
                Interactome
              </Label>
              <Select
                onValueChange={setInteractome}
                value={interactome}
              >
                <SelectTrigger id="interactome">
                  <SelectValue placeholder="Select Interactome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">STRINGdb physical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expansionMethod" className="block mb-2 font-medium">
                Expansion Method
              </Label>
              <Select
                onValueChange={setExpansionMethod}
                value={expansionMethod}
              >
                <SelectTrigger id="expansionMethod">
                  <SelectValue placeholder="Select Expansion Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PageRank">PageRank</SelectItem>
                  <SelectItem value="Subgraph">Subgraph</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <form onSubmit={handleSeedsSubmit}>
              <Label htmlFor="seedsInput" className="block mb-2 font-medium">
                Gene Symbols
              </Label>
              <div className="mb-2 text-sm text-muted-foreground">
                Enter HGNC gene symbols separated by commas.
              </div>
              <Textarea
                id="seedsInput"
                value={seedsInput}
                onChange={handleSeedsChange}
                placeholder="PLN, SLN"
                className="mb-4"
              />
              <Button type="submit" className="w-full">
                Update Seeds
              </Button>
            </form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NetworkRecipeDrawer;
