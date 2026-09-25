import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  FolderHeart,
  Compass,
  Users,
  Bell,
  MessageSquareQuote,
  User,
  HelpCircle,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CitizenSidebarProps {
  onItemClick?: () => void;
}

export const CitizenSidebar: React.FC<CitizenSidebarProps> = ({ onItemClick }) => {
  const { currentUser, challenges, notifications } = useApp();

  const myChallengesCount = challenges.filter(c => c.submittedBy.id === currentUser?.id).length;
  const unreadCount = notifications.filter(n => !n.read && n.recipientRole === 'citizen').length;

  const links = [
    { to: '/citizen/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/citizen/submit', label: 'Submit a Challenge', icon: PlusCircle, badge: 'New', highlight: true },
    { to: '/citizen/challenges', label: 'My Challenges', icon: FolderHeart, count: myChallengesCount },
    { to: '/explore', label: 'Explore All Challenges', icon: Compass },
    { to: '/citizen/community', label: 'Community & Discussions', icon: Users },
    { to: '/citizen/notifications', label: 'Notifications', icon: Bell, count: unreadCount },
    { to: '/citizen/feedback', label: 'Grievances & Feedback', icon: MessageSquareQuote },
    { to: '/citizen/profile', label: 'My Profile & Impact', icon: User }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Citizen Header / Profile Snapshot */}
      <div className="p-4 border-b border-slate-100 bg-emerald-50/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {currentUser?.name.charAt(0) || 'C'}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-slate-800 truncate">{currentUser?.name || 'Citizen User'}</h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
              <Award className="w-3 h-3" />
              Verified Citizen
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 mt-2">
              📍 {currentUser?.location.cityVillage || 'Kanke'}, {currentUser?.location.district}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Citizen Portal
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
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : link.highlight
                    ? 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-saffron-400 text-slate-900 font-bold">
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

      {/* Citizen Help & Emergency Helpline */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Need Help Reporting?</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Toll-free Civic Helpline: <span className="font-semibold text-slate-700">1800-11-2026</span>
          </p>
        </div>
      </div>
    </aside>
  );
};
