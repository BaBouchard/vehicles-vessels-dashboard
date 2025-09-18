import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface InventoryChartProps {
  stats?: {
    totalVehiclesInInventory: number;
    totalVehiclesListed: number;
    totalVesselsInInventory: number;
    totalVesselsListed: number;
  };
}

export default function InventoryChart({ stats }: InventoryChartProps) {
  const inventoryData = [
    { name: 'Vehicles Listed', value: stats?.totalVehiclesListed || 4, color: '#f59e0b' },
    { name: 'Vehicles in Inventory', value: (stats?.totalVehiclesInInventory || 4) - (stats?.totalVehiclesListed || 4), color: '#fbbf24' },
    { name: 'Vessels Listed', value: stats?.totalVesselsListed || 0, color: '#fcd34d' },
    { name: 'Vessels in Inventory', value: (stats?.totalVesselsInInventory || 2) - (stats?.totalVesselsListed || 0), color: '#fde68a' },
  ];
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={inventoryData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {inventoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #f59e0b',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
              color: 'white',
            }}
            formatter={(value: any) => [Math.round(value), 'Count']}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
