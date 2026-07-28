import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export default function Page() {
  return (
    <Breadcrumbs
      items={[
        { label: "Groups", href: "/groups" },
        { label: "New Group" },
      ]}
    />
  );
}
