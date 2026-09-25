import React from 'react';
import { useApp } from '../../context/AppContext';
import { History, Shield, Lock } from 'lucide-react';

export const GovernmentAuditPage: React.FC = () => {
  const { auditLogs } = useApp();

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
            National Audit Trail & Governance Logs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log of challenge validations, university assignments, and CSR grant pledges.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span>Audit Integrity Verified</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Record</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{log.actor}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-blue-900">{log.action}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{log.targetId}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-sm truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
