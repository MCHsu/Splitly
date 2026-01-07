"use client";

import { useParams, useRouter } from "next/navigation";
import { MemberForm } from "@/components/member-form/member-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewMemberPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4"
          // onClick={() => router.push(`/groups/${groupId}`)}
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Group
        </Button>

        <h1 className="text-3xl font-bold mb-2">Add Member</h1>
        <p className="text-gray-600 mb-8">Add a new member to this group.</p>
        <MemberForm />
      </div>
    </div>
  );
}
