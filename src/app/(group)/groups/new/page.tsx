import { redirect } from "next/navigation";

import { GroupForm } from "@/components/group/group-form";
import { PageHeader } from "@/components/shared/page-header";
import { createGroup } from "@/app/actions/group.action";
import { getCurrencies } from "@/lib/queries/currencies.query";
import { getAuthSession } from "@/lib/queries/auth.query";

export default async function NewGroupPage() {
  const session = await getAuthSession();

  if (!session?.user || session.user.isAnonymous) {
    redirect("/groups");
  }

  const currencies = await getCurrencies();

  return (
    <>
      <PageHeader
        title="New Group"
        subtitle="Create a group to start tracking expenses with friends and family."
      />
      <GroupForm mode="add" currencies={currencies} onSubmit={createGroup} />
    </>
  );
}
