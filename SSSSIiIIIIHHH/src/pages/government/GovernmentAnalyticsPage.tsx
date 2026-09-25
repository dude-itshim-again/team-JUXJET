import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const GovernmentAnalyticsPage: React.FC = () => {
  const { challenges, projects } = useApp();

  // Category counts
  const categoryCounts: Record<string, number> = {};
  challenges.forEach(c => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });
  const categoryData = Object.keys(categoryCounts).map(cat => ({
    name: cat.split(' ')[0],
    fullName: cat,
    count: categoryCounts[cat]
  }));

  // Status counts
  const statusCounts: Record<string, number> = {};
  challenges.forEach(c => {
    statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
  });
  const statusData = Object.keys(statusCounts).map(st => ({
    name: st,
    value: statusCounts[st]
  }));

  const COLORS = ['#173B65', '#176B68', '#E7A23B', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
          Government GIS & Impact Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time oversight telemetry across national challenges, departmental turnaround times, and verified pilot deployments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Bar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Submissions by Societal Sector
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any, _name: any, item: any) => [val, item.payload.fullName]}
                  contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#173B65" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Lifecycle Status Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
