import { auth } from "@/lib/auth";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { birthdayPlanningGroup } from "./seed/data/birthday-planning";
import { officeLunchGroup } from "./seed/data/office-lunch";
import { roommatesGroup } from "./seed/data/roommates";
import { weekendGetawayGroup } from "./seed/data/weekend-getaway";
import { seedGroup } from "./seed/seed-group";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const SEED_USERS = [
  {
    name: "Alex",
    email: process.env.SEED_ALEX_EMAIL ?? "alex123@example.com",
    password: process.env.SEED_ALEX_PASSWORD ?? "User#Alex123",
  },
  {
    name: "Emily",
    email: process.env.SEED_EMILY_EMAIL ?? "emily456@example.com",
    password: process.env.SEED_EMILY_PASSWORD ?? "User#Emily456",
  },
] as const;

type SeedUser = (typeof SEED_USERS)[number];

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

  const alex = await getOrCreateSeedUser(SEED_USERS[0]);
  const emily = await getOrCreateSeedUser(SEED_USERS[1]);
  const userIds = { alex: alex.id, emily: emily.id };

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
