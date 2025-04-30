
import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart"

type ChartProps = {
  data: Array<{ [key: string]: any }>;
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
};

export function BarChart({
  data,
  index,
  categories,
  colors = ["#2563eb"],
  valueFormatter = (value: number) => value.toString(),
  className,
}: ChartProps) {
  return (
    <ChartContainer
      className={className}
      config={{
        ...Object.fromEntries(
          categories.map((category, i) => [
            category,
            {
              color: colors[i % colors.length],
            },
          ])
        ),
      }}
    >
      <RechartsPrimitive.BarChart data={data}>
        <RechartsPrimitive.XAxis
          dataKey={index}
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <RechartsPrimitive.YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={valueFormatter}
        />
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" vertical={false} />
        <RechartsPrimitive.Tooltip
          content={({ active, payload }) => (
            <ChartTooltipContent
              active={active}
              payload={payload}
              formatter={valueFormatter}
            />
          )}
        />
        {categories.map((category, i) => (
          <RechartsPrimitive.Bar
            key={category}
            dataKey={category}
            fill={colors[i % colors.length]}
            radius={[4, 4, 0, 0]}
            className="fill-primary"
          />
        ))}
      </RechartsPrimitive.BarChart>
    </ChartContainer>
  );
}

export function LineChart({
  data,
  index,
  categories,
  colors = ["#2563eb"],
  valueFormatter = (value: number) => value.toString(),
  className,
}: ChartProps) {
  return (
    <ChartContainer
      className={className}
      config={{
        ...Object.fromEntries(
          categories.map((category, i) => [
            category,
            {
              color: colors[i % colors.length],
            },
          ])
        ),
      }}
    >
      <RechartsPrimitive.LineChart data={data}>
        <RechartsPrimitive.XAxis
          dataKey={index}
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <RechartsPrimitive.YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={valueFormatter}
        />
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" vertical={false} />
        <RechartsPrimitive.Tooltip
          content={({ active, payload }) => (
            <ChartTooltipContent
              active={active}
              payload={payload}
              formatter={valueFormatter}
            />
          )}
        />
        {categories.map((category, i) => (
          <RechartsPrimitive.Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[i % colors.length]}
            strokeWidth={2}
            dot={{ strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        ))}
      </RechartsPrimitive.LineChart>
    </ChartContainer>
  );
}

export function PieChart({
  data,
  index,
  categories,
  colors = ["#2563eb", "#10b981", "#ef4444", "#f59e0b"],
  valueFormatter = (value: number) => value.toString(),
  className,
}: ChartProps) {
  return (
    <ChartContainer
      className={className}
      config={{
        ...Object.fromEntries(
          categories.map((category, i) => [
            category,
            {
              color: colors[i % colors.length],
            },
          ])
        ),
      }}
    >
      <RechartsPrimitive.PieChart>
        <RechartsPrimitive.Pie
          data={data}
          dataKey={categories[0]}
          nameKey={index}
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <RechartsPrimitive.Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]} 
            />
          ))}
        </RechartsPrimitive.Pie>
        <RechartsPrimitive.Tooltip
          content={({ active, payload }) => (
            <ChartTooltipContent
              active={active}
              payload={payload}
              formatter={valueFormatter}
            />
          )}
        />
      </RechartsPrimitive.PieChart>
    </ChartContainer>
  );
}
