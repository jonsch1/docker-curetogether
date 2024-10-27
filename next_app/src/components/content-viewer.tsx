"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Brain, FileText, MessageSquare, ThumbsUp, Video, Users, ExternalLink, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { toast } from 'sonner'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { ContentWithRelations } from '@/lib/types/content'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from '@/components/ui/spinner'
const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment is too long (max 1000 characters)"),
})

type CommentFormData = z.infer<typeof commentSchema>

// First, add the content form schema at the top of the file
const contentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  evidence: z.string().optional(),
  experiment: z.string().optional(),
  resourceUrl: z.string().url().optional().or(z.literal('')),
})

type ContentFormData = z.infer<typeof contentSchema>

export function ContentViewer({ contentId }: { contentId: string }) {
  const router = useRouter()
  const [content, setContent] = React.useState<ContentWithRelations | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [votes, setVotes] = React.useState<{
    content: boolean;
    comments: Record<string, boolean>;
  }>({
    content: false,
    comments: {},
  })
  const [editingComment, setEditingComment] = React.useState<string | null>(null)
  const [editingContent, setEditingContent] = React.useState(false)
  const [session, setSession] = React.useState<any>(null)
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null)

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  })

  // Inside ContentViewer component, add a new form instance for content editing
  const contentForm = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: content?.title || "",
      content: content?.content || "",
      evidence: content?.evidence || "",
      experiment: content?.experiment || "",
      resourceUrl: content?.resourceUrl || "",
    },
  })

  // Fetch content data
  React.useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/content/${contentId}`)
        const data = await response.json()
        setContent(data)
        
        // Initialize votes state based on hasVoted fields
        setVotes({
          content: data.hasVoted,
          comments: Object.fromEntries([
            ...data.comments.map((comment: any) => [comment.id, comment.hasVoted]),
            ...data.comments.flatMap((comment: any) => 
              (comment.replies || []).map((reply: any) => [reply.id, reply.hasVoted])
            )
          ])
        })
      } catch (error) {
        console.error('Error fetching content:', error)
        toast.error('Failed to load content')
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [contentId])

  // Add this effect to fetch session
  React.useEffect(() => {
    const loadSession = async () => {
      const response = await fetch('/api/auth/session')
      const data = await response.json()
      setSession(data)
    }
    loadSession()
  }, [])

  const onSubmit = async (values: CommentFormData) => {
    try {
      const response = await fetch('/api/content/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          comment: values.content,
        }),
      })

      if (!response.ok) throw new Error('Failed to post comment')
      
      // Refresh content data
      const updatedContent = await fetch(`/api/content/${contentId}`).then(res => res.json())
      setContent(updatedContent)
      
      form.reset()
      toast.success('Comment posted successfully')
    } catch (error) {
      toast.error('Failed to post comment')
      console.error('Error posting comment:', error)
    }
  }

  const handleVote = async (commentId?: string) => {
    try {
      const hasVote = commentId ? votes.comments[commentId] : votes.content

      if (hasVote) {
        await fetch(`/api/content/votes?${commentId ? 'commentId=' + commentId : 'contentId=' + contentId}`, {
          method: 'DELETE',
        })
      } else {
        await fetch('/api/content/votes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contentId: commentId ? undefined : contentId,
            commentId,
          }),
        })
      }

      // Update local state
      if (commentId) {
        setVotes(prev => ({
          ...prev,
          comments: { ...prev.comments, [commentId]: !hasVote }
        }))
      } else {
        setVotes(prev => ({ ...prev, content: !hasVote }))
      }

      // Refresh content data
      const updatedContent = await fetch(`/api/content/${contentId}`).then(res => res.json())
      setContent(updatedContent)
    } catch (error) {
      toast.error('Failed to register vote')
      console.error('Error voting:', error)
    }
  }

  const getContentIcon = () => {
    if (!content) return null
    switch (content.type) {
      case 'discussion':
        return <MessageSquare className="h-4 w-4" />
      case 'hypothesis':
        return <Brain className="h-4 w-4" />
      case 'educational':
        switch (content.subtype) {
          case 'video':
            return <Video className="h-4 w-4" />
          case 'webinar':
            return <Users className="h-4 w-4" />
          default:
            return <FileText className="h-4 w-4" />
        }
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleEditContent = async (values: ContentFormData) => {
    try {
      const response = await fetch(`/api/content/${contentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      
      if (!response.ok) throw new Error('Failed to update content')
      
      const updatedContent = await response.json()
      setContent(updatedContent)
      setEditingContent(false)
      toast.success('Content updated successfully')
      router.refresh() // Add this line to refresh the page data
    } catch (error) {
      toast.error('Failed to update content')
      console.error('Error updating content:', error)
    }
  }

  const handleEditComment = async (commentId: string, newContent: string) => {
    try {
      const response = await fetch(`/api/content/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent }),
      })
      
      if (!response.ok) throw new Error('Failed to update comment')
      
      // Refresh content data
      const updatedContent = await fetch(`/api/content/${contentId}`).then(res => res.json())
      setContent(updatedContent)
      setEditingComment(null)
      toast.success('Comment updated successfully')
    } catch (error) {
      toast.error('Failed to update comment')
      console.error('Error updating comment:', error)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return
    
    try {
      const response = await fetch(`/api/content/comments/${commentId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) throw new Error('Failed to delete comment')
      
      // Refresh content data
      const updatedContent = await fetch(`/api/content/${contentId}`).then(res => res.json())
      setContent(updatedContent)
      toast.success('Comment deleted successfully')
    } catch (error) {
      toast.error('Failed to delete comment')
      console.error('Error deleting comment:', error)
    }
  }

  // Add this effect to update form defaults when content changes
  React.useEffect(() => {
    if (content) {
      contentForm.reset({
        title: content.title,
        content: content.content,
        evidence: content.evidence || "",
        experiment: content.experiment || "",
        resourceUrl: content.resourceUrl || "",
      })
    }
  }, [content, contentForm])

  const handleReply = async (commentId: string, values: CommentFormData) => {
    try {
      const response = await fetch('/api/content/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          comment: values.content,
          parentId: commentId,
        }),
      })

      if (!response.ok) throw new Error('Failed to post reply')
      
      // Refresh content data
      const updatedContent = await fetch(`/api/content/${contentId}`).then(res => res.json())
      setContent(updatedContent)
      
      form.reset()
      setReplyingTo(null)
      toast.success('Reply posted successfully')
    } catch (error) {
      toast.error('Failed to post reply')
      console.error('Error posting reply:', error)
    }
  }

  if (isLoading) return (        <div className="absolute inset-0 flex items-center justify-center">
    <LoadingSpinner size={40} />
  </div>)
  if (!content) return <div>Content not found</div>

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{content.title}</CardTitle>
              <CardDescription>
                Posted by {content.author.name} on {new Date(content.createdAt).toLocaleDateString()}
                {content.project && (
                  <> in project <span className="font-medium">{content.project.projectName}</span></>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={`https://avatar.vercel.sh/${content.author.email || 'Guest'}`} alt={content.author.name || 'Guest'} />
              </Avatar>
              {session?.user?.email === content.author.email && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingContent(true)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>{content.content}</p>

            {/* Hypothesis-specific content */}
            {content.type === 'hypothesis' && content.evidence && (
              <div>
                <h3 className="font-semibold mb-2">Supporting Evidence</h3>
                <p>{content.evidence}</p>
              </div>
            )}
            {content.type === 'hypothesis' && content.experiment && (
              <div>
                <h3 className="font-semibold mb-2">Proposed Experiment</h3>
                <p>{content.experiment}</p>
              </div>
            )}

            {/* Educational-specific content */}
            {content.type === 'educational' && (
              <div className="space-y-2">
                {content.difficulty && (
                  <Badge variant="outline">
                    Difficulty: {content.difficulty}
                  </Badge>
                )}
                {content.resourceUrl && (
                  <Button variant="outline" asChild>
                    <a href={content.resourceUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Resource
                    </a>
                  </Button>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleVote()}
                className={votes.content ? 'bg-green-100' : ''}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                {content._count.upvotes}
              </Button>
              <Badge variant="outline">
                {getContentIcon()}
                <span className="ml-2">
                  {content.type === 'educational' ? content.subtype : content.type}
                </span>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Discussion</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className={`${content?.comments.length === 0 ? 'h-[200px]' : 'h-[400px]'} pr-4`}>
            {content?.comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-6 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No comments yet</p>
                <p className="text-sm text-muted-foreground">Be the first to share your thoughts!</p>
              </div>
            ) : (
              content?.comments.map((comment, index) => (
                <div key={comment.id} className="mb-4">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={`https://avatar.vercel.sh/${comment.author.email || 'Guest'}`} alt={comment.author.name || 'Guest'} />
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold">{comment.author.name}</p>
                          {session?.user?.email === comment.author.email && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setEditingComment(comment.id)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteComment(comment.id)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {editingComment === comment.id ? (
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit((values) => handleEditComment(comment.id, values.content))}>
                            <FormField
                              control={form.control}
                              name="content"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Textarea 
                                      {...field} 
                                      defaultValue={comment.comment}  // Remove this
                                      value={field.value || comment.comment}  // Add this
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="mt-2 space-x-2">
                              <Button type="submit" size="sm">Save</Button>
                              <Button type="button" variant="ghost" size="sm" onClick={() => setEditingComment(null)}>
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </Form>
                      ) : (
                        <p className="mt-2">{comment.comment}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleVote(comment.id)}
                          className={votes.comments[comment.id] ? 'bg-green-100' : ''}
                        >
                          <ThumbsUp className="mr-2 h-4 w-4" />
                          {comment.upvotes.length}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setReplyingTo(comment.id)}
                        >
                          Reply
                        </Button>
                      </div>
                      
                      {/* Reply form */}
                      {replyingTo === comment.id && (
                        <div className="ml-8 mt-4">
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit((values) => handleReply(comment.id, values))} className="space-y-4">
                              <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Textarea
                                        {...field}
                                        placeholder="Write your reply..."
                                        className="resize-none"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="space-x-2">
                                <Button type="submit" size="sm">Post Reply</Button>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => setReplyingTo(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </div>
                      )}

                      {/* Nested replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-8 mt-4 space-y-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start space-x-4">
                              <Avatar>
                                <AvatarImage 
                                  src={`https://avatar.vercel.sh/${reply.author.email || 'Guest'}`} 
                                  alt={reply.author.name || 'Guest'} 
                                />
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-semibold text-sm">{reply.author.name}</p>
                                  <div className="flex items-center space-x-2">
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(reply.createdAt).toLocaleDateString()}
                                    </p>
                                    {session?.user?.email === reply.author.email && (
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem onClick={() => setEditingComment(reply.id)}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => handleDeleteComment(reply.id)}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    )}
                                  </div>
                                </div>
                                {editingComment === reply.id ? (
                                  <Form {...form}>
                                    <form onSubmit={form.handleSubmit((values) => handleEditComment(reply.id, values.content))}>
                                      <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormControl>
                                              <Textarea 
                                                {...field} 
                                                value={field.value || reply.comment}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <div className="mt-2 space-x-2">
                                        <Button type="submit" size="sm">Save</Button>
                                        <Button 
                                          type="button" 
                                          variant="ghost" 
                                          size="sm" 
                                          onClick={() => setEditingComment(null)}
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </form>
                                  </Form>
                                ) : (
                                  <p className="mt-1 text-sm">{reply.comment}</p>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleVote(reply.id)}
                                  className={votes.comments[reply.id] ? 'bg-green-100' : ''}
                                >
                                  <ThumbsUp className="mr-2 h-4 w-4" />
                                  {reply.upvotes.length}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {index < content.comments.length - 1 && <Separator className="my-4" />}
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Comment form */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Add a Comment</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your comment</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your thoughts or insights..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Be respectful and constructive in your comments.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Post Comment</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Edit content dialog */}
      <Dialog open={editingContent} onOpenChange={setEditingContent}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
          </DialogHeader>
          <Form {...contentForm}>
            <form onSubmit={contentForm.handleSubmit(handleEditContent)} className="space-y-4">
              <FormField
                control={contentForm.control}
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
              <FormField
                control={contentForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[100px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {content.type === 'hypothesis' && (
                <>
                  <FormField
                    control={contentForm.control}
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
                    control={contentForm.control}
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

              {content.type === 'educational' && (
                <FormField
                  control={contentForm.control}
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
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setEditingContent(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
