import { auth } from "@/lib/auth";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { birthdayPlanningGroup } from "./seed/data/birthday-planning";
import { officeLunchGroup } from "./seed/data/office-lunch";
import { roommatesGroup } from "./seed/data/roommates";
import { weekendGetawayGroup } from "./seed/data/weekend-getaway";
import { seedGroup } from "./seed/seed-group";
import {
  SEED_USERS,
  type LinkedUser,
  type SeedUser,
  type SeedUserIds,
} from "./seed/users";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const GROUPS = [
  weekendGetawayGroup,
  roommatesGroup,
  officeLunchGroup,
  birthdayPlanningGroup,
];

async function getOrCreateSeedUser(user: SeedUser) {
  const existing = await prisma.user.findUnique({
    where: { email: user.email },
  });
  if (existing) {
    console.log(`User ${user.email} already exists — skipping signUp.`);
    return existing;
  }

  const { user: created } = await auth.api.signUpEmail({
    body: {
      name: user.name,
      email: user.email,
      password: user.password,
    },
  });

  return prisma.user.update({
    where: { id: created.id },
    data: { emailVerified: true },
  });
}

async function clearSeedData() {
  await prisma.settlement.deleteMany({
    where: { groupId: { startsWith: "seed_" } },
  });
  await prisma.expense.deleteMany({
    where: { groupId: { startsWith: "seed_" } },
  });
  await prisma.groupMember.deleteMany({
    where: { groupId: { startsWith: "seed_" } },
  });
  await prisma.group.deleteMany({ where: { id: { startsWith: "seed_" } } });
}

async function main() {
  await clearSeedData();

  const userIds = Object.fromEntries(
    await Promise.all(
      (Object.keys(SEED_USERS) as LinkedUser[]).map(async (key) => {
        const user = await getOrCreateSeedUser(SEED_USERS[key]);
        return [key, user.id] as const;
      }),
    ),
  ) as SeedUserIds;

  for (const group of GROUPS) {
    await seedGroup(prisma, group, userIds);
    console.log(`Seeded group: ${group.name}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
