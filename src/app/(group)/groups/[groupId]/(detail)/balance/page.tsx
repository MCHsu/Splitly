import { notFound } from "next/navigation";

import { getGroupSummary, getGroupMembers } from "@/lib/queries/group.query";
import {
  BalanceChartCard,
  type BalanceChartDatum,
} from "@/components/balance/balance-chart-card";
import {
  SuggestedTransfersCard,
  type SuggestedTransfer,
} from "@/components/balance/suggested-transfers-card";
import { getGroupLedger } from "@/lib/queries/ledger.query";
import { computeMinTransfers } from "@/lib/domain/settlement";

export default async function GroupBalancePage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const [group, members, ledger] = await Promise.all([
    getGroupSummary(groupId),
    getGroupMembers(groupId),
    getGroupLedger(groupId),
  ]);

  if (!group || !members) {
    notFound();
  }

  const balances = new Map(
    [...ledger.entries()].map(([memberId, row]) => [
      memberId,
      row.balanceInCents,
    ]),
  );

  const nameById = new Map(members.map((member) => [member.id, member.name]));

  const chartData: BalanceChartDatum[] = members.map((member) => ({
    memberId: member.id,
    name: member.name,
    balanceInCents: balances.get(member.id) ?? 0,
  }));

  const transfers: SuggestedTransfer[] = computeMinTransfers(balances).map(
    (transfer) => ({
      ...transfer,
      fromName: nameById.get(transfer.fromMemberId) ?? "Unknown",
      toName: nameById.get(transfer.toMemberId) ?? "Unknown",
    }),
  );

  return (
    <div className="flex flex-col gap-6 lg:gap-10">
      <BalanceChartCard data={chartData} currency={group.currency} />
      <SuggestedTransfersCard transfers={transfers} currency={group.currency} />
    </div>
  );
}
