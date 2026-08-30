import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // baseURL:
  //   process.env.NEXT_PUBLIC_APP_URL ||
  //   // "http://localhost:3000" ||
  //   "http://192.168.50.111:3000",
  // trustedOrigins: ["http://192.168.50.111:3000", "http://localhost:3000"],
  plugins: [anonymousClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
