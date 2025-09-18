import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesChartProps {
  stats?: {
    totalVehiclesInInventory: number;
    totalVesselsInInventory: number;
    monthlySales: number;
    quarterlySales: number;
    yearlySales: number;
  };
  vehicles?: Array<{
    id: string;
    make: string;
    model: string;
    createdAt: string;
  }>;
  vessels?: Array<{
    id: string;
    name: string;
    createdAt: string;
  }>;
}

export default function SalesChart({ stats, vehicles, vessels }: SalesChartProps) {
  // Generate inventory addition data based on actual creation dates
  const currentDate = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Get the last 6 months
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    last6Months.push({
      month: monthNames[date.getMonth()],
      monthIndex: date.getMonth(),
      year: date.getFullYear(),
      date: date
    });
  }
  
  // Count vehicles and vessels added in each month
  const salesData = last6Months.map(({ month, monthIndex, year }) => {
    let vehicleCount = 0;
    let vesselCount = 0;
    
    // Count vehicles added in this month
    if (vehicles) {
      vehicleCount = vehicles.filter(vehicle => {
        const createdDate = new Date(vehicle.createdAt);
        return createdDate.getMonth() === monthIndex && createdDate.getFullYear() === year;
      }).length;
    }
    
    // Count vessels added in this month
    if (vessels) {
      vesselCount = vessels.filter(vessel => {
        const createdDate = new Date(vessel.createdAt);
        return createdDate.getMonth() === monthIndex && createdDate.getFullYear() === year;
      }).length;
    }
    
    return {
      month,
      vehicles: vehicleCount,
      vessels: vesselCount
    };
  });
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="month" 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => Math.round(value).toString()}
            domain={[0, 'dataMax']}
            ticks={[0, 1, 2, 3, 4, 5]}
            allowDecimals={false}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #f59e0b',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
              color: 'white',
            }}
            formatter={(value: any, name: string) => [Math.round(value), name]}
          />
          <Line 
            type="monotone" 
            dataKey="vehicles" 
            stroke="#f59e0b" 
            strokeWidth={2}
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
            name="Vehicles Added"
            connectNulls={false}
          />
          <Line 
            type="monotone" 
            dataKey="vessels" 
            stroke="#fbbf24" 
            strokeWidth={2}
            dot={{ fill: '#fbbf24', strokeWidth: 2, r: 4 }}
            name="Vessels Added"
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
