
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';

type ChartType = 'bar' | 'pie' | 'line';

interface DataChartProps {
  type: ChartType;
  title: string;
  data: any[];
  dataKey?: string;
  nameKey?: string;
  categories?: Array<{
    key: string;
    name: string;
    color: string;
  }>;
  colors?: string[];
  height?: number | string;
  className?: string;
}

const COLORS = ['#0369a1', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#f97316', '#fb923c', '#fdba74', '#eab308', '#facc15'];

export function DataChart({
  type,
  title,
  data,
  dataKey = 'value',
  nameKey = 'name',
  categories,
  colors = COLORS,
  height = 300,
  className,
}: DataChartProps) {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={nameKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {categories ? (
                categories.map((category, index) => (
                  <Bar
                    key={category.key}
                    dataKey={category.key}
                    fill={category.color || colors[index % colors.length]}
                    name={category.name}
                  />
                ))
              ) : (
                <Bar dataKey={dataKey} fill={colors[0]} name={title} />
              )}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKey}
                nameKey={nameKey}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={nameKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {categories ? (
                categories.map((category, index) => (
                  <Line
                    key={category.key}
                    type="monotone"
                    dataKey={category.key}
                    stroke={category.color || colors[index % colors.length]}
                    name={category.name}
                  />
                ))
              ) : (
                <Line type="monotone" dataKey={dataKey} stroke={colors[0]} name={title} />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
}

export default DataChart;
