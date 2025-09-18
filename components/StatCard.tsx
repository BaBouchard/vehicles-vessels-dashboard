import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  description?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  description,
  color = 'blue' 
}: StatCardProps) {
  const colorClasses = {
    blue: 'bg-dark-700 text-yellow-400 border-yellow-500',
    green: 'bg-dark-700 text-yellow-300 border-yellow-400',
    purple: 'bg-dark-700 text-yellow-500 border-yellow-600',
    orange: 'bg-dark-700 text-yellow-400 border-yellow-500',
    red: 'bg-dark-700 text-yellow-300 border-yellow-400',
  };

  const changeColorClasses = {
    increase: 'text-yellow-400',
    decrease: 'text-red-400',
  };

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {description && (
            <p className="text-xs text-gray-400 mt-1">{description}</p>
          )}
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${changeColorClasses[change.type]}`}>
                {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
              </span>
              <span className="text-xs text-gray-400 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
