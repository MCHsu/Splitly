import type { GroupSeed } from "../types";
import { equalShares } from "../types";

const GROUP_ID = "seed_group_roommates";

const alex = "seed_member_roommates_alex";
const jordan = "seed_member_roommates_jordan";
const taylor = "seed_member_roommates_taylor";
const morgan = "seed_member_roommates_morgan";
const riley = "seed_member_roommates_riley";

const allMembers = [alex, jordan, taylor, morgan, riley];

export const roommatesGroup: GroupSeed = {
  id: GROUP_ID,
  name: "Roommates",
  description: "Shared apartment expenses",
  currency: "TWD",
  members: [
    { id: alex, name: "Alex", role: "OWNER", linkedUser: "alex" },
    { id: jordan, name: "Jordan", role: "MEMBER" },
    { id: taylor, name: "Taylor", role: "MEMBER" },
    { id: morgan, name: "Morgan", role: "MEMBER" },
    { id: riley, name: "Riley", role: "MEMBER" },
  ],
  expenses: [
    {
      description: "Rent — July",
      amountInCents: 4500000,
      date: new Date("2026-07-01T00:00:00.000Z"),
      note: "Monthly rent split",
      category: "stay",
      splitMethod: "EXACT",
      paidByMemberId: alex,
      shares: equalShares(4500000, allMembers),
    },
    {
      description: "Electricity Bill",
      amountInCents: 320000,
      date: new Date("2026-07-05T00:00:00.000Z"),
      category: "bills-utilities",
      splitMethod: "EXACT",
      paidByMemberId: jordan,
      shares: equalShares(320000, allMembers),
    },
    {
      description: "Internet — July",
      amountInCents: 89900,
      date: new Date("2026-07-03T00:00:00.000Z"),
      category: "bills-utilities",
      splitMethod: "EXACT",
      paidByMemberId: taylor,
      shares: equalShares(89900, allMembers),
    },
    {
      description: "Cleaning Supplies",
      amountInCents: 156000,
      date: new Date("2026-07-10T00:00:00.000Z"),
      note: "Detergent, trash bags, etc.",
      category: "groceries",
      splitMethod: "EXACT",
      paidByMemberId: morgan,
      shares: [
        { memberId: alex, amountInCents: 40000 },
        { memberId: jordan, amountInCents: 30000 },
        { memberId: taylor, amountInCents: 30000 },
        { memberId: morgan, amountInCents: 36000 },
        { memberId: riley, amountInCents: 20000 },
      ],
    },
    {
      description: "Water Bill",
      amountInCents: 78000,
      date: new Date("2026-07-15T00:00:00.000Z"),
      category: "bills-utilities",
      splitMethod: "EXACT",
      paidByMemberId: riley,
      shares: equalShares(78000, allMembers),
    },
  ],
};
