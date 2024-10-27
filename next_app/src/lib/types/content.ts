import type { Content, Comment, User, ContentTag, UpVote, Project } from '@prisma/client'

// API Response Types
export type ContentWithRelations = Content & {
  author: Pick<User, 'id' | 'name' | 'email'>
  tags: ContentTag[]
  comments: (Comment & {
    author: Pick<User, 'id' | 'name' | 'email'>
    upvotes: UpVote[]
    replies: (Comment & {
      author: Pick<User, 'id' | 'name' | 'email'>
      upvotes: UpVote[]
    })[]
  })[]
  project: Pick<Project, 'id' | 'projectName'>
  _count: {
    comments: number
    upvotes: number
  }
}

// API Request Types
export type CreateContentRequest = {
  title: string
  content: string
  type: 'discussion' | 'hypothesis' | 'educational'
  subtype?: 'article' | 'video' | 'webinar'
  difficulty?: string
  evidence?: string
  experiment?: string
  resourceUrl?: string
  projectId?: string
  tags: string[]
}

export type CreateCommentRequest = {
  content: string
  topicId: string
  parentId?: string
}

export type VoteRequest = {
  type: 'upvote' | 'downvote'
  topicId?: string
  commentId?: string
}

export type TopicFilters = {
  projectId?: string
  search?: string
  sort?: 'recent' | 'popular' | 'replies'
}
