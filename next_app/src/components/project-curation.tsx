"use client"

import * as React from "react"
import { Check, ChevronLeft, ChevronRight, HelpCircle, ThumbsDown, ThumbsUp, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

// Sample data for statement curation
const statementData = [
  {
    id: 1,
    text: "CFTR gene mutations lead to defective chloride transport in cystic fibrosis patients.",
    source: "Smith et al., Journal of Cystic Fibrosis, 2023",
    confidence: 0.92,
    entities: ["CFTR gene", "chloride transport", "cystic fibrosis"],
  },
  {
    id: 2,
    text: "Increased ENaC activity contributes to airway dehydration in CF airways.",
    source: "Johnson et al., American Journal of Respiratory Cell and Molecular Biology, 2022",
    confidence: 0.87,
    entities: ["ENaC", "airway dehydration", "CF airways"],
  },
  {
    id: 3,
    text: "Pseudomonas aeruginosa biofilms are more resistant to antibiotics in the CF lung environment.",
    source: "Garcia et al., Journal of Bacteriology, 2023",
    confidence: 0.89,
    entities: ["Pseudomonas aeruginosa", "biofilms", "antibiotics", "CF lung"],
  },
]

export function ProjectCurationComponent() {
  const [currentStatementIndex, setCurrentStatementIndex] = React.useState(0)
  const [curatedStatements, setCuratedStatements] = React.useState<number[]>([])
  const [userFeedback, setUserFeedback] = React.useState<Record<number, 'accept' | 'reject' | null>>({})
  const [userNotes, setUserNotes] = React.useState<Record<number, string>>({})

  const currentStatement = statementData[currentStatementIndex]

  const handleAccept = () => {
    setCuratedStatements([...curatedStatements, currentStatement.id])
    setUserFeedback({ ...userFeedback, [currentStatement.id]: 'accept' })
    if (currentStatementIndex < statementData.length - 1) {
      setCurrentStatementIndex(currentStatementIndex + 1)
    }
  }

  const handleReject = () => {
    setUserFeedback({ ...userFeedback, [currentStatement.id]: 'reject' })
    if (currentStatementIndex < statementData.length - 1) {
      setCurrentStatementIndex(currentStatementIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStatementIndex > 0) {
      setCurrentStatementIndex(currentStatementIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentStatementIndex < statementData.length - 1) {
      setCurrentStatementIndex(currentStatementIndex + 1)
    }
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Statement Curation</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Review Statement</CardTitle>
            <CardDescription>
              Validate the automatically extracted statement and provide feedback.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Statement:</h3>
                <p className="text-lg">{currentStatement.text}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Source:</h3>
                <p>{currentStatement.source}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Confidence Score:</h3>
                <div className="flex items-center space-x-2">
                  <Progress value={currentStatement.confidence * 100} className="w-1/2" />
                  <span>{(currentStatement.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Entities:</h3>
                <div className="flex flex-wrap gap-2">
                  {currentStatement.entities.map((entity, index) => (
                    <Badge key={index} variant="secondary">{entity}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Your Notes:</h3>
                <Textarea
                  placeholder="Add any additional notes or comments here..."
                  value={userNotes[currentStatement.id] || ''}
                  onChange={(e) => setUserNotes({ ...userNotes, [currentStatement.id]: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button onClick={handlePrevious} disabled={currentStatementIndex === 0}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={handleNext} disabled={currentStatementIndex === statementData.length - 1}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleReject} variant="outline">
                      <ThumbsDown className="mr-2 h-4 w-4" /> Reject
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reject this statement if it's inaccurate or irrelevant</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleAccept}>
                      <ThumbsUp className="mr-2 h-4 w-4" /> Accept
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Accept this statement if it's accurate and relevant</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Curation Progress</CardTitle>
            <CardDescription>
              Track your progress and review curated statements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Statements Reviewed:</h3>
                <Progress value={(curatedStatements.length / statementData.length) * 100} className="w-full" />
                <p className="text-sm text-muted-foreground mt-1">
                  {curatedStatements.length} of {statementData.length}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Curated Statements:</h3>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  {statementData.map((statement, index) => (
                    <div key={statement.id} className="flex items-center space-x-2 mb-2">
                      {userFeedback[statement.id] === 'accept' && <Check className="text-green-500" />}
                      {userFeedback[statement.id] === 'reject' && <X className="text-red-500" />}
                      <span className={index === currentStatementIndex ? "font-bold" : ""}>
                        Statement {statement.id}
                      </span>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statements</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
              </SelectContent>
            </Select>
          </CardFooter>
        </Card>
      </div>
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Curation Guidelines</CardTitle>
            <CardDescription>
              Follow these guidelines to ensure consistent and accurate curation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Verify that the statement is relevant to the rare disease being studied.</li>
              <li>Check for accuracy by cross-referencing with the provided source.</li>
              <li>Ensure that the identified entities are correctly associated with the statement.</li>
              <li>Consider the confidence score, but use your judgment for final decisions.</li>
              <li>Add notes for any ambiguities or additional context that might be helpful.</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <HelpCircle className="mr-2 h-4 w-4" /> View Full Curation Manual
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}