import type { NextAuthOptions } from "next-auth"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import clientPromise from "./mongodb"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        isSignUp: { label: "Is Sign Up", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const client = await clientPromise
        const users = client.db().collection("users")

        if (credentials.isSignUp === "true") {
          // Sign up logic
          const existingUser = await users.findOne({ email: credentials.email })
          if (existingUser) throw new Error("User already exists")

          const hashedPassword = await bcrypt.hash(credentials.password, 12)

          const newUser = {
            email: credentials.email,
            name: credentials.name,
            password: hashedPassword,
            role: "candidate",
            createdAt: new Date(),
          }

          const result = await users.insertOne(newUser)

          return {
            id: result.insertedId.toString(),
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
          }
        } else {
          // Sign in logic
          const user = await users.findOne({ email: credentials.email })
          if (!user) return null

          const isValid = await bcrypt.compare(credentials.password, user.password)
          if (!isValid) return null

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || "candidate",
          }
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
}
