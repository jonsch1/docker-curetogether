import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(req: Request) {
  try {
    const session = await auth()
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email ?? undefined },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { content, topicId, parentId } = body

    const comment = await prisma.comment.create({
      data: {
        content,
        topicId,
        authorId: user.id,
        ...(parentId && { parentId }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
      }
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
