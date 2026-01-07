import { GroupForm } from "@/components/group-form/group-form";

export default function NewGroupPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Create New Group</h1>
        <p className="text-gray-600 mb-8">
          Create a group to start tracking expenses with friends and family.
        </p>
        <GroupForm />
      </div>
    </div>
  );
}
