import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create a demo user first
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
    },
  })

  // Create collaborators
  const collaborators = await Promise.all([
    prisma.user.upsert({
      where: { email: 'jane.smith@example.com' },
      update: {},
      create: {
        email: 'jane.smith@example.com',
        name: 'Dr. Jane Smith',
      },
    }),
    prisma.user.upsert({
      where: { email: 'john.doe@example.com' },
      update: {},
      create: {
        email: 'john.doe@example.com',
        name: 'John Doe',
      },
    }),
    prisma.user.upsert({
      where: { email: 'alice.johnson@example.com' },
      update: {},
      create: {
        email: 'alice.johnson@example.com',
        name: 'Dr. Alice Johnson',
      },
    }),
  ])

  // Create the project
  const project = await prisma.project.upsert({
    where: { id: 'demo-project' },
    update: {},
    create: {
      id: 'demo-project',
      projectName: 'Cystic Fibrosis Research',
      diseaseName: 'Cystic Fibrosis',
      diseaseCategory: 'Genetic Disorders',
      description: 'Investigating novel therapeutic approaches for Cystic Fibrosis',
      researchGoals: 'Identify new therapeutic targets and develop innovative treatment strategies for CF patients',
      progress: 65,
      authorId: demoUser.id,
    },
  })

  // Add collaborators to the project with different join dates
  await Promise.all(
    collaborators.map((collaborator, index) =>
      prisma.projectCollaborator.upsert({
        where: {
          projectId_userId: {
            projectId: project.id,
            userId: collaborator.id,
          },
        },
        update: {},
        create: {
          projectId: project.id,
          userId: collaborator.id,
          joinedAt: new Date(Date.now() - (90 - index * 20) * 24 * 60 * 60 * 1000), // Spread over 90 days
        },
      })
    )
  )

  // Create a larger set of statements with realistic content
  const statements = [
    // Week 1-2 (Initial research phase)
    ...Array(15).fill(null).map(() => ({
      text: 'Initial literature review findings on CFTR mutations',
      confidence: 0.85 + Math.random() * 0.1,
      timeOffset: 90 - Math.random() * 14, // 90-76 days ago
    })),
    // Week 3-4 (Increased understanding)
    ...Array(25).fill(null).map(() => ({
      text: 'Molecular pathway analysis of chloride transport',
      confidence: 0.87 + Math.random() * 0.1,
      timeOffset: 75 - Math.random() * 14, // 75-61 days ago
    })),
    // Week 5-6 (Deep dive into mechanisms)
    ...Array(40).fill(null).map(() => ({
      text: 'Investigation of ENaC regulation mechanisms',
      confidence: 0.89 + Math.random() * 0.1,
      timeOffset: 60 - Math.random() * 14, // 60-46 days ago
    })),
    // Week 7-8 (Therapeutic implications)
    ...Array(50).fill(null).map(() => ({
      text: 'Analysis of current therapeutic approaches',
      confidence: 0.91 + Math.random() * 0.08,
      timeOffset: 45 - Math.random() * 14, // 45-31 days ago
    })),
    // Week 9-10 (Recent findings)
    ...Array(60).fill(null).map(() => ({
      text: 'New insights into inflammation pathways',
      confidence: 0.93 + Math.random() * 0.07,
      timeOffset: 30 - Math.random() * 14, // 30-16 days ago
    })),
    // Week 11-12 (Latest discoveries)
    ...Array(70).fill(null).map(() => ({
      text: 'Recent therapeutic development findings',
      confidence: 0.94 + Math.random() * 0.06,
      timeOffset: 15 - Math.random() * 14, // 15-1 days ago
    })),
  ]

  // Add statements with distributed timestamps
  await Promise.all(
    statements.map((statement) =>
      prisma.statement.create({
        data: {
          text: statement.text,
          confidence: statement.confidence,
          projectId: project.id,
          authorId: collaborators[Math.floor(Math.random() * collaborators.length)].id,
          createdAt: new Date(Date.now() - statement.timeOffset * 24 * 60 * 60 * 1000),
        },
      })
    )
  )

  // Create hypotheses spread over time
  const hypotheses = [
    {
      title: 'Novel CFTR Modulator Combination',
      content: 'Combining existing CFTR modulators with anti-inflammatory agents may improve outcomes.',
      timeOffset: 85,
    },
    {
      title: 'ENaC Inhibition Strategy',
      content: 'Selective ENaC inhibition could reduce mucus dehydration in CF airways.',
      timeOffset: 70,
    },
    {
      title: 'Microbiome Modification Approach',
      content: 'Targeting the lung microbiome might reduce inflammation and improve lung function.',
      timeOffset: 55,
    },
    {
      title: 'Alternative Ion Channel Regulation',
      content: 'Modulation of alternative chloride channels might compensate for CFTR dysfunction.',
      timeOffset: 40,
    },
    {
      title: 'Anti-Inflammatory Pathway',
      content: 'Novel anti-inflammatory approaches targeting specific CF-related pathways.',
      timeOffset: 25,
    },
    {
      title: 'Mucus Modification Strategy',
      content: 'Direct modification of mucus properties to improve clearance.',
      timeOffset: 10,
    },
  ]

  // Add hypotheses over time
  await Promise.all(
    hypotheses.map((hypothesis) =>
      prisma.content.create({
        data: {
          title: hypothesis.title,
          content: hypothesis.content,
          type: 'hypothesis',
          projectId: project.id,
          authorId: collaborators[Math.floor(Math.random() * collaborators.length)].id,
          createdAt: new Date(Date.now() - hypothesis.timeOffset * 24 * 60 * 60 * 1000),
        },
      })
    )
  )

  // Add content tags (previously topic tags)
  const tags = await Promise.all([
    'CFTR',
    'Clinical Trials',
    'Treatment',
    'Research',
    'Patient Experience',
    'Hypothesis',
    'Discussion',
    'Genetic Modifiers',
    'Inflammation',
    'Microbiome',
    'Educational'  // Added missing tag
  ].map(tagName => 
    prisma.contentTag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName }
    })
  ))

  const contents = [
    {
      title: "CFTR Modulator Combination Therapy Discussion",
      content: "Recent studies have shown promising results when combining different CFTR modulators. I'd like to discuss the potential implications for patients with rare mutations. What are your thoughts on the safety profile of these combinations?",
      type: "discussion",
      projectId: project.id,
      authorId: collaborators[0].id,
      tags: ["CFTR", "Treatment", "Discussion"],
      timeOffset: 15,
    },
    {
      title: "Hypothesis: Microbiome-Inflammation Connection",
      content: "Based on recent findings, I hypothesize that the gut microbiome plays a crucial role in modulating inflammation in CF patients. This could explain the varying degrees of inflammatory response we see in patients with identical CFTR mutations.",
      type: "hypothesis",
      evidence: "Recent studies showing correlation between gut microbiome composition and inflammatory markers",
      experiment: "Proposed longitudinal study of microbiome changes and inflammatory responses",
      projectId: project.id,
      authorId: collaborators[1].id,
      tags: ["Hypothesis", "Inflammation", "Microbiome"],
      timeOffset: 10,
    },
    {
      title: "Understanding CFTR Mutations",
      content: "A comprehensive guide to understanding different classes of CFTR mutations and their implications for treatment.",
      type: "educational",
      subtype: "article",
      difficulty: "intermediate",
      resourceUrl: "https://example.com/cftr-mutations-guide",
      projectId: project.id,
      authorId: collaborators[2].id,
      tags: ["CFTR", "Research", "Educational"],  // Changed from "Educational" to match the tags array
      timeOffset: 5,
    }
  ]

  for (const contentData of contents) {
    const content = await prisma.content.create({
      data: {
        title: contentData.title,
        content: contentData.content,
        type: contentData.type,
        subtype: contentData.subtype,
        difficulty: contentData.difficulty,
        evidence: contentData.evidence,
        experiment: contentData.experiment,
        resourceUrl: contentData.resourceUrl,
        projectId: contentData.projectId,
        authorId: contentData.authorId,
        createdAt: new Date(Date.now() - contentData.timeOffset * 24 * 60 * 60 * 1000),
        tags: {
          connect: contentData.tags.map(tagName => ({ name: tagName }))
        }
      }
    })

    // Add some sample comments
    await Promise.all([
      prisma.comment.create({
        data: {
          comment: "This is a fascinating perspective. Have you considered the role of environmental factors in this context?",
          authorId: collaborators[(0 + 1) % 3].id,
          contentId: content.id,
          createdAt: new Date(Date.now() - (contentData.timeOffset - 1) * 24 * 60 * 60 * 1000),
        }
      }),
      prisma.comment.create({
        data: {
          comment: "I've seen similar patterns in my research. We should consider setting up a collaborative study to investigate this further.",
          authorId: collaborators[(0 + 2) % 3].id,
          contentId: content.id,
          createdAt: new Date(Date.now() - (contentData.timeOffset - 2) * 24 * 60 * 60 * 1000),
        }
      })
    ])

    // Add some upvotes
    await Promise.all(
      collaborators.map(user =>
        prisma.upVote.create({
          data: {
            userId: user.id,
            contentId: content.id,
            createdAt: new Date(Date.now() - (contentData.timeOffset - Math.random() * 5) * 24 * 60 * 60 * 1000),
          }
        })
      )
    )
  }

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
