import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { UserCheck, RefreshCw, ChevronUp, ChevronDown, Shield, GraduationCap, Building2, User, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, currentRole, loginAs, resetDemoData } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (role: Role | 'public') => {
    loginAs(role);
    if (role === 'citizen') navigate('/citizen/dashboard');
    else if (role === 'university') navigate('/university/dashboard');
    else if (role === 'government') navigate('/government/dashboard');
    else if (role === 'industry') navigate('/partners/dashboard');
    else navigate('/');
  };

  const roles: { role: Role | 'public'; label: string; icon: any; color: string; persona: string }[] = [
    {
      role: 'citizen',
      label: 'Citizen',
      icon: User,
      color: 'bg-emerald-600 hover:bg-emerald-700',
      persona: 'Ramesh Verma (Ranchi Resident)'
    },
    {
      role: 'government',
      label: 'Government',
      icon: Shield,
      color: 'bg-blue-700 hover:bg-blue-800',
      persona: 'Rajesh Kumar, IAS (Jal Jeevan Mission)'
    },
    {
      role: 'university',
      label: 'University R&D',
      icon: GraduationCap,
      color: 'bg-teal-700 hover:bg-teal-800',
      persona: 'Prof. Sunita Rao (BIT Mesra)'
    },
    {
      role: 'industry',
      label: 'Industry / CSR',
      icon: Building2,
      color: 'bg-amber-600 hover:bg-amber-700',
      persona: 'Ananya Sen (Tata Trusts CSR)'
    },
    {
      role: 'public',
      label: 'Public Visitor',
      icon: Eye,
      color: 'bg-slate-600 hover:bg-slate-700',
      persona: 'Anonymous Visitor (Logged Out)'
    }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-navy-700 px-4 py-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-saffron-400" />
              <span className="font-semibold text-sm">Evaluator Role Switcher</span>
            </div>
            <span className="text-[10px] bg-navy-900/60 text-navy-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
              JanSetu Demo
            </span>
          </div>

          <div className="p-3 space-y-2">
            <p className="text-xs text-slate-500 font-medium px-1">
              Switch instant persona to evaluate separated role dashboards:
            </p>

            <div className="space-y-1.5">
              {roles.map(r => {
                const Icon = r.icon;
                const isActive = currentRole === r.role;
                return (
                  <button
                    key={r.role}
                    onClick={() => handleRoleSelect(r.role)}
                    className={`w-full text-left p-2 rounded-lg text-xs flex items-start gap-2.5 transition-all ${
                      isActive
                        ? 'bg-navy-50 border-2 border-navy-700 font-semibold'
                        : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <div className={`p-1.5 rounded-md text-white ${r.color} shrink-0 mt-0.5`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900">{r.label}</span>
                        {isActive && (
                          <span className="text-[10px] bg-navy-700 text-white px-1.5 py-0.2 rounded font-normal">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{r.persona}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  resetDemoData();
                  alert('Demo database reset to initial flagship scenario.');
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 transition-colors"
                title="Reset all challenges and projects to initial state"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Demo Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Pill Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2.5 bg-navy-700 hover:bg-navy-800 text-white rounded-full shadow-lg border border-navy-600 transition-all transform hover:scale-105"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-saffron-500"></span>
        </span>
        <span className="text-xs font-semibold tracking-wide">
          Role: <span className="text-saffron-400 capitalize">{currentRole}</span>
        </span>
        {isOpen ? <ChevronDown className="w-4 h-4 text-slate-300" /> : <ChevronUp className="w-4 h-4 text-slate-300" />}
      </button>
    </div>
  );
};
