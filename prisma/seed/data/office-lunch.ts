import type { GroupSeed } from "../types";
import { equalShares } from "../types";

const GROUP_ID = "seed_group_office";

const alex = "seed_member_office_alex";
const nina = "seed_member_office_nina";
const leo = "seed_member_office_leo";

const allMembers = [alex, nina, leo];

export const officeLunchGroup: GroupSeed = {
  id: GROUP_ID,
  name: "Office Lunch Club",
  description: "Team lunch expenses",
  currency: "TWD",
  members: [
    { id: alex, name: "Alex", role: "OWNER", linkedUser: "alex" },
    { id: nina, name: "Nina", role: "MEMBER" },
    { id: leo, name: "Leo", role: "MEMBER" },
  ],
  expenses: [
    {
      description: "Monday — Ramen",
      amountInCents: 96000,
      date: new Date("2026-07-07T12:00:00.000Z"),
      category: "food-drink",
      splitMethod: "EXACT",
      paidByMemberId: alex,
      shares: equalShares(96000, allMembers),
    },
    {
      description: "Tuesday — Bento Box",
      amountInCents: 75000,
      date: new Date("2026-07-08T12:00:00.000Z"),
      category: "food-drink",
      splitMethod: "EXACT",
      paidByMemberId: nina,
      shares: equalShares(75000, allMembers),
    },
    {
      description: "Wednesday — Hot Pot",
      amountInCents: 189000,
      date: new Date("2026-07-09T12:00:00.000Z"),
      note: "Team celebration lunch",
      category: "food-drink",
      splitMethod: "EXACT",
      paidByMemberId: leo,
      shares: equalShares(189000, allMembers),
    },
    {
      description: "Thursday — Sandwich Shop",
      amountInCents: 84000,
      date: new Date("2026-07-10T12:00:00.000Z"),
      category: "food-drink",
      splitMethod: "EXACT",
      paidByMemberId: alex,
      shares: equalShares(84000, allMembers),
    },
    {
      description: "Friday — Pizza",
      amountInCents: 135000,
      date: new Date("2026-07-11T12:00:00.000Z"),
      category: "food-drink",
      splitMethod: "EXACT",
      paidByMemberId: nina,
      shares: equalShares(135000, allMembers),
    },
    {
      description: "Delivery Fee",
      amountInCents: 6000,
      date: new Date("2026-07-11T12:30:00.000Z"),
      note: "Friday pizza delivery",
      category: "transport",
      splitMethod: "EXACT",
      paidByMemberId: leo,
      shares: equalShares(6000, allMembers),
    },
    {
      description: "Drinks — Bubble Tea Run",
      amountInCents: 45000,
      date: new Date("2026-07-11T15:00:00.000Z"),
      category: "food-drink",
      splitMethod: "EXACT",
      paidByMemberId: alex,
      shares: [
        { memberId: alex, amountInCents: 15000 },
        { memberId: nina, amountInCents: 15000 },
        { memberId: leo, amountInCents: 15000 },
      ],
    },
  ],
};
