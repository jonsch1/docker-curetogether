"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Bar, BarChart, ResponsiveContainer } from "recharts"
import { Brain, Filter, HeartPulse, Microscope, Search, SlidersHorizontal, Star, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

import { Project, User, Content, Statement } from '@prisma/client'
import { useEffect, useState } from 'react'

type ProjectWithRelations = Project & {
  author: User;
  collaborators: { user: User }[];
  contents: Content[];
  statements: Statement[];
}

const projectCategories = [
  { value: "neurological", label: "Neurological Disorders" },
  { value: "metabolic", label: "Metabolic Diseases" },
  { value: "genetic", label: "Genetic Disorders" },
  { value: "autoimmune", label: "Autoimmune Diseases" },
  { value: "cardiovascular", label: "Cardiovascular Disorders" },
]

type ActivityData = {
  name: string;
  statements: number;
  hypotheses: number;
}

function generateActivityData(project: ProjectWithRelations): ActivityData[] {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const activityData = days.map(day => ({
    name: day,
    statements: 0,
    hypotheses: 0,
  }));

  // Count statements from the Statement model
  project.statements.forEach(statement => {
    const contentDate = new Date(statement.createdAt).toISOString().split('T')[0];
    const dayIndex = days.indexOf(contentDate);
    if (dayIndex !== -1) {
      activityData[dayIndex].statements++;
    }
  });

  // Count hypotheses from the Content model
  project.contents.forEach(content => {
    const contentDate = new Date(content.createdAt).toISOString().split('T')[0];
    const dayIndex = days.indexOf(contentDate);
    if (dayIndex !== -1 && content.type === 'hypothesis') {
      activityData[dayIndex].hypotheses++;
    }
  });

  return activityData;
}

export function ExploreProjectsComponent() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStages, setSelectedStages] = useState<string[]>([])
  const [projects, setProjects] = useState<ProjectWithRelations[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects/getAll')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const filteredProjects = projects.filter(project => 
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategories.length === 0 || selectedCategories.includes(project.diseaseCategory)) &&
    (selectedStages.length === 0 || true)
  )

  // Add this new function to sort projects by creation date
  const getTabProjects = (tab: string) => {
    if (tab === 'new') {
      return [...filteredProjects].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return filteredProjects;
  }

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Explore Projects</h2>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="new">Newly Added</TabsTrigger>
          </TabsList>
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter Projects
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[220px] p-0" align="end">
                <Command>
                  <CommandInput placeholder="Search categories..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Categories">
                      {projectCategories.map(category => (
                        <CommandItem key={category.value} onSelect={() => {
                          setSelectedCategories(prev => 
                            prev.includes(category.value) 
                              ? prev.filter(c => c !== category.value)
                              : [...prev, category.value]
                          )
                        }}>
                          <Checkbox
                            checked={selectedCategories.includes(category.value)}
                            className="mr-2 h-4 w-4"
                          />
                          {category.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex w-full items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getTabProjects('all').map((project) => (
              <Card key={project.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">
                    {project.projectName}
                  </CardTitle>
                  {/* You can add an icon based on disease category */}
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">{project.description}</div>
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline">{project.diseaseCategory}</Badge>
                    {/* Add more badges as needed */}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {project.collaborators.length} members
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div>Lead: {project.author.name}</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => router.push(`/projects/${project.id}`)}>
                    View Project Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="new" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getTabProjects('new').map((project) => (
              <Card key={project.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">
                    {project.projectName}
                  </CardTitle>
                  {/* You can add an icon based on disease category */}
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">{project.description}</div>
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline">{project.diseaseCategory}</Badge>
                    {/* Add more badges as needed */}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {project.collaborators.length} members
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div>Lead: {project.author.name}</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => router.push(`/projects/${project.id}`)}>
                    View Project Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
