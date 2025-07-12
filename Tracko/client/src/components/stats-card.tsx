import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtitle?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = "neutral",
  subtitle 
}: StatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-neutral-600";
    }
  };

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-600">{title}</p>
            <p className="text-3xl font-bold text-neutral-700">{value}</p>
          </div>
          <div className="w-12 h-12 bg-opacity-10 rounded-lg flex items-center justify-center">
            {icon}
          </div>
        </div>
        {(change || subtitle) && (
          <div className="mt-4 flex items-center">
            {change && (
              <span className={`text-sm ${getChangeColor()}`}>
                {change}
              </span>
            )}
            {subtitle && (
              <span className="text-sm text-neutral-600 ml-2">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
