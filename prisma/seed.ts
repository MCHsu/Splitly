import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const SEED_USER_ID = "seed_user_001";
const SEED_GROUP_ID = "seed_group_001";
const SEED_MEMBER_ALICE_ID = "seed_member_alice";
const SEED_MEMBER_BOB_ID = "seed_member_bob";

type ExpenseSeed = {
  description: string;
  amountInCents: number;
  date: Date;
  note?: string;
  category?: string;
  splitMethod: "SHARES" | "EXACT";
  paidByMemberId: string;
  shares: { memberId: string; amountInCents: number }[];
};

function equalShares(
  amountInCents: number,
  memberIds: string[],
): { memberId: string; amountInCents: number }[] {
  const perPerson = Math.floor(amountInCents / memberIds.length);
  const remainder = amountInCents - perPerson * memberIds.length;

  return memberIds.map((memberId, index) => ({
    memberId,
    amountInCents: perPerson + (index === 0 ? remainder : 0),
  }));
}

const expenses: ExpenseSeed[] = [
  {
    description: "Breakfast at Cafe",
    amountInCents: 450,
    date: new Date("2024-12-02T08:00:00.000Z"),
    note: "Morning coffee and pastries",
    category: "Food",
    splitMethod: "SHARES",
    paidByMemberId: SEED_MEMBER_ALICE_ID,
    shares: equalShares(450, [SEED_MEMBER_ALICE_ID, SEED_MEMBER_BOB_ID]),
  },
  {
    description: "Lunch at Sushi Bar",
    amountInCents: 1800,
    date: new Date("2024-12-02T13:00:00.000Z"),
    note: "All you can eat sushi",
    category: "Food",
    splitMethod: "SHARES",
    paidByMemberId: SEED_MEMBER_BOB_ID,
    shares: equalShares(1800, [SEED_MEMBER_ALICE_ID, SEED_MEMBER_BOB_ID]),
  },
  {
    description: "Gas Station",
    amountInCents: 2000,
    date: new Date("2024-12-01T16:00:00.000Z"),
    note: "Fill up the tank",
    category: "Transport",
    splitMethod: "SHARES",
    paidByMemberId: SEED_MEMBER_ALICE_ID,
    shares: equalShares(2000, [SEED_MEMBER_ALICE_ID, SEED_MEMBER_BOB_ID]),
  },
  {
    description: "Movie Tickets",
    amountInCents: 600,
    date: new Date("2024-12-03T19:00:00.000Z"),
    note: "Evening show",
    category: "Entertainment",
    splitMethod: "SHARES",
    paidByMemberId: SEED_MEMBER_BOB_ID,
    shares: equalShares(600, [SEED_MEMBER_ALICE_ID, SEED_MEMBER_BOB_ID]),
  },
  {
    description: "Grocery Shopping",
    amountInCents: 3500,
    date: new Date("2024-12-04T11:00:00.000Z"),
    note: "Weekly groceries",
    category: "Food",
    splitMethod: "EXACT",
    paidByMemberId: SEED_MEMBER_ALICE_ID,
    shares: [
      { memberId: SEED_MEMBER_ALICE_ID, amountInCents: 2000 },
      { memberId: SEED_MEMBER_BOB_ID, amountInCents: 1500 },
    ],
  },
  {
    description: "Taxi Ride",
    amountInCents: 350,
    date: new Date("2024-12-04T22:00:00.000Z"),
    note: "Back to hotel",
    category: "Transport",
    splitMethod: "SHARES",
    paidByMemberId: SEED_MEMBER_BOB_ID,
    shares: equalShares(350, [SEED_MEMBER_ALICE_ID, SEED_MEMBER_BOB_ID]),
  },
  {
    description: "Museum Entrance",
    amountInCents: 800,
    date: new Date("2024-12-05T10:00:00.000Z"),
    note: "Art museum tickets",
    category: "Entertainment",
    splitMethod: "SHARES",
    paidByMemberId: SEED_MEMBER_ALICE_ID,
    shares: equalShares(800, [SEED_MEMBER_ALICE_ID, SEED_MEMBER_BOB_ID]),
  },
  {
    description: "Dinner at Steakhouse",
    amountInCents: 2800,
    date: new Date("2024-12-05T20:00:00.000Z"),
    note: "Premium wagyu beef",
    category: "Food",
    splitMethod: "SHARES",
    paidByMemberId: SEED_MEMBER_BOB_ID,
    shares: equalShares(2800, [SEED_MEMBER_ALICE_ID, SEED_MEMBER_BOB_ID]),
  },
  {
    description: "Souvenir Shop",
    amountInCents: 1200,
    date: new Date("2024-12-06T15:00:00.000Z"),
    note: "Gifts for friends",
    category: "Shopping",
    splitMethod: "EXACT",
    paidByMemberId: SEED_MEMBER_ALICE_ID,
    shares: [
      { memberId: SEED_MEMBER_ALICE_ID, amountInCents: 700 },
      { memberId: SEED_MEMBER_BOB_ID, amountInCents: 500 },
    ],
  },
  {
    description: "Airport Transfer",
    amountInCents: 1500,
    date: new Date("2024-12-07T06:00:00.000Z"),
    note: "Ride to airport",
    category: "Transport",
    splitMethod: "SHARES",
    paidByMemberId: SEED_MEMBER_BOB_ID,
    shares: equalShares(1500, [SEED_MEMBER_ALICE_ID, SEED_MEMBER_BOB_ID]),
  },
];

async function main() {
  await prisma.user.create({
    data: {
      id: SEED_USER_ID,
      name: "User123456",
      email: "test@example.com",
      emailVerified: true,
    },
  });

  await prisma.group.create({
    data: {
      id: SEED_GROUP_ID,
      name: "Weekend Getaway",
      description: "Planning for the weekend trip",
      currency: "TWD",
      createdById: SEED_USER_ID,
      updatedById: SEED_USER_ID,
    },
  });

  await prisma.groupMember.createMany({
    data: [
      {
        id: SEED_MEMBER_ALICE_ID,
        name: "Alice",
        role: "OWNER",
        groupId: SEED_GROUP_ID,
        userId: SEED_USER_ID,
        createdById: SEED_USER_ID,
        updatedById: SEED_USER_ID,
      },
      {
        id: SEED_MEMBER_BOB_ID,
        name: "Bob",
        role: "MEMBER",
        groupId: SEED_GROUP_ID,
        createdById: SEED_USER_ID,
        updatedById: SEED_USER_ID,
      },
    ],
  });

  for (const expense of expenses) {
    await prisma.expense.create({
      data: {
        description: expense.description,
        amountInCents: expense.amountInCents,
        date: expense.date,
        note: expense.note,
        category: expense.category,
        splitMethod: expense.splitMethod,
        groupId: SEED_GROUP_ID,
        createdById: SEED_USER_ID,
        updatedById: SEED_USER_ID,
        payments: {
          create: {
            memberId: expense.paidByMemberId,
            amountInCents: expense.amountInCents,
          },
        },
        shares: {
          create: expense.shares.map((share) => ({
            memberId: share.memberId,
            amountInCents: share.amountInCents,
          })),
        },
      },
    });
  }

  await prisma.settlement.create({
    data: {
      amountInCents: 500,
      note: "Partial settlement for dinner",
      date: new Date("2024-12-06T12:00:00.000Z"),
      groupId: SEED_GROUP_ID,
      fromMemberId: SEED_MEMBER_BOB_ID,
      toMemberId: SEED_MEMBER_ALICE_ID,
      createdById: SEED_USER_ID,
      updatedById: SEED_USER_ID,
    },
  });
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
