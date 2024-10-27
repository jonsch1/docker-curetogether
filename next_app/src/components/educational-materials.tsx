"use client"

import * as React from "react"
import { Book, BookOpen, FileText, Film, Laptop, Search, Upload, Users, Video } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const educationalMaterials = [
  {
    id: 1,
    title: "Introduction to Rare Diseases",
    type: "Article",
    author: "Dr. Emily Johnson",
    avatar: "/avatars/emily-johnson.jpg",
    date: "May 15, 2024",
    category: "General",
    difficulty: "Beginner",
    views: 1542,
    likes: 342,
    description: "A comprehensive overview of rare diseases, their impact, and the challenges in diagnosis and treatment.",
  },
  {
    id: 2,
    title: "Genetic Testing in Rare Diseases",
    type: "Video",
    author: "Prof. Michael Chen",
    avatar: "/avatars/michael-chen.jpg",
    date: "April 28, 2024",
    category: "Genetics",
    difficulty: "Intermediate",
    views: 987,
    likes: 201,
    description: "Learn about the latest advancements in genetic testing and their application in rare disease diagnosis.",
  },
  {
    id: 3,
    title: "Living with a Rare Disease: Patient Perspectives",
    type: "Webinar",
    author: "Sarah Martinez",
    avatar: "/avatars/sarah-martinez.jpg",
    date: "May 3, 2024",
    category: "Patient Support",
    difficulty: "Beginner",
    views: 2103,
    likes: 456,
    description: "A panel discussion featuring patients sharing their experiences and coping strategies.",
  },
  {
    id: 4,
    title: "Rare Disease Drug Development Pipeline",
    type: "Report",
    author: "David Thompson",
    avatar: "/avatars/david-thompson.jpg",
    date: "May 10, 2024",
    category: "Research",
    difficulty: "Advanced",
    views: 765,
    likes: 189,
    description: "An in-depth analysis of current and upcoming treatments for various rare diseases.",
  },
]

const recentlyViewed = [
  { id: 1, title: "Genetic Mutations in Rare Diseases", type: "Article" },
  { id: 2, title: "Navigating Insurance for Rare Disease Treatments", type: "Guide" },
  { id: 3, title: "Rare Disease Research Funding Opportunities", type: "Webinar" },
]

export function EducationalMaterialsComponent() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("")
  const [selectedDifficulty, setSelectedDifficulty] = React.useState("")

  const filteredMaterials = educationalMaterials.filter(material => 
    (material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     material.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
     material.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === "" || material.category === selectedCategory) &&
    (selectedDifficulty === "" || material.difficulty === selectedDifficulty)
  )

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Educational Materials</h2>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Submit Resource
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Materials</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="webinars">Webinars</TabsTrigger>
          </TabsList>
          <div className="flex space-x-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Array.from(new Set(educationalMaterials.map(material => material.category))).map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex w-full items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search educational materials..."
            className="flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMaterials.map((material) => (
              <Card key={material.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={material.avatar} alt={material.author} />
                    <AvatarFallback>{material.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <CardTitle className="text-lg">{material.author}</CardTitle>
                    <CardDescription>{material.date}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{material.title}</h3>
                  <div className="flex space-x-2 mb-2">
                    <Badge>{material.category}</Badge>
                    <Badge variant="outline">{material.difficulty}</Badge>
                  </div>
                  <p className="text-muted-foreground line-clamp-3">{material.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex space-x-4 text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{material.views}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{material.likes}</span>
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    {material.type === "Article" && <FileText className="mr-2 h-4 w-4" />}
                    {material.type === "Video" && <Video className="mr-2 h-4 w-4" />}
                    {material.type === "Webinar" && <Laptop className="mr-2 h-4 w-4" />}
                    {material.type === "Report" && <Book className="mr-2 h-4 w-4" />}
                    View {material.type}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <Separator className="my-4" />
      
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">Recently Viewed</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentlyViewed.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Resume
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">Submit Educational Material</h3>
        <Card>
          <CardHeader>
            <CardTitle>Contribute to Our Knowledge Base</CardTitle>
            <CardDescription>Share your expertise by submitting educational content about rare diseases.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Resource Title</Label>
                <Input id="title" placeholder="Enter the title of your educational material" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Resource Type</Label>
                <Select>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select resource type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="genetics">Genetics</SelectItem>
                    <SelectItem value="patient-support">Patient Support</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  placeholder="Provide a brief description of your educational material..."
                  className="w-full h-32 p-2 rounded-md border border-input bg-background"
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Submit Educational Material
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
