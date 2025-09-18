import React from 'react';
import { Clock, Car, Ship, TrendingUp } from 'lucide-react';

const recentActivities = [
  {
    id: 1,
    type: 'vehicle',
    action: 'New listing',
    item: 'Ferrari 488 GTB',
    time: '2 hours ago',
    icon: Car,
    color: 'text-gold-400',
  },
  {
    id: 2,
    type: 'vessel',
    action: 'Status update',
    item: 'Ocean Dream',
    time: '4 hours ago',
    icon: Ship,
    color: 'text-gold-500',
  },
  {
    id: 3,
    type: 'vehicle',
    action: 'Commission earned',
    item: 'McLaren 720S',
    time: '1 day ago',
    icon: TrendingUp,
    color: 'text-gold-400',
  },
  {
    id: 4,
    type: 'vessel',
    action: 'New inventory',
    item: 'Sea Breeze',
    time: '2 days ago',
    icon: Ship,
    color: 'text-gold-500',
  },
];

export default function RecentActivity() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {recentActivities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 bg-dark-700 rounded-lg border border-dark-600">
              <div className={`p-2 rounded-full bg-dark-800 border border-gold-500 ${activity.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">
                  {activity.action}
                </p>
                <p className="text-sm text-gray-300 truncate">
                  {activity.item}
                </p>
                <div className="flex items-center mt-1">
                  <Clock className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
