import { GroupForm } from "@/components/group/group-form";
import { PageHeader } from "@/components/shared/page-header";
import { createGroup } from "@/app/actions/group.action";
import { getCurrencies } from "@/lib/currencies";

export default async function NewGroupPage() {
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
