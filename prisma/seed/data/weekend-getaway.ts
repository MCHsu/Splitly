import type { GroupSeed } from "../types";
import { equalShares } from "../types";

const GROUP_ID = "seed_group_weekend";

const alex = "seed_member_weekend_alex";
const emily = "seed_member_weekend_emily";
const chris = "seed_member_weekend_chris";
const dana = "seed_member_weekend_dana";

const allMembers = [alex, emily, chris, dana];

export const weekendGetawayGroup: GroupSeed = {
  id: GROUP_ID,
  name: "Weekend Getaway",
  description: "Planning for the weekend trip to Yilan",
  currency: "TWD",
  members: [
    { id: alex, name: "Alex", role: "OWNER", linkedUser: "alex" },
    { id: emily, name: "Emily", role: "MEMBER", linkedUser: "emily" },
    { id: chris, name: "Chris", role: "MEMBER" },
    { id: dana, name: "Dana", role: "MEMBER" },
  ],
  expenses: [
    {
      description: "Breakfast at Cafe",
      amountInCents: 128000,
      date: new Date("2026-07-02T08:00:00.000Z"),
      note: "Morning coffee and pastries",
      category: "food-drink",
      splitMethod: "EXACT",
      paidByMemberId: alex,
      shares: equalShares(128000, allMembers),
    },
    {
      description: "Gas Station",
      amountInCents: 200000,
      date: new Date("2026-07-01T16:00:00.000Z"),
      note: "Fill up the tank",
      category: "transport",
      splitMethod: "EXACT",
      paidByMemberId: alex,
      shares: equalShares(200000, allMembers),
    },
    {
      description: "Hot Spring Tickets",
      amountInCents: 320000,
      date: new Date("2026-07-03T14:00:00.000Z"),
      note: "Jiaoxi hot spring entry",
      category: "fun",
      splitMethod: "EXACT",
      paidByMemberId: emily,
      shares: equalShares(320000, allMembers),
    },
    {
      description: "Grocery Shopping",
      amountInCents: 185000,
      date: new Date("2026-07-04T11:00:00.000Z"),
      note: "Snacks and drinks for the trip",
      category: "groceries",
      splitMethod: "EXACT",
      paidByMemberId: chris,
      shares: [
        { memberId: alex, amountInCents: 50000 },
        { memberId: emily, amountInCents: 45000 },
        { memberId: chris, amountInCents: 50000 },
        { memberId: dana, amountInCents: 40000 },
      ],
    },
    {
      description: "Dinner at Steakhouse",
      amountInCents: 480000,
      date: new Date("2026-07-05T20:00:00.000Z"),
      note: "Premium wagyu beef",
      category: "food-drink",
      splitMethod: "EXACT",
      paidByMemberId: dana,
      shares: equalShares(480000, allMembers),
    },
    {
      description: "Airport Transfer",
      amountInCents: 150000,
      date: new Date("2026-07-07T06:00:00.000Z"),
      note: "Ride back to Taipei",
      category: "transport",
      splitMethod: "EXACT",
      paidByMemberId: emily,
      shares: equalShares(150000, allMembers),
    },
  ],
};
