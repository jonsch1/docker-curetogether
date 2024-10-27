import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'recent'
    const type = searchParams.get('type')
    const subtype = searchParams.get('subtype')

    const contents = await prisma.content.findMany({
      where: {
        ...(projectId ? { projectId } : {}),
        ...(type ? { type } : {}),
        ...(subtype ? { subtype } : {}),
        OR: search ? [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
          { tags: { some: { name: { contains: search, mode: 'insensitive' } } } }
        ] : undefined,
      },
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
        _count: {
          select: {
            comments: true,
            upvotes: true,
          }
        }
      },
      orderBy: sort === 'recent' 
        ? { createdAt: 'desc' }
        : sort === 'popular'
        ? { upvotes: { _count: 'desc' } }
        : sort === 'views'
        ? { views: 'desc' }
        : { comments: { _count: 'desc' } }
    })

    return NextResponse.json(contents)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

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
    const { 
      title, 
      content, 
      type, 
      subtype, 
      difficulty,
      evidence,
      experiment,
      resourceUrl,
      projectId, 
      tags 
    } = body

    const newContent = await prisma.content.create({
      data: {
        title,
        content,
        type,
        subtype,
        difficulty,
        evidence,
        experiment,
        resourceUrl,
        projectId,
        authorId: user.id,
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag }
          }))
        }
      },
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
      }
    })

    return NextResponse.json(newContent)
  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    )
  }
}
