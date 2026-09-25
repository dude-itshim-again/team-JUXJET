import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Shield,
  Inbox,
  CheckSquare,
  Sparkles,
  GitFork,
  Building,
  Activity,
  BarChart3,
  History,
  Settings,
  Bell
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface GovernmentSidebarProps {
  onItemClick?: () => void;
}

export const GovernmentSidebar: React.FC<GovernmentSidebarProps> = ({ onItemClick }) => {
  const { currentUser, challenges, notifications } = useApp();

  const pendingValidationCount = challenges.filter(c => c.status === 'Submitted' || c.status === 'Under Validation').length;
  const unreadCount = notifications.filter(n => !n.read && n.recipientRole === 'government').length;

  const links = [
    { to: '/government/dashboard', label: 'Executive Overview', icon: Shield },
    { to: '/government/validation', label: '3-Column Validation Queue', icon: CheckSquare, count: pendingValidationCount, highlight: true },
    { to: '/government/challenges', label: 'Challenge Inbox & Registry', icon: Inbox },
    { to: '/government/ai-analysis', label: 'AI Triage & Duplicates', icon: Sparkles, badge: 'AI' },
    { to: '/government/routing', label: 'University Matchmaking', icon: GitFork },
    { to: '/government/departments', label: 'Department Workload', icon: Building },
    { to: '/government/projects', label: 'Project Monitoring & Pilots', icon: Activity },
    { to: '/government/analytics', label: 'GIS & Impact Analytics', icon: BarChart3 },
    { to: '/government/audit-logs', label: 'Audit Trail & Transparency', icon: History },
    { to: '/government/settings', label: 'Department Configuration', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Government Officer Header */}
      <div className="p-4 border-b border-slate-100 bg-blue-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            GOV
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-slate-900 truncate">
              {currentUser?.name || 'Rajesh Kumar, IAS'}
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-900">
              Joint Secretary (Mission Dir.)
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 mt-2 truncate">
          Dept: {currentUser?.departmentName || 'Drinking Water & Sanitation'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Mission Administration
        </div>
        {links.map(link => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onItemClick}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-800 text-white shadow-sm'
                    : link.highlight && pendingValidationCount > 0
                    ? 'text-blue-900 bg-blue-50 hover:bg-blue-100 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-100 text-purple-800 font-bold">
                  {link.badge}
                </span>
              )}
              {link.count !== undefined && link.count > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-100 text-red-800 font-bold">
                  {link.count}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Governance Status */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs space-y-1">
          <div className="flex items-center justify-between text-slate-700">
            <span className="font-semibold">SLA Compliance:</span>
            <span className="text-emerald-700 font-bold">96.4%</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Avg validation turnaround: 4.2 days across 4 ministries.
          </p>
        </div>
      </div>
    </aside>
  );
};
