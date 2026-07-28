"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatMoneyFromCents } from "@/lib/money";
import { cn } from "@/lib/utils";

export type BalanceChartDatum = {
  memberId: string;
  name: string;
  balanceInCents: number;
};

interface BalanceChartCardProps {
  data: BalanceChartDatum[];
  currency?: string;
  className?: string;
}

const chartConfig = {
  balanceInCents: {
    label: "Balance",
  },
  positive: {
    label: "Owed to you",
    color: "var(--chart-1)",
  },
  negative: {
    label: "You owe",
    color: "var(--destructive)",
  },
} satisfies ChartConfig;

export function BalanceChartCard({
  data,
  currency = "TWD",
  className,
}: BalanceChartCardProps) {
  const allSettled =
    data.length === 0 || data.every((d) => d.balanceInCents === 0);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Member balances
        </CardTitle>
      </CardHeader>
      <CardContent>
        {allSettled ? (
          <p className="text-sm text-muted-foreground">
            Everyone is settled up.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
            <BarChart
              accessibilityLayer
              data={data}
              margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={0}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={56}
                tickFormatter={(value: number) =>
                  formatMoneyFromCents(value, { currencyCode: currency })
                }
              />
              <ChartTooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  const item = payload[0];
                  const name =
                    typeof item.payload?.name === "string"
                      ? item.payload.name
                      : "Balance";
                  return (
                    <div className="grid min-w-[8rem] gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                      <div className="font-medium">{name}</div>
                      <div className="font-mono font-medium tabular-nums">
                        {formatMoneyFromCents(Number(item.value), {
                          currencyCode: currency,
                        })}
                      </div>
                    </div>
                  );
                }}
              />
              <Bar dataKey="balanceInCents" radius={4}>
                {data.map((entry) => (
                  <Cell
                    key={entry.memberId}
                    fill={
                      entry.balanceInCents < 0
                        ? "var(--color-negative)"
                        : "var(--color-positive)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
