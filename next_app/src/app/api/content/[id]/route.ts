import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    // Increment view count
    await prisma.content.update({
      where: { id: params.id },
      data: { views: { increment: 1 } }
    })

    const content = await prisma.content.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        project: true,
        tags: true,
        comments: {
          where: {
            parentId: null // Only fetch top-level comments
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  }
                },
                _count: {
                  select: {
                    upvotes: true
                  }
                },
                upvotes: true
              }
            },
            _count: {
              select: {
                upvotes: true
              }
            },
            upvotes: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            upvotes: true,
            comments: true
          }
        },
        upvotes: true // Add this
      }
    })

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    // Transform the response to include hasVoted fields
    const transformedContent = {
      ...content,
      hasVoted: userId ? content.upvotes.some(vote => vote.userId === userId) : false,
      comments: content.comments.map(comment => ({
        ...comment,
        hasVoted: userId ? comment.upvotes.some(vote => vote.userId === userId) : false,
        replies: comment.replies.map(reply => ({
          ...reply,
          hasVoted: userId ? reply.upvotes.some(vote => vote.userId === userId) : false,
        }))
      }))
    }

    return NextResponse.json(transformedContent)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email ?? undefined },
    })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const content = await prisma.content.findUnique({
      where: { id: params.id },
      select: { authorId: true }
    })

    if (!content || content.authorId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updatedContent = await prisma.content.update({
      where: { id: params.id },
      data: body,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        project: {
          select: {
            id: true,
            projectName: true,
          }
        },
        tags: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            },
            upvotes: true,
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  }
                },
                upvotes: true,
              }
            }
          }
        },
        _count: {
          select: {
            comments: true,
            upvotes: true,
          }
        }
      }
    })

    return NextResponse.json(updatedContent)
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    )
  }
}
