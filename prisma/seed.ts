import { PrismaClient, Prisma } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const user: Prisma.UserCreateInput = {
  name: "User123456",
  email: "test@example.com",
};
const group: Prisma.GroupCreateInput = {
  name: "Weekend Getaway",
  description: "Planning for the weekend trip",
};

const expenses = [
  {
    description: "Breakfast at Cafe",
    amount: 450,
    date: new Date("2024-12-02T08:00:00.000Z"),
    note: "Morning coffee and pastries",
    group: { connect: { id: 5 } },
    splitMethod: "EQUAL" as const,
    paidBy: { create: [{ memberId: 4, amount: 450 }] },
    allocations: {
      create: [
        { memberId: 4, value: 225 },
        { memberId: 5, value: 225 },
      ],
    },
  },
  {
    description: "Lunch at Sushi Bar",
    amount: 1800,
    date: new Date("2024-12-02T13:00:00.000Z"),
    note: "All you can eat sushi",
    group: { connect: { id: 5 } },
    splitMethod: "PERCENTAGE" as const,
    paidBy: { create: [{ memberId: 5, amount: 1800 }] },
    allocations: {
      create: [
        { memberId: 4, value: 900 },
        { memberId: 5, value: 900 },
      ],
    },
  },
  {
    description: "Gas Station",
    amount: 2000,
    date: new Date("2024-12-01T16:00:00.000Z"),
    note: "Fill up the tank",
    group: { connect: { id: 5 } },
    splitMethod: "SHARES" as const,
    paidBy: { create: [{ memberId: 4, amount: 2000 }] },
    allocations: {
      create: [
        { memberId: 4, value: 1000 },
        { memberId: 5, value: 1000 },
      ],
    },
  },
  {
    description: "Movie Tickets",
    amount: 600,
    date: new Date("2024-12-03T19:00:00.000Z"),
    note: "Evening show",
    group: { connect: { id: 5 } },
    splitMethod: "EQUAL" as const,
    paidBy: { create: [{ memberId: 5, amount: 600 }] },
    allocations: {
      create: [
        { memberId: 4, value: 300 },
        { memberId: 5, value: 300 },
      ],
    },
  },
  {
    description: "Grocery Shopping",
    amount: 3500,
    date: new Date("2024-12-04T11:00:00.000Z"),
    note: "Weekly groceries",
    group: { connect: { id: 5 } },
    splitMethod: "EXACT" as const,
    paidBy: { create: [{ memberId: 4, amount: 3500 }] },
    allocations: {
      create: [
        { memberId: 4, value: 2000 },
        { memberId: 5, value: 1500 },
      ],
    },
  },
  {
    description: "Taxi Ride",
    amount: 350,
    date: new Date("2024-12-04T22:00:00.000Z"),
    note: "Back to hotel",
    group: { connect: { id: 5 } },
    splitMethod: "EQUAL" as const,
    paidBy: { create: [{ memberId: 5, amount: 350 }] },
    allocations: {
      create: [
        { memberId: 4, value: 175 },
        { memberId: 5, value: 175 },
      ],
    },
  },
  {
    description: "Museum Entrance",
    amount: 800,
    date: new Date("2024-12-05T10:00:00.000Z"),
    note: "Art museum tickets",
    group: { connect: { id: 5 } },
    splitMethod: "EQUAL" as const,
    paidBy: { create: [{ memberId: 4, amount: 800 }] },
    allocations: {
      create: [
        { memberId: 4, value: 400 },
        { memberId: 5, value: 400 },
      ],
    },
  },
  {
    description: "Dinner at Steakhouse",
    amount: 2800,
    date: new Date("2024-12-05T20:00:00.000Z"),
    note: "Premium wagyu beef",
    group: { connect: { id: 5 } },
    splitMethod: "PERCENTAGE" as const,
    paidBy: { create: [{ memberId: 5, amount: 2800 }] },
    allocations: {
      create: [
        { memberId: 4, value: 1400 },
        { memberId: 5, value: 1400 },
      ],
    },
  },
  {
    description: "Souvenir Shop",
    amount: 1200,
    date: new Date("2024-12-06T15:00:00.000Z"),
    note: "Gifts for friends",
    group: { connect: { id: 5 } },
    splitMethod: "EXACT" as const,
    paidBy: { create: [{ memberId: 4, amount: 1200 }] },
    allocations: {
      create: [
        { memberId: 4, value: 700 },
        { memberId: 5, value: 500 },
      ],
    },
  },
  {
    description: "Airport Transfer",
    amount: 1500,
    date: new Date("2024-12-07T06:00:00.000Z"),
    note: "Ride to airport",
    group: { connect: { id: 5 } },
    splitMethod: "EQUAL" as const,
    paidBy: { create: [{ memberId: 5, amount: 1500 }] },
    allocations: {
      create: [
        { memberId: 4, value: 750 },
        { memberId: 5, value: 750 },
      ],
    },
  },
];

async function main() {
  await prisma.group.upsert({
    where: { id: 1 },
    update: group,
    create: { ...group, id: 1 },
  });

  await prisma.user.upsert({
    where: { id: 123456 },
    update: user,
    create: {
      ...user,
      id: 123456,
    },
  });

  for (const expenseData of expenses) {
    await prisma.expense.create({ data: expenseData });
  }
}

main();
