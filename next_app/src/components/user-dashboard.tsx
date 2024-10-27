"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { BookOpen, Brain, FileText, HeartPulse, Microscope, Plus, Sparkles, Users } from "lucide-react"
import { Suspense } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useSession } from "next-auth/react"
import { LoadingSpinner } from '@/components/ui/spinner'
// Sample data for the user dashboard
const userData = {
  name: "Dr. Jane Doe",
  avatar: "/avatars/jane-doe.jpg",
  role: "Senior Researcher",
  projects: [
    { name: "Cystic Fibrosis Research", icon: HeartPulse, progress: 65 },
    { name: "Huntington's Disease Study", icon: Brain, progress: 30 },
    { name: "Rare Blood Disorders", icon: Microscope, progress: 80 },
  ],
  recentActivity: [
    { project: "Cystic Fibrosis Research", action: "Curated 3 new statements", time: "2 hours ago" },
    { project: "Huntington's Disease Study", action: "Commented on hypothesis #24", time: "1 day ago" },
    { project: "Rare Blood Disorders", action: "Uploaded new experimental data", time: "3 days ago" },
    { project: "Cystic Fibrosis Research", action: "Started a new discussion thread", time: "1 week ago" },
  ],
  collaborators: [
    { name: "Dr. John Smith", avatar: "/avatars/john-smith.jpg" },
    { name: "Prof. Emily Chen", avatar: "/avatars/emily-chen.jpg" },
    { name: "Dr. Michael Johnson", avatar: "/avatars/michael-johnson.jpg" },
    { name: "Dr. Sarah Lee", avatar: "/avatars/sarah-lee.jpg" },
  ],
  contributionData: [
    { month: "Jan", statements: 20, hypotheses: 2, discussions: 5 },
    { month: "Feb", statements: 35, hypotheses: 3, discussions: 8 },
    { month: "Mar", statements: 25, hypotheses: 1, discussions: 10 },
    { month: "Apr", statements: 40, hypotheses: 4, discussions: 12 },
    { month: "May", statements: 50, hypotheses: 5, discussions: 15 },
  ],
  impactScore: 78,
  impactHistory: [
    { month: "Jan", score: 65 },
    { month: "Feb", score: 68 },
    { month: "Mar", score: 72 },
    { month: "Apr", score: 75 },
    { month: "May", score: 78 },
  ],
}

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "overview"
  const { data: session } = useSession()
  const setTab = (newTab: string) => {
    router.push(`?tab=${newTab}`, { scroll: false })
  }

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {session?.user?.name}</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Join New Project
          </Button>
        </div>
      </div>
      
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Projects
                </CardTitle>
                <div className="h-4 w-4 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData.projects.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Collaborators
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData.collaborators.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Contributions
                </CardTitle>
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userData.contributionData.reduce((sum, month) => sum + month.statements + month.hypotheses + month.discussions, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Impact Score
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData.impactScore}</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Contribution Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    statements: {
                      label: "Curated Statements",
                      color: "hsl(var(--chart-1))",
                    },
                    hypotheses: {
                      label: "Hypotheses",
                      color: "hsl(var(--chart-2))",
                    },
                    discussions: {
                      label: "Discussions",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userData.contributionData}>
                      <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="statements" fill="var(--color-statements)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="hypotheses" fill="var(--color-hypotheses)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="discussions" fill="var(--color-discussions)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {userData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.project}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Impact Score Trend</CardTitle>
                <CardDescription>Your contribution impact over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    score: {
                      label: "Impact Score",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userData.impactHistory}>
                      <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="score" stroke="var(--color-score)" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Collaborators</CardTitle>
                <CardDescription>Researchers you frequently work with</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                {userData.collaborators.map((collaborator, index) => (
                  <div key={index} className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                    <Avatar>
                <AvatarImage src={`https://avatar.vercel.sh/${collaborator.name || 'Guest'}`} alt={collaborator.name || 'Guest'} />
              </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{collaborator.name}</p>
                        <p className="text-sm text-muted-foreground">Collaborator</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View Profile</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userData.projects.map((project, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">
                    {project.name}
                  </CardTitle>
                  <project.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-muted-foreground">Project Progress</p>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">View Project</Button>
                </CardFooter>
              </Card>
            ))}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  Join New Project
                </CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Explore and join new research projects in rare diseases.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Explore Projects</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="contributions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Contributions</CardTitle>
              <CardDescription>Overview of your research contributions across all projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium leading-none">Curated Statements</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {userData.contributionData.reduce((sum, month) => sum + month.statements, 0)} total
                    </p>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium leading-none">Hypotheses Generated</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {userData.contributionData.reduce((sum, month) => sum + month.hypotheses, 0)} total
                    
                    </p>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium leading-none">Discussion Participations</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {userData.contributionData.reduce((sum, month) => sum + month.discussions, 0)} total
                    </p>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function UserDashboard() {
  return (
    <Suspense fallback={        <div className="absolute inset-0 flex items-center justify-center">
      <LoadingSpinner size={40} />
    </div>}>
      <DashboardContent />
    </Suspense>
  )
}
