"use client";

import { format } from "date-fns";
import Link from "next/link";
import {
  Utensils,
  Car,
  ShoppingCart,
  Plane,
  UserPlus,
  Circle,
} from "lucide-react";

interface ExpenseActivity {
  id: string;
  type: "expense" | "member-added";
  date: Date;
  description: string;
  paidBy?: string;
  amount?: number;
  status?: "lent" | "owed" | "not-involved";
  statusAmount?: number;
  icon?: string;
  addedMember?: string;
  addedBy?: string;
}

interface ExpenseListProps {
  activities: ExpenseActivity[];
  groupId?: string;
}

const iconMap: Record<string, any> = {
  dining: Utensils,
  transport: Car,
  shopping: ShoppingCart,
  flight: Plane,
};

export function ExpenseList({ activities, groupId }: ExpenseListProps) {
  const getIcon = (iconType?: string) => {
    if (!iconType) return Circle;
    const Icon = iconMap[iconType] || Circle;
    return Icon;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "lent":
        return "text-green-500";
      case "owed":
        return "text-red-500";
      case "not-involved":
        return "text-gray-500";
      default:
        return "text-gray-900";
    }
  };

  const getStatusText = (status?: string, amount?: number) => {
    if (!status || amount === undefined) return null;

    switch (status) {
      case "lent":
        return `You lent $${amount.toFixed(2)}`;
      case "owed":
        return `You owe $${amount.toFixed(2)}`;
      case "not-involved":
        return "not involved";
      default:
        return null;
    }
  };

  const groupedActivities = activities.reduce((acc, activity) => {
    const monthYear = format(activity.date, "MMMM yyyy").toUpperCase();
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(activity);
    return acc;
  }, {} as Record<string, ExpenseActivity[]>);

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Activity</h2>
        <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
          <span>Filter</span>
        </button>
      </div>

      <div className="divide-y">
        {Object.entries(groupedActivities).map(([monthYear, items]) => (
          <div key={monthYear}>
            <div className="px-4 py-2 bg-gray-50">
              <h3 className="text-xs font-semibold text-gray-500">
                {monthYear}
              </h3>
            </div>

            {items.map((activity) => {
              const Icon = getIcon(activity.icon);

              if (activity.type === "member-added") {
                return (
                  <div key={activity.id} className="px-4 py-4 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      <div className="text-sm text-gray-500 w-12 text-center">
                        <div>{format(activity.date, "MMM").slice(0, 3)}</div>
                        <div className="font-semibold">
                          {format(activity.date, "d")}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserPlus className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold">
                            {activity.addedMember}
                          </span>
                          {" was added to the group by "}
                          <span className="font-semibold">
                            {activity.addedBy}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={activity.id}
                  href={
                    groupId
                      ? `/groups/${groupId}/expenses/${activity.id}/edit`
                      : "#"
                  }
                  className="block px-4 py-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-sm text-gray-500 w-12 text-center">
                      <div>{format(activity.date, "MMM").slice(0, 3)}</div>
                      <div className="font-semibold">
                        {format(activity.date, "d")}
                      </div>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-orange-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">
                        {activity.description}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {activity.paidBy} paid ${activity.amount?.toFixed(2)}{" "}
                        total
                      </p>
                    </div>

                    <div
                      className={`text-sm font-semibold text-right ${getStatusColor(
                        activity.status
                      )}`}
                    >
                      {getStatusText(activity.status, activity.statusAmount)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className="p-4 text-center border-t">
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Load more activity
        </button>
      </div>
    </div>
  );
}
