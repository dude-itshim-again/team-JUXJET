import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { IndustrySidebar } from './IndustrySidebar';
import { Menu, X, Building2, Coins } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const IndustryLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser } = useApp();

  return (
    <div className="min-h-[calc(100vh-68px)] flex flex-col bg-[#F5F7FA]">
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-xs font-bold text-slate-900 tracking-wide uppercase">
              Industry & CSR Collaboration Workspace
            </span>
            <span className="hidden sm:inline text-xs text-slate-400">|</span>
            <span className="hidden sm:inline text-xs text-slate-600">
              {currentUser?.organizationName || 'Corporate Innovation Network'}
            </span>
          </div>
        </div>

        <Link
          to="/partners/opportunities"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors"
        >
          <Coins className="w-3.5 h-3.5" />
          <span>Explore Funding Calls</span>
        </Link>
      </div>

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <div className="hidden md:block shrink-0">
          <IndustrySidebar />
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-50">
              <div className="p-3 flex justify-end border-b border-slate-100">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-md text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <IndustrySidebar onItemClick={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
