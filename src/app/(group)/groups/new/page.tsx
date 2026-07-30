import { GroupForm } from "@/components/group/group-form";
import { PageHeader } from "@/components/shared/page-header";

export default function NewGroupPage() {
  return (
    <>
      <PageHeader
        title="Create New Group"
        subtitle="Create a group to start tracking expenses with friends and family."
      />
      <GroupForm />
    </>
  );
}
