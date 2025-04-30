
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

type Trend = {
  value: number;
  isPositive: boolean;
};

interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  description?: string;
  trend?: Trend;
  className?: string;
  isLoading?: boolean;
}

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  className,
  isLoading = false
}: StatsCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {icon && (
            <div className="bg-primary/10 p-2 rounded-md">
              {icon}
            </div>
          )}
        </div>
        <div className="mt-2">
          {isLoading ? (
            <div className="h-8 w-24 bg-muted animate-pulse rounded-md"></div>
          ) : (
            <div className="text-2xl font-bold">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
          )}
          {(description || trend) && (
            <div className="mt-2 flex items-center text-xs">
              {trend && (
                <div 
                  className={cn(
                    "flex items-center mr-2",
                    trend.isPositive ? "text-green-500" : "text-red-500"
                  )}
                >
                  {trend.isPositive ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  <span>{trend.value}%</span>
                </div>
              )}
              {description && (
                <span className="text-muted-foreground">{description}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
