import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { Statement, Content, ProjectCollaborator } from '@prisma/client'

interface ProjectWithRelations {
  statements: (Statement & { author: { name: string } })[];
  contents: (Content & { author: { name: string } })[];  // Updated from hypotheses
  collaborators: (ProjectCollaborator & { user: { name: string } })[];
}

interface RecentActivity {
  id: string;
  user: string;
  action: string;
  time: string;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 30) {
    return `${Math.floor(diffInDays / 30)} months ago`;
  } else if (diffInDays > 0) {
    return `${diffInDays} days ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hours ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minutes ago`;
  } else {
    return 'just now';
  }
}

function generateRecentActivity(project: ProjectWithRelations): RecentActivity[] {
  const activities = [
    ...project.statements.map(statement => ({
      id: statement.id,
      user: statement.author.name || 'Unknown User',
      action: "curated a statement",
      time: statement.createdAt,
    })),
    ...project.contents
      .filter(content => content.type === 'hypothesis')  // Only include hypotheses
      .map(hypothesis => ({
        id: hypothesis.id,
        user: hypothesis.author.name || 'Unknown User',
        action: "submitted a hypothesis",
        time: hypothesis.createdAt,
      })),
    ...project.collaborators.map(collab => ({
      id: collab.id,
      user: collab.user.name || 'Unknown User',
      action: "joined the project",
      time: collab.joinedAt,
    }))
  ];

  // Sort by date, most recent first
  activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  // Take the 20 most recent activities and format their times
  return activities.slice(0, 20).map(activity => ({
    ...activity,
    time: formatTimeAgo(new Date(activity.time))
  }));
}

function generateWeeklyStats(project: ProjectWithRelations) {
  const hypotheses = project.contents.filter(content => content.type === 'hypothesis');
  
  const dates = [
    ...project.statements.map(s => new Date(s.createdAt)),
    ...hypotheses.map(h => new Date(h.createdAt)),
    ...project.collaborators.map(c => new Date(c.joinedAt))
  ].filter(date => date)

  if (dates.length === 0) return {
    weekly: [],
    cumulative: [],
    changes: {
      statements: 0,
      hypotheses: 0,
      collaborators: 0
    }
  }

  const earliestDate = new Date(Math.min(...dates.map(d => d.getTime())))
  const today = new Date()
  
  const weekCount = Math.ceil((today.getTime() - earliestDate.getTime()) / (7 * 24 * 60 * 60 * 1000))

  // Generate weekly counts (non-cumulative)
  const weeklyStats = Array.from({ length: weekCount }, (_, i) => {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - (7 * i))
    weekStart.setHours(0, 0, 0, 0)
    
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    return {
      name: `Week ${weekCount - i}`,
      statements: project.statements.filter(s => 
        new Date(s.createdAt) >= weekStart && new Date(s.createdAt) < weekEnd
      ).length,
      hypotheses: project.contents.filter(content => content.type === 'hypothesis').filter(h => 
        new Date(h.createdAt) >= weekStart && new Date(h.createdAt) < weekEnd
      ).length,
      collaborators: project.collaborators.filter(c => 
        new Date(c.joinedAt) >= weekStart && new Date(c.joinedAt) < weekEnd
      ).length
    }
  }).reverse()

  // Calculate cumulative totals for the chart
  let totalStatements = 0
  let totalHypotheses = 0
  let totalCollaborators = 0

  const cumulativeStats = weeklyStats.map(week => ({
    ...week,
    statements: (totalStatements += week.statements),
    hypotheses: (totalHypotheses += week.hypotheses),
    collaborators: (totalCollaborators += week.collaborators)
  }))

  // Calculate last week's changes
  const lastWeek = weeklyStats[weeklyStats.length - 1] || { statements: 0, hypotheses: 0, collaborators: 0 }
  const previousWeek = weeklyStats[weeklyStats.length - 2] || { statements: 0, hypotheses: 0, collaborators: 0 }

  const changes = {
    statements: lastWeek.statements,
    hypotheses: lastWeek.hypotheses,
    collaborators: lastWeek.collaborators
  }

  return {
    weekly: weeklyStats,
    cumulative: cumulativeStats,
    changes
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: params.id,
      },
      include: {
        statements: {
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        contents: {  // Updated from hypotheses
          where: {
            type: 'hypothesis',  // Only fetch hypothesis-type content
          },
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        collaborators: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    if (!project) {
      return new NextResponse("Project not found", { status: 404 })
    }

    const stats = generateWeeklyStats(project as ProjectWithRelations)

    const transformedProject = {
      ...project,
      statementsCurated: project.statements.length,
      hypothesesSubmitted: project.contents.filter(c => c.type === 'hypothesis').length,
      collaboratorCount: project.collaborators.length,
      molecularStatements: project.statements.slice(0, 10).map((statement) => ({
        id: statement.id,
        text: statement.text,
        confidence: statement.confidence,
      })),
      recentActivity: generateRecentActivity(project as ProjectWithRelations),
      weeklyStats: stats.cumulative,
      weeklyChanges: stats.changes
    }

    return NextResponse.json(transformedProject)
  } catch (error) {
    console.error("[PROJECT_GET] Error details:", {
      message: (error as Error).message,
      stack: (error as Error).stack,
    })
    return new NextResponse("Internal Error", { status: 500 })
  }
}
