import { notFound } from "next/navigation";

import { getGroupById } from "@/lib/queries/group.query";
import {
  BalanceChartCard,
  type BalanceChartDatum,
} from "@/components/group/balance-chart-card";
import {
  SuggestedTransfersCard,
  type SuggestedTransfer,
} from "@/components/group/suggested-transfers-card";
import { SectionContainer } from "@/components/shared/section-container";
import { getGroupLedger } from "@/lib/ledger";
import { getMemberDisplayName } from "@/lib/member";
import { computeMinTransfers } from "@/lib/settlement";

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
    <SectionContainer>
      <div className="flex flex-col gap-4 md:gap-6">
        <BalanceChartCard data={chartData} currency={group.currency} />
        <SuggestedTransfersCard
          transfers={transfers}
          currency={group.currency}
        />
      </div>
    </SectionContainer>
  );
}
