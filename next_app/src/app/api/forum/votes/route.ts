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
    const { type, topicId: contentId, commentId } = body

    // Create or update vote
    const vote = await prisma.upVote.upsert({
      where: {
        userId_contentId: contentId ? { userId: user.id, contentId } : undefined,
        userId_commentId: commentId ? { userId: user.id, commentId } : undefined,
      },
      update: {},  // removed type since UpVote doesn't have a type field
      create: {
        userId: user.id,
        ...(contentId && { contentId }),
        ...(commentId && { commentId }),
      },
    })

    return NextResponse.json(vote)
  } catch (error) {
    console.error('Error managing vote:', error)
    return NextResponse.json(
      { error: 'Failed to manage vote' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
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

    const { searchParams } = new URL(req.url)
    const contentId = searchParams.get('topicId')  // keeping parameter name for compatibility
    const commentId = searchParams.get('commentId')

    await prisma.upVote.delete({
      where: {
        userId_contentId: contentId ? { userId: user.id, contentId } : undefined,
        userId_commentId: commentId ? { userId: user.id, commentId } : undefined,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing vote:', error)
    return NextResponse.json(
      { error: 'Failed to remove vote' },
      { status: 500 }
    )
  }
}