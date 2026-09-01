import type { GroupSeed } from "../types";
import { equalShares } from "../types";

const GROUP_ID = "seed_group_birthday";

const emily = "seed_member_birthday_emily";
const alex = "seed_member_birthday_alex";
const sam = "seed_member_birthday_sam";

const allMembers = [emily, alex, sam];

export const birthdayPlanningGroup: GroupSeed = {
  id: GROUP_ID,
  name: "Birthday Planning",
  description: "Surprise birthday party for Sam",
  currency: "TWD",
  members: [
    { id: emily, name: "Emily", role: "OWNER", linkedUser: "emily" },
    { id: alex, name: "Alex", role: "MEMBER", linkedUser: "alex" },
    { id: sam, name: "Sam", role: "MEMBER" },
  ],
  expenses: [
    {
      description: "Birthday Cake",
      amountInCents: 180000,
      date: new Date("2026-08-10T10:00:00.000Z"),
      note: "Custom chocolate cake",
      category: "food-drink",
      splitMethod: "EXACT",
      paidByMemberId: emily,
      shares: equalShares(180000, [emily, alex]),
    },
    {
      description: "Party Decorations",
      amountInCents: 95000,
      date: new Date("2026-08-10T14:00:00.000Z"),
      category: "shopping",
      splitMethod: "EXACT",
      paidByMemberId: alex,
      shares: equalShares(95000, [emily, alex]),
    },
    {
      description: "Venue Deposit",
      amountInCents: 500000,
      date: new Date("2026-08-05T00:00:00.000Z"),
      note: "Private room at restaurant",
      category: "stay",
      splitMethod: "EXACT",
      paidByMemberId: emily,
      shares: equalShares(500000, [emily, alex]),
    },
    {
      description: "Gift — Headphones",
      amountInCents: 350000,
      date: new Date("2026-08-12T00:00:00.000Z"),
      category: "shopping",
      splitMethod: "EXACT",
      paidByMemberId: alex,
      shares: [
        { memberId: emily, amountInCents: 200000 },
        { memberId: alex, amountInCents: 150000 },
      ],
    },
    {
      description: "Drinks & Snacks",
      amountInCents: 120000,
      date: new Date("2026-08-15T18:00:00.000Z"),
      category: "groceries",
      splitMethod: "EXACT",
      paidByMemberId: emily,
      shares: equalShares(120000, allMembers),
    },
    {
      description: "Photo Printing",
      amountInCents: 45000,
      date: new Date("2026-08-16T00:00:00.000Z"),
      note: "Memory board photos",
      category: "fun",
      splitMethod: "EXACT",
      paidByMemberId: alex,
      shares: equalShares(45000, [emily, alex]),
    },
  ],
};
