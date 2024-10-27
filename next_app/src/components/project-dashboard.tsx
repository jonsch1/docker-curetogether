"use client"

import * as React from "react"
import { BarChart, Brain, FileText, MessageSquare, PenTool, Plus, Users } from "lucide-react"
import { useParams } from "next/navigation"
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { LoadingSpinner } from '@/components/ui/spinner'

interface Activity {
  id: number;
  user: string;
  action: string;
  time: string;
}

interface MolecularStatement {
  id: number;
  text: string;
  confidence: number;
}

export function ProjectDashboardComponent() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/project/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch project")
        const data = await response.json()
        setProject(data)
      } catch (error) {
        console.error("Error fetching project:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProject()
    }
  }, [params.id])
  
  console.log(params.id)

  if (loading) {
    return         <div className="absolute inset-0 flex items-center justify-center">
    <LoadingSpinner size={40} />
  </div>
  }

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{project.projectName}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Invite Collaborators
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Progress</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.progress}%</div>
            <Progress value={project.progress} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statements Curated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.statementsCurated}</div>
            <p className="text-xs text-muted-foreground">
              {project.weeklyChanges.statements >= 0 ? '+' : ''}{project.weeklyChanges.statements} from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hypotheses Submitted</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.hypothesesSubmitted}</div>
            <p className="text-xs text-muted-foreground">
              {project.weeklyChanges.hypotheses >= 0 ? '+' : ''}{project.weeklyChanges.hypotheses} from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collaborators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.collaboratorCount}</div>
            <p className="text-xs text-muted-foreground">
              {project.weeklyChanges.collaborators >= 0 ? '+' : ''}{project.weeklyChanges.collaborators} new this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Project Activity</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart
                data={project.weeklyStats}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Area 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="statements" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  name="Statements"
                />
                <Area 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="hypotheses" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  name="Hypotheses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from the project</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full">
              {project.recentActivity.map((activity: Activity, index: number) => (
                <div key={activity.id} className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.user}
                      <span className="text-muted-foreground"> {activity.action}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                  {index < project.recentActivity.length - 1 && <Separator className="col-span-2 my-2" />}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Project Actions</CardTitle>
            <CardDescription>Contribute to the project's progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Button className="w-full" onClick={() => router.push('/projects/curate')}>
                <PenTool className="mr-2 h-4 w-4" /> Curate Statements
              </Button>
              <Button className="w-full" variant="outline" onClick={() => router.push(`/content?type=discussion&projectId=${project.id}`)}>
                <MessageSquare className="mr-2 h-4 w-4" /> Join Discussions
              </Button>
              <Button className="w-full" variant="secondary" onClick={() => router.push(`/content?type=hypothesis&projectId=${project.id}`)}>
                <Brain className="mr-2 h-4 w-4" /> Submit Hypothesis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Molecular Statements</CardTitle>
            <CardDescription>Recently curated statements</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] w-full">
              {project.molecularStatements.map((statement: MolecularStatement) => (
                <div key={statement.id} className="mb-4 flex items-center justify-between">
                  <p className="text-sm">{statement.text}</p>
                  <Badge variant={statement.confidence > 0.9 ? "default" : "secondary"}>
                    {(statement.confidence * 100).toFixed(0)}% confidence
                  </Badge>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Statements</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
