import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { useTheme } from "next-themes";
import { Edge, Graph } from "@/lib/types";
import { LoadingSpinner } from '@/components/ui/spinner'

type LinkData = {
  name: string;
  combinedScore: number;
};

interface FilterPanelProps {
  completeGraph: Graph | null;
  filteredLinks: Edge[];
  combinedScore: number;
  setCombinedScore: (value: number) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  completeGraph,
  filteredLinks,
  combinedScore,
  setCombinedScore,
}) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [linkData, setLinkData] = useState<LinkData[]>([]);

  useEffect(() => {
    handleFilterDataUpdate();
  }, [completeGraph]);

  const handleFilterDataUpdate = () => {
    setIsLoading(true);
    if (!completeGraph) {
      setIsLoading(false);
      return;
    }

    const newLinkData = completeGraph.links.map((edge: Edge) => ({
      name: `${edge.source} - ${edge.target}`,
      combinedScore: edge.combined_score || 0,
    }));

    setLinkData(newLinkData);
    setIsLoading(false);
  };

  const histogramData = useMemo(() => {
    if (linkData.length === 0) return [];

    const values = linkData.map((item) => item.combinedScore);

    const min = 0;
    const max = 1000;
    const binWidth = (max - min) / 20; // 20 bins for better distribution

    const histogram = Array(20)
      .fill(0)
      .map((_, i) => ({
        binStart: min + i * binWidth,
        binEnd: min + (i + 1) * binWidth,
        count: 0,
      }));

    values.forEach((value) => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), 19);
      histogram[binIndex].count++;
    });

    return histogram.map((bin) => ({
      name: bin.binStart.toFixed(0), // Display only the start of the bin as an integer
      binStart: bin.binStart,
      binEnd: bin.binEnd,
      count: bin.count,
    }));
  }, [linkData]);

  const resetScore = () => {
    setCombinedScore(0);
  };

  const handleBarClick = (data: any) => {
    if (data && data.activePayload) {
      const clickedBarData = data.activePayload[0].payload;
      setCombinedScore(clickedBarData.binStart);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 1000) {
      setCombinedScore(value);
    }
  };

  return (
    <div className="flex flex-col w-full h-full p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <Input
          type="number"
          value={combinedScore.toFixed(0)} // Round to nearest integer
          onChange={handleInputChange}
          className="w-32"
          step="10" // Allow increments of 10
          min="0"
          max="1000"
        />
        <Button variant="outline" onClick={resetScore}>
          Reset
        </Button>
      </div>
      {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner size={40} />
              </div>
      ) : (
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={histogramData} onClick={handleBarClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fill: theme === "dark" ? "#e5e7eb" : "#374151" }}
                tickFormatter={(value) => `${value}`} // Ensure it's displayed as a string
              />
              <YAxis tick={{ fill: theme === "dark" ? "#e5e7eb" : "#374151" }} />
              <Tooltip
                formatter={(value, name, props) => [value, `Score: ${props.payload.name} - ${props.payload.binEnd.toFixed(0)}`]}
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#374151" : "#ffffff",
                  color: theme === "dark" ? "#e5e7eb" : "#374151",
                  border: theme === "dark" ? "1px solid #4b5563" : "1px solid #d1d5db",
                }}
              />
              <Bar dataKey="count">
                {histogramData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.binEnd > combinedScore
                        ? theme === "dark"
                          ? "#4ade80"
                          : "#22c55e"
                        : theme === "dark"
                        ? "#6b7280"
                        : "#d1d5db"
                    }
                  />
                ))}
              </Bar>
              <ReferenceLine
                x={combinedScore.toFixed(0)} // Round to nearest integer
                stroke="#ef4444"
                strokeWidth={2}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
