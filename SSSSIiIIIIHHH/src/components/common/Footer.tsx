import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-900 text-slate-300 font-sans border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center text-white shadow">
                <svg className="w-5 h-5 text-saffron-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                  <line x1="4" y1="22" x2="4" y2="15"></line>
                </svg>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Jan<span className="text-teal-400">Setu</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "From Societal Challenges to Scalable Solutions." Bridging citizens, higher education institutions, government departments, and industry partners.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-saffron-400 font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>JanSetu Civic-Tech Platform</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Platform Workspaces
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/citizen/dashboard" className="hover:text-white transition-colors">
                  Citizen Reporting Workspace
                </Link>
              </li>
              <li>
                <Link to="/university/dashboard" className="hover:text-white transition-colors">
                  University & R&D Hub
                </Link>
              </li>
              <li>
                <Link to="/government/dashboard" className="hover:text-white transition-colors">
                  Government Triage & Governance
                </Link>
              </li>
              <li>
                <Link to="/partners/dashboard" className="hover:text-white transition-colors">
                  Industry & CSR Partnerships
                </Link>
              </li>
              <li>
                <Link to="/projects/PROJ-2026-001" className="hover:text-white transition-colors">
                  Project Lifecycle (AquaShuddhi)
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Societal Thematics
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Water & Sanitation (Jal Jeevan)</li>
              <li>Agriculture & Stubble Management</li>
              <li>Healthcare & Assistive Technology</li>
              <li>Urban Flooding & Smart Drainage</li>
              <li>Renewable Energy & Microgrids</li>
              <li>Tribal Livelihoods & Cold Storage</li>
            </ul>
          </div>

          {/* Governance & Disclaimer */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Prototype Transparency
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              JanSetu is a civic technology platform. Phone OTP verification and AI recommendations are simulated in development mode.
            </p>
            <div className="p-2.5 rounded-lg bg-navy-800/80 border border-navy-700 text-[11px] text-slate-300">
              <span className="font-semibold text-teal-300 block mb-0.5">Verified Impact Standard</span>
              Outcomes are marked verified only after ground testing and community audit certificates.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 mt-6 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 JanSetu Platform. Built for community innovation.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Accessibility</span>
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Grievance Redressal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
