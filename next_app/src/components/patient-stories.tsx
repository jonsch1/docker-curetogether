"use client"

import * as React from "react"
import { BookOpen, Heart, MessageCircle, Search, Share2, ThumbsUp } from "lucide-react"

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

const patientStories = [
  {
    id: 1,
    title: "Living with Cystic Fibrosis: My Journey to Lung Transplant",
    author: "Emily Johnson",
    avatar: "/avatars/emily-johnson.jpg",
    disease: "Cystic Fibrosis",
    date: "May 15, 2024",
    content: "I was diagnosed with cystic fibrosis at the age of 2. Throughout my life, I've faced numerous challenges, but I've also experienced incredible moments of hope and resilience. In this story, I share my journey leading up to my recent lung transplant and how it has transformed my life.",
    likes: 342,
    comments: 56,
    shares: 89,
  },
  {
    id: 2,
    title: "Navigating Life with Ehlers-Danlos Syndrome",
    author: "Michael Chen",
    avatar: "/avatars/michael-chen.jpg",
    disease: "Ehlers-Danlos Syndrome",
    date: "April 28, 2024",
    content: "Ehlers-Danlos Syndrome (EDS) is often called an invisible illness. In this story, I discuss the challenges of living with a condition that others can't see, and how I've learned to advocate for myself in medical settings and in my daily life.",
    likes: 287,
    comments: 43,
    shares: 62,
  },
  {
    id: 3,
    title: "My Rare Journey: Diagnosed with Pompe Disease at 30",
    author: "Sarah Martinez",
    avatar: "/avatars/sarah-martinez.jpg",
    disease: "Pompe Disease",
    date: "May 3, 2024",
    content: "After years of unexplained muscle weakness, I was finally diagnosed with Pompe disease at the age of 30. This is my story of perseverance through misdiagnoses, the relief of finally having answers, and my experience with enzyme replacement therapy.",
    likes: 195,
    comments: 37,
    shares: 51,
  },
  {
    id: 4,
    title: "Growing Up with Phenylketonuria (PKU)",
    author: "David Thompson",
    avatar: "/avatars/david-thompson.jpg",
    disease: "Phenylketonuria",
    date: "May 10, 2024",
    content: "Diagnosed with PKU at birth, I've lived my entire life on a strictly controlled diet. In this story, I share the challenges of growing up with dietary restrictions, how I've managed my condition through different life stages, and the exciting developments in PKU treatment.",
    likes: 231,
    comments: 48,
    shares: 73,
  },
]

export function PatientStoriesComponent() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedDisease, setSelectedDisease] = React.useState("")

  const filteredStories = patientStories.filter(story => 
    (story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     story.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
     story.disease.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedDisease === "" || story.disease === selectedDisease)
  )

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Patient Stories</h2>
        <Button>
          <BookOpen className="mr-2 h-4 w-4" />
          Submit Your Story
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Stories</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="recent">Recently Added</TabsTrigger>
          </TabsList>
          <div className="flex space-x-2">
            <Select value={selectedDisease} onValueChange={setSelectedDisease}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by disease" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Diseases</SelectItem>
                {Array.from(new Set(patientStories.map(story => story.disease))).map(disease => (
                  <SelectItem key={disease} value={disease}>{disease}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex w-full items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stories by title, author, or disease..."
            className="flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStories.map((story) => (
              <Card key={story.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={story.avatar} alt={story.author} />
                    <AvatarFallback>{story.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <CardTitle className="text-lg">{story.author}</CardTitle>
                    <CardDescription>{story.date}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
                  <Badge className="mb-2">{story.disease}</Badge>
                  <p className="text-muted-foreground line-clamp-4">{story.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-4 text-muted-foreground">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{story.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{story.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <Share2 className="h-4 w-4" />
                      <span>{story.shares}</span>
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">Read More</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <Separator className="my-4" />
      
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">Share Your Story</h3>
        <p className="text-muted-foreground">
          Your experience matters. By sharing your story, you can inspire others, raise awareness, and contribute to the understanding of rare diseases.
        </p>
        <Card>
          <CardHeader>
            <CardTitle>Submit a New Story</CardTitle>
            <CardDescription>Fill out the form below to share your rare disease journey.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Story Title</Label>
                <Input id="title" placeholder="Enter a title for your story" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disease">Rare Disease</Label>
                <Input id="disease" placeholder="Enter the name of the rare disease" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Your Story</Label>
                <textarea
                  id="content"
                  placeholder="Share your experience living with a rare disease..."
                  className="w-full h-32 p-2 rounded-md border border-input bg-background"
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Heart className="mr-2 h-4 w-4" />
              Submit Your Story
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
