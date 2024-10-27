"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Brain, FileText, Plus } from "lucide-react"

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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const topicSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  type: z.enum(["hypothesis", "forum_post"], {
    required_error: "Please select a topic type.",
  }),
  content: z.string().min(20, {
    message: "Content must be at least 20 characters.",
  }),
  tags: z.string().refine((val) => val.split(',').filter(Boolean).length > 0, {
    message: "At least one tag is required.",
  }),
})

export function CreateTopicComponent() {
  const form = useForm<z.infer<typeof topicSchema>>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      title: "",
      type: "forum_post",
      content: "",
      tags: "",
    },
  })

  function onSubmit(values: z.infer<typeof topicSchema>) {
    // Here you would typically send the form data to your backend
    console.log(values)
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Create New Topic</CardTitle>
          <CardDescription>
            Start a new discussion or propose a hypothesis for the rare disease research community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter topic title" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a clear and concise title for your topic.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hypothesis">
                          <div className="flex items-center">
                            <Brain className="mr-2 h-4 w-4" />
                            <span>Hypothesis</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="forum_post">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Forum Post</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose whether this is a research hypothesis or a general forum post.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your hypothesis or start your discussion..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide detailed information about your topic.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tags separated by commas" {...field} />
                    </FormControl>
                    <FormDescription>
                      Add relevant tags to help others find your topic (e.g., CFTR, Gene Therapy).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Create Topic</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}