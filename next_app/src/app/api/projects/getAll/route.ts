import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request, 
 ) {
  if (req.method !== 'GET') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const projects = await prisma.project.findMany({
      include: {
        author: true,
        collaborators: true,
        statements: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        contents: {
          where: {
            type: 'hypothesis'
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      },
    })
    return NextResponse.json(projects, { status: 200 })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}
