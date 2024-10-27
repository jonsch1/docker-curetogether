"use client"

import * as React from "react"
import { Brain, ChevronDown, FileText, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for hypotheses
const hypothesesData = [
  {
    id: 1,
    title: "CFTR Modulator Combination Therapy for Rare CF Mutations",
    author: {
      name: "Dr. Emily Johnson",
      avatar: "/avatars/emily-johnson.jpg",
      role: "Researcher"
    },
    date: "2024-03-18T14:30:00Z",
    project: "Cystic Fibrosis Research",
    status: "Under Review",
    upvotes: 15,
    downvotes: 2,
    comments: 8,
    description: "I hypothesize that a combination of next-generation CFTR modulators could effectively treat rare CF mutations that are currently non-responsive to available therapies.",
    supportingEvidence: [
      "Recent studies show synergistic effects of combining different classes of CFTR modulators.",
      "In vitro experiments demonstrate improved CFTR function in cells with rare mutations when treated with novel modulator combinations.",
      "Clinical case reports suggest potential benefits in patients with rare mutations who have tried off-label combination therapies."
    ],
    proposedExperiment: "Conduct a multi-center, randomized controlled trial testing a triple combination of a potentiator, corrector, and amplifier in patients with rare CF mutations. Measure outcomes including sweat chloride, lung function, and quality of life over 12 months."
  },
  {
    id: 2,
    title: "Gut Microbiome Modulation to Alleviate ALS Symptoms",
    author: {
      name: "Dr. Michael Lee",
      avatar: "/avatars/michael-lee.jpg",
      role: "Researcher"
    },
    date: "2024-03-17T10:15:00Z",
    project: "ALS Study",
    status: "Approved",
    upvotes: 22,
    downvotes: 1,
    comments: 12,
    description: "I propose that targeted modulation of the gut microbiome could potentially alleviate symptoms and slow progression in ALS patients by reducing neuroinflammation and improving metabolic health.",
    supportingEvidence: [
      "Recent studies have shown alterations in the gut microbiome composition of ALS patients compared to healthy controls.",
      "Animal models of ALS demonstrate improvements in disease progression when treated with specific probiotic strains.",
      "Emerging evidence suggests a strong gut-brain axis influence on neuroinflammation, a key factor in ALS pathogenesis."
    ],
    proposedExperiment: "Conduct a double-blind, placebo-controlled trial in ALS patients using a specifically designed probiotic and prebiotic regimen. Monitor changes in microbiome composition, inflammatory markers, and clinical ALS progression scores over 18 months."
  }
]

export function ProjectsHypothesesComponent() {
  const [activeTab, setActiveTab] = React.useState("submit")
  const [projectFilter, setProjectFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [sortBy, setSortBy] = React.useState("recent")

  // State for new hypothesis submission
  const [newHypothesis, setNewHypothesis] = React.useState({
    title: "",
    project: "",
    description: "",
    supportingEvidence: "",
    proposedExperiment: ""
  })

  const handleHypothesisSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitted hypothesis:", newHypothesis)
    // Here you would typically send the data to your backend
    // Reset form after submission
    setNewHypothesis({
      title: "",
      project: "",
      description: "",
      supportingEvidence: "",
      proposedExperiment: ""
    })
  }

  const filteredHypotheses = hypothesesData.filter(hypothesis => 
    (projectFilter === "all" || hypothesis.project === projectFilter) &&
    (statusFilter === "all" || hypothesis.status.toLowerCase() === statusFilter)
  )

  return (
    <div className="container mx-auto ">
      <h1 className="text-3xl font-bold mb-6">Hypothesis Submission and Review</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="submit">Submit Hypothesis</TabsTrigger>
          <TabsTrigger value="review">Review Hypotheses</TabsTrigger>
        </TabsList>

        <TabsContent value="submit">
          <Card>
            <CardHeader>
              <CardTitle>Submit a New Hypothesis</CardTitle>
              <CardDescription>
                Propose your hypothesis based on curated statements and research findings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleHypothesisSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Hypothesis Title</Label>
                  <Input
                    id="title"
                    value={newHypothesis.title}
                    onChange={(e) => setNewHypothesis({...newHypothesis, title: e.target.value})}
                    placeholder="Enter a concise title for your hypothesis"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project">Related Project</Label>
                  <Select
                    value={newHypothesis.project}
                    onValueChange={(value) => setNewHypothesis({...newHypothesis, project: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select related project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cystic Fibrosis Research">Cystic Fibrosis Research</SelectItem>
                      <SelectItem value="ALS Study">ALS Study</SelectItem>
                      <SelectItem value="Rare Blood Disorders">Rare Blood Disorders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Hypothesis Description</Label>
                  <Textarea
                    id="description"
                    value={newHypothesis.description}
                    onChange={(e) => setNewHypothesis({...newHypothesis, description: e.target.value})}
                    placeholder="Describe your hypothesis in detail"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportingEvidence">Supporting Evidence</Label>
                  <Textarea
                    id="supportingEvidence"
                    value={newHypothesis.supportingEvidence}
                    onChange={(e) => setNewHypothesis({...newHypothesis, supportingEvidence: e.target.value})}
                    placeholder="List the evidence supporting your hypothesis"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proposedExperiment">Proposed Experiment</Label>
                  <Textarea
                    id="proposedExperiment"
                    value={newHypothesis.proposedExperiment}
                    onChange={(e) => setNewHypothesis({...newHypothesis, proposedExperiment: e.target.value})}
                    placeholder="Describe an experiment to test your hypothesis"
                    required
                  />
                </div>
                <Button type="submit">Submit Hypothesis</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="projectFilter">Filter by Project</Label>
                  <Select value={projectFilter} onValueChange={setProjectFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      <SelectItem value="Cystic Fibrosis Research">Cystic Fibrosis Research</SelectItem>
                      <SelectItem value="ALS Study">ALS Study</SelectItem>
                      <SelectItem value="Rare Blood Disorders">Rare Blood Disorders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="statusFilter">Filter by Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="under review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="sortBy">Sort by</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="upvotes">Most Upvotes</SelectItem>
                      <SelectItem value="comments">Most Comments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {filteredHypotheses.map((hypothesis) => (
              <Accordion type="single" collapsible key={hypothesis.id}>
                <AccordionItem value={`hypothesis-${hypothesis.id}`}>
                  <AccordionTrigger>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={hypothesis.author.avatar} alt={hypothesis.author.name} />
                          <AvatarFallback>{hypothesis.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold text-left">{hypothesis.title}</h3>
                          <p className="text-sm text-muted-foreground text-left">
                            by {hypothesis.author.name} | {new Date(hypothesis.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={hypothesis.status === "Approved" ? "default" : "secondary"}>
                          {hypothesis.status}
                        </Badge>
                        <span className="flex items-center space-x-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{hypothesis.upvotes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <ThumbsDown className="w-4 h-4" />
                          <span>{hypothesis.downvotes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{hypothesis.comments}</span>
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold">Description:</h4>
                            <p>{hypothesis.description}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Supporting Evidence:</h4>
                            <ul className="list-disc pl-5">
                              {hypothesis.supportingEvidence.map((evidence, index) => (
                                <li key={index}>{evidence}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold">Proposed Experiment:</h4>
                            <p>{hypothesis.proposedExperiment}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Add Comment
                        </Button>
                        <div className="space-x-2">
                          <Button variant="outline">
                            <ThumbsUp className="mr-2 h-4 w-4" />
                            Upvote
                          </Button>
                          <Button variant="outline">
                            <ThumbsDown className="mr-2 h-4 w-4" />
                            Downvote
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </AccordionContent>
                
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Hypothesis Submission Guidelines</CardTitle>
          <CardDescription>
            Follow these guidelines to ensure your hypothesis is well-formulated and ready for review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <ul className="list-disc pl-6 space-y-2">
              <li>Clearly state your hypothesis in a concise, testable form.</li>
              <li>Provide a detailed description of the rationale behind your hypothesis.</li>
              <li>Include relevant background information and cite existing research that supports your idea.</li>
              <li>Explain how your hypothesis relates to the specific rare disease or research project.</li>
              <li>Describe the potential impact of your hypothesis if proven correct.</li>
              <li>Outline a feasible experiment or study that could test your hypothesis.</li>
              <li>Consider potential alternative explanations and address them in your submission.</li>
              <li>Use clear, scientific language and avoid jargon when possible.</li>
              <li>Be open to feedback and prepared to refine your hypothesis based on peer review.</li>
              <li>Ensure your hypothesis adheres to ethical standards in medical research.</li>
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}