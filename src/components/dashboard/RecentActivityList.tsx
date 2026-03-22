import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/sdcn-card";

interface Activity {
  id: string;
  title: string;
  department: string;
  status: "pending" | "approved" | "in_progress" | "rejected";
  createdAt: string;
  icon: React.ElementType;
}

interface RecentActivityListProps {
  activities: Activity[];
}

export function RecentActivityList({ activities }: RecentActivityListProps) {
  const getStatusColor = (status: Activity["status"]) => {
    switch (status) {
      case "pending": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "approved": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "in_progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Recent Activity
        </CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Latest updates across all departments
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 border rounded-md">
                  <activity.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {activity.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activity.department}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-2 py-1 text-[10px] font-medium rounded-full ${getStatusColor(activity.status)}`}>
                  {activity.status.replace("_", " ")}
                </span>
                <span className="text-[10px] text-gray-400">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
