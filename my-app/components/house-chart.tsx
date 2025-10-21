'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface LocationData {
  location: string;
  average_price: number;
  count: number;
}

interface HouseChartProps {
  data: LocationData[];
}

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00',
  '#0088fe', '#00c49f', '#ffbb28', '#ff8042', '#8884d8'
];

export function HouseChart({ data }: HouseChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Bar Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Average House Prices by Location
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="location" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                fontSize={12}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Average Price']}
                labelFormatter={(label) => `Location: ${label}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="average_price" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Distribution of Average Prices
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ location, average_price }) => `${location}: $${(average_price / 1000).toFixed(0)}k`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="average_price"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Average Price']}
                labelFormatter={(label) => `Location: ${label}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100">Highest Price</h4>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ${data[0]?.average_price.toLocaleString() || 0}
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {data[0]?.location || 'N/A'}
          </p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 dark:text-green-100">Total Properties</h4>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {data.reduce((sum, item) => sum + item.count, 0)}
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">
            Across all locations
          </p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-900 dark:text-purple-100">Average Price</h4>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            ${Math.round(data.reduce((sum, item) => sum + item.average_price, 0) / data.length).toLocaleString()}
          </p>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            Across top locations
          </p>
        </div>
      </div>
    </div>
  );
}
