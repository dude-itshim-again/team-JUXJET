import React from 'react';
import { Shield, Sparkles, GraduationCap, Building2, Users, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full">
          JanSetu Community Innovation Platform
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          JanSetu: Bridging Challenges to Scalable Solutions
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          A digital platform to crowdsource societal challenges and facilitate collaborative problem solving through universities and industry partnerships.
        </p>
      </div>

      {/* Core Mission */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-subtle space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Platform Vision</h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Millions of grassroots societal challenges—from fluoride in village handpumps to crop residue smoke and urban stormwater backflow—remain unresolved because citizens lack a direct bridge to engineering institutions capable of developing affordable prototypes.
        </p>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Simultaneously, thousands of university engineering students and faculty seek genuine real-world problem statements for academic capstone projects, patents, and NEP 2020 multidisciplinary innovation credits.
        </p>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          <strong>JanSetu</strong> closes this loop by providing three dedicated, role-separated workspaces for Citizens, Universities, and Government officers, reinforced by an Industry CSR funding ecosystem.
        </p>
      </div>

      {/* 4 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-2">
          <Users className="w-6 h-6 text-emerald-600 mb-2" />
          <h3 className="text-sm font-bold text-slate-900">Ground Truth Sourcing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Geotagged mobile reporting with photo/lab report evidence and affected population counts.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-2">
          <Shield className="w-6 h-6 text-blue-700 mb-2" />
          <h3 className="text-sm font-bold text-slate-900">AI-Assisted Triage</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Simulated natural language categorization, duplicate detection, and department routing.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-2">
          <GraduationCap className="w-6 h-6 text-teal-700 mb-2" />
          <h3 className="text-sm font-bold text-slate-900">Academic R&D</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Multidisciplinary teams prototyping hardware/software solutions with industry CSR matching.
          </p>
        </div>
      </div>

      {/* Evaluator CTA */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-navy-800 to-navy-950 text-white text-center space-y-4">
        <h3 className="text-xl font-bold">Ready to Evaluate the Workflow?</h3>
        <p className="text-xs text-slate-300 max-w-lg mx-auto">
          Use our 1-click Role Switcher or Phone OTP login to walk through the complete journey from citizen problem submission to government validation and university pilot deployment.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            to="/citizen/dashboard"
            className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
          >
            Citizen Workspace
          </Link>
          <Link
            to="/government/dashboard"
            className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white shadow-sm"
          >
            Government Workspace
          </Link>
          <Link
            to="/university/dashboard"
            className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white shadow-sm"
          >
            University Workspace
          </Link>
        </div>
      </div>
    </div>
  );
};
