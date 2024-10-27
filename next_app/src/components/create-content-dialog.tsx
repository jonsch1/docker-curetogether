"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"

// Base schema for all content types
const baseSchema = {
  title: z.string().min(1, "Title is required").max(255),
  content: z.string().min(1, "Content is required"),
  tags: z.string().optional(),
}

// Type-specific schema additions
const discussionSchema = z.object({
  ...baseSchema,
})

const hypothesisSchema = z.object({
  ...baseSchema,
  evidence: z.string().min(1, "Supporting evidence is required"),
  experiment: z.string().min(1, "Proposed experiment is required"),
})

const educationalSchema = z.object({
  ...baseSchema,
  subtype: z.enum(["article", "video", "webinar"]),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  resourceUrl: z.string().url("Please enter a valid URL").optional(),
})

interface CreateContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: 'discussion' | 'hypothesis' | 'educational'
  projectId?: string
  onSuccess?: () => void
}

export function CreateContentDialog({ open, onOpenChange, type, projectId, onSuccess }: CreateContentDialogProps) {
  // Select schema based on content type
  const router = useRouter()

  const schema = type === 'educational' ? educationalSchema : 
                type === 'hypothesis' ? hypothesisSchema : 
                discussionSchema

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
      ...(type === 'hypothesis' && {
        evidence: "",
        experiment: "",
      }),
      ...(type === 'educational' && {
        subtype: "article",
        difficulty: "beginner",
        resourceUrl: "",
      }),
    },
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      const tags = values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
      
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          tags,
          type,
          projectId,
        }),
      })

      if (!response.ok) throw new Error('Failed to create content')

      toast.success('Content created successfully')
      router.refresh()
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error creating content:', error)
      toast.error('Failed to create content')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> 
          Create {type === 'educational' ? 'Material' : type === 'hypothesis' ? 'Hypothesis' : 'Discussion'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create New {type === 'educational' ? 'Educational Material' : 
                                  type === 'hypothesis' ? 'Hypothesis' : 
                                  'Discussion'}</DialogTitle>
          <DialogDescription>
            {type === 'educational' ? 'Share your knowledge with the community.' :
             type === 'hypothesis' ? 'Propose a new hypothesis for research.' :
             'Start a new discussion topic.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type === 'educational' && (
              <>
                <FormField
                  control={form.control}
                  name="subtype"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="webinar">Webinar</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="resourceUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resource URL</FormLabel>
                      <FormControl>
                        <Input {...field} type="url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[150px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type === 'hypothesis' && (
              <>
                <FormField
                  control={form.control}
                  name="evidence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supporting Evidence</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experiment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proposed Experiment</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Separate tags with commas" />
                  </FormControl>
                  <FormDescription>
                    Add relevant tags to help others find your content
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
