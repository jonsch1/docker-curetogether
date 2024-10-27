import { auth } from "@/auth"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email ?? undefined },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const project = await prisma.project.create({
      data: {
        ...body,
        authorId: user.id,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json(
      { error: "Error creating project" },
      { status: 500 }
    )
  }
}
