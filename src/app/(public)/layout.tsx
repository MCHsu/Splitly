import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bill Splitter - Split Expenses with Ease",
  description:
    "Track expenses, split bills fairly, and settle up with friends and family",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
