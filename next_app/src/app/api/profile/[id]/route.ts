import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const profile = await prisma.profile.findUnique({
    where: { userId: params.id },
    include: { User: { select: { name: true, email: true } } },
  })

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  return NextResponse.json(profile)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  
  if (!session || session.user.id !== params.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const {
    bio,
    location,
    website,
    github,
    twitter,
    linkedin,
    researchGate,
    specialties,
    organization,
    position,
  } = await request.json()

  // Validate URLs if provided
  const urlFields = { website, github, twitter, linkedin, researchGate }
  for (const [field, url] of Object.entries(urlFields)) {
    if (url && typeof url === 'string') {
      try {
        new URL(url)
      } catch (e) {
        return NextResponse.json(
          { error: `Invalid URL for ${field}` },
          { status: 400 }
        )
      }
    }
  }

  const updatedProfile = await prisma.profile.update({
    where: { userId: params.id },
    data: {
      bio,
      location,
      website,
      github,
      twitter,
      linkedin,
      researchGate,
      specialties,
      organization,
      position,
    },
  })

  return NextResponse.json(updatedProfile)
}
