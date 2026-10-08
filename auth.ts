import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Google,

    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = String(credentials.email)
          .trim()
          .toLowerCase()

        const password = String(credentials.password)

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        })

        if (!user) {
          return null
        }

        const passwordMatches = await bcrypt.compare(
          password,
          user.passwordHash
        )

        if (!passwordMatches) {
          return null
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
        }
      },
    }),
  
  ],

});

