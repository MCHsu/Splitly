export const SEED_USERS = {
  alex: {
    name: "Alex",
    email: "alex123@example.com",
    password: "User#Alex123",
  },
  emily: {
    name: "Emily",
    email: "emily456@example.com",
    password: "User#Emily456",
  },
} as const;

export type LinkedUser = keyof typeof SEED_USERS;
export type SeedUser = (typeof SEED_USERS)[LinkedUser];
export type SeedUserIds = Record<LinkedUser, string>;
