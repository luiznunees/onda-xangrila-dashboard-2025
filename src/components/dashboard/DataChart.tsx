
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface DataChartProps {
  type: "bar" | "line" | "pie";
  title: string;
  data: Array<{ name: string; value?: number; [key: string]: any }>;
  dataKey?: string;
  nameKey?: string;
  colors?: string[];
  className?: string;
  isLoading?: boolean;
}

const DataChart = ({ 
  type, 
  title, 
  data = [], 
  dataKey = "value", 
  nameKey = "name",
  colors,
  className,
  isLoading = false
}: DataChartProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="w-full h-48 bg-muted animate-pulse rounded-md"></div>
          </div>
        ) : (
          <>
            {type === "bar" && (
              <BarChart 
                data={data} 
                index={nameKey}
                categories={[dataKey]}
                colors={colors || ["ocean"]}
                valueFormatter={(value) => value.toString()}
                className="h-[300px] mt-4"
              />
            )}
            {type === "line" && (
              <LineChart 
                data={data}
                index={nameKey}
                categories={[dataKey]}
                colors={colors || ["ocean"]}
                valueFormatter={(value) => value.toString()}
                className="h-[300px] mt-4"
              />
            )}
            {type === "pie" && (
              <PieChart 
                data={data}
                index={nameKey}
                categories={[dataKey]}
                colors={colors || ["ocean", "sky", "blue", "indigo"]}
                valueFormatter={(value) => value.toString()}
                className="h-[300px] mt-4"
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DataChart;
