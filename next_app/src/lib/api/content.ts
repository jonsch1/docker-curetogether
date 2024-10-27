// API utility functions for forum operations
import type { 
  ContentWithRelations, 
  CreateContentRequest, 
  CreateCommentRequest, 
  VoteRequest,
  TopicFilters 
} from '@/lib/types/content'

export async function fetchTopics(params: TopicFilters): Promise<ContentWithRelations[]> {
  const searchParams = new URLSearchParams()
  if (params.projectId) searchParams.set('projectId', params.projectId)
  if (params.search) searchParams.set('search', params.search)
  if (params.sort) searchParams.set('sort', params.sort)

  const response = await fetch(`/api/forum/topics?${searchParams.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch topics')
  return response.json()
}

export async function fetchTopic(id: string): Promise<ContentWithRelations> {
  const response = await fetch(`/api/forum/topics/${id}`)
  if (!response.ok) throw new Error('Failed to fetch topic')
  return response.json()
}

export async function createTopic(data: CreateContentRequest): Promise<ContentWithRelations> {
  const response = await fetch('/api/forum/topics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create topic')
  return response.json()
}

export async function createComment(data: CreateCommentRequest) {
  const response = await fetch('/api/forum/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create comment')
  return response.json()
}

export async function manageVote(data: VoteRequest) {
  const response = await fetch('/api/forum/votes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to manage vote')
  return response.json()
}

export async function removeVote(params: {
  topicId?: string
  commentId?: string
}) {
  const searchParams = new URLSearchParams()
  if (params.topicId) searchParams.set('topicId', params.topicId)
  if (params.commentId) searchParams.set('commentId', params.commentId)

  const response = await fetch(`/api/forum/votes?${searchParams.toString()}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to remove vote')
  return response.json()
}
