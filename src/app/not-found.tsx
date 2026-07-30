import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/page-container";

export default function NotFound() {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or you don&apos;t
          have access.
        </p>
        <Button asChild>
          <Link href="/groups">Back to groups</Link>
        </Button>
      </div>
    </PageContainer>
  );
}
