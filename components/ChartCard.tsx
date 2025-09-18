import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ChartCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export default function ChartCard({ title, icon: Icon, children, className = '' }: ChartCardProps) {
  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="p-2 bg-dark-700 rounded-lg border border-gold-500">
          <Icon className="h-5 w-5 text-gold-400" />
        </div>
      </div>
      {children}
    </div>
  );
}
