"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Brain, FileText, Globe, HeartPulse, Microscope, Plus, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const projectSchema = z.object({
  projectName: z.string().min(3, {
    message: "Project name must be at least 3 characters.",
  }),
  diseaseName: z.string().min(3, {
    message: "Disease name must be at least 3 characters.",
  }),
  diseaseCategory: z.string({
    required_error: "Please select a disease category.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  researchGoals: z.string().min(10, {
    message: "Research goals must be at least 10 characters.",
  }),
  isPublic: z.boolean().default(true),
  allowCollaboration: z.boolean().default(true),
})

export function CreateNewProjectComponent() {
  const router = useRouter()
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: "",
      diseaseName: "",
      diseaseCategory: "",
      description: "",
      researchGoals: "",
      isPublic: true,
      allowCollaboration: true,
    },
  })

  async function onSubmit(values: z.infer<typeof projectSchema>) {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to create project")
      }

      const project = await response.json()
      toast.success("Project created successfully!")
      router.push(`/projects/${project.id}`)
    } catch (error) {
      console.error("Error creating project:", error)
      toast.error("Failed to create project. Please try again.")
    }
  }

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
          <CardDescription>
            Start a new research project for a rare disease. Fill in the details below to begin your collaboration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a descriptive name for your research project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="diseaseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disease Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter rare disease name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Specify the rare disease you're researching.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="diseaseCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disease Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="neurological">
                          <div className="flex items-center">
                            <Brain className="mr-2 h-4 w-4" />
                            <span>Neurological</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="cardiovascular">
                          <div className="flex items-center">
                            <HeartPulse className="mr-2 h-4 w-4" />
                            <span>Cardiovascular</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="immunological">
                          <div className="flex items-center">
                            <Microscope className="mr-2 h-4 w-4" />
                            <span>Immunological</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="other">
                          <div className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" />
                            <span>Other</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the category that best fits your rare disease.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a brief description of your research project"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Explain the focus and scope of your project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="researchGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Research Goals</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List your primary research goals and objectives"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Outline the main objectives you hope to achieve with this project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Make this project public
                      </FormLabel>
                      <FormDescription>
                        Public projects are visible to all users and can attract more collaborators.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="allowCollaboration"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Allow collaboration
                      </FormLabel>
                      <FormDescription>
                        Enable other researchers and citizen scientists to contribute to your project.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <div>
                <Button type="submit">Create Project</Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Existing Project
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
