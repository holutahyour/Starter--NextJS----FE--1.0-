import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/sdcn-card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, iconColor = "text-gray-500" }: StatCardProps) {
  return (
    <Card className="rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
            <div>
              <div className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{value}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
            </div>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-full">
            <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={2} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
