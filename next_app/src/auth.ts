import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import prisma from "./lib/prisma"

export const {
  handlers,
  auth,
  signIn,
  signOut
} = NextAuth({
  providers: [Google({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!
  })],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false
      
      try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        })

        if (!existingUser) {
          // Create new user and profile if they don't exist
          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name ?? undefined,
              Profile: {
                create: {
                  bio: null // Default empty bio
                }
              }
            }
          })
        }
        
        return true
      } catch (error) {
        console.error("Error during sign in:", error)
        return false
      }
    },
    async session({ session, token }) {
      if (session?.user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email ?? "" }
        })
        
        if (dbUser) {
          session.user.id = dbUser.id
        }
      }
      return session
    },
  }
})
