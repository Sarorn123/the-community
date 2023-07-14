import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type NextAuthOptions } from "next-auth"
import { prisma } from '@/db/client';
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt"
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            return {
                ...token,
                ...user
            };
        },
        async session({ session, token }) {
            session.user = token
            return session;
        },
    },

    pages: {
        signIn: "/auth/signin"
    }

}