import { notFound } from "next/navigation";

import { getGroupById } from "@/lib/queries/group.query";
import {
  BalanceChartCard,
  type BalanceChartDatum,
} from "@/components/balance/balance-chart-card";
import {
  SuggestedTransfersCard,
  type SuggestedTransfer,
} from "@/components/balance/suggested-transfers-card";
import { getGroupLedger } from "@/lib/queries/ledger.query";
import { getMemberDisplayName } from "@/lib/domain/member";
import { computeMinTransfers } from "@/lib/domain/settlement";

export default async function GroupBalancePage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const [group, ledger] = await Promise.all([
    getGroupById(groupId),
    getGroupLedger(groupId),
  ]);

  if (!group) {
    notFound();
  }

  const balances = new Map(
    [...ledger.entries()].map(([memberId, row]) => [
      memberId,
      row.balanceInCents,
    ]),
  );

  const nameById = new Map(
    group.members.map((member) => [member.id, getMemberDisplayName(member)]),
  );

  const chartData: BalanceChartDatum[] = group.members.map((member) => ({
    memberId: member.id,
    name: getMemberDisplayName(member),
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
