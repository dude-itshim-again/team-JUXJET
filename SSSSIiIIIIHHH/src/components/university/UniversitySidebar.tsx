import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  GraduationCap,
  Compass,
  FolderKanban,
  Users,
  FileSpreadsheet,
  CheckCircle2,
  Lightbulb,
  Building2,
  Bell,
  Sliders
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface UniversitySidebarProps {
  onItemClick?: () => void;
}

export const UniversitySidebar: React.FC<UniversitySidebarProps> = ({ onItemClick }) => {
  const { currentUser, challenges, projects, notifications } = useApp();

  const assignedChallengesCount = challenges.filter(
    c => c.assignedUniversity?.institutionId === (currentUser?.institutionId || 'INST-001')
  ).length;

  const activeProjectsCount = projects.filter(
    p => p.universityId === (currentUser?.institutionId || 'INST-001')
  ).length;

  const unreadCount = notifications.filter(n => !n.read && n.recipientRole === 'university').length;

  const links = [
    { to: '/university/dashboard', label: 'Overview', icon: GraduationCap },
    { to: '/university/discover', label: 'Discover Challenges', icon: Compass, badge: 'Triage' },
    { to: '/university/assignments', label: 'Assigned & Invitations', icon: FolderKanban, count: assignedChallengesCount },
    { to: '/university/teams', label: 'Multidisciplinary Teams', icon: Users },
    { to: '/university/projects', label: 'Active Projects', icon: FolderKanban, count: activeProjectsCount },
    { to: '/university/proposals', label: 'Project Proposals', icon: FileSpreadsheet },
    { to: '/university/milestones', label: 'Milestones & Reviews', icon: CheckCircle2 },
    { to: '/university/research', label: 'Patents, Publications & IP', icon: Lightbulb },
    { to: '/university/notifications', label: 'Notifications', icon: Bell, count: unreadCount },
    { to: '/university/profile', label: 'Institution Profile & Labs', icon: Building2 }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* University Institution Header */}
      <div className="p-4 border-b border-slate-100 bg-teal-50/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            IIT
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-slate-900 truncate">
              {currentUser?.institutionName || 'BIT Mesra'}
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-800">
              NIRF Rank #2 | R&D Hub
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 mt-2 truncate">
          Lead: {currentUser?.name} ({currentUser?.designation?.split(',')[0] || 'Dean R&D'})
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Academic R&D Portal
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
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-teal-100 text-teal-900 font-semibold">
                  {link.badge}
                </span>
              )}
              {link.count !== undefined && link.count > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-semibold">
                  {link.count}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Innovation Support Box */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs space-y-1">
          <p className="font-semibold text-slate-800">Student Innovation Cell</p>
          <p className="text-[11px] text-slate-500">
            Multidisciplinary credits sanctioned under NEP 2020 Framework.
          </p>
        </div>
      </div>
    </aside>
  );
};
