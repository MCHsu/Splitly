import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatMoneyFromCents } from "@/lib/money";
import { cn } from "@/lib/utils";

interface GroupSpendCardProps {
  totalGroupSpend: number;
  yourShare: number;
  currency?: string;
  className?: string;
}

export function GroupSpendCard({
  totalGroupSpend,
  yourShare,
  currency = "TWD",
  className,
}: GroupSpendCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Total Group Spend
        </CardTitle>
        <div className="text-3xl font-bold">
          {formatMoneyFromCents(totalGroupSpend, { currencyCode: currency })}
        </div>
      </CardHeader>
      <CardContent>
        <Separator className="my-4" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Your share</span>
          <span className="font-medium">
            {formatMoneyFromCents(yourShare, { currencyCode: currency })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
