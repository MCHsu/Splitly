import "server-only";

import { betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { transferAnonymousMemberships } from "@/lib/link-anonymous-account";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async (data, request) => {
      const { user, url } = data;
    },
  },
  onPasswordReset: async ({ user }: { user: { email: string } }) => {
    console.log(`Password for user ${user.email} has been reset.`);
  },
  plugins: [
    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        await transferAnonymousMemberships(
          anonymousUser.user.id,
          newUser.user.id,
        );
      },
    }),
  ],
});
