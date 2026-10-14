import { betterAuth } from "better-auth";
import { prismaAdapter as betterAuthPrismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/app/lib/prisma";

const baseURL = process.env.BETTER_AUTH_URL || process.env.RENDER_EXTERNAL_URL || "http://localhost:3000";

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET || "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    baseURL: baseURL,
    database: betterAuthPrismaAdapter(prisma, {
        provider: "postgresql",
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "guest"
            }
        }
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});
