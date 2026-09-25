import { ChallengeStatus, Priority } from '../types';

export const formatCurrencyINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export const getStatusBadgeStyle = (status: ChallengeStatus): string => {
  switch (status) {
    case 'Draft':
      return 'bg-slate-100 text-slate-700 border-slate-300';
    case 'Submitted':
      return 'bg-amber-50 text-amber-800 border-amber-300';
    case 'Under Validation':
      return 'bg-purple-50 text-purple-800 border-purple-300';
    case 'Additional Info Required':
      return 'bg-orange-50 text-orange-800 border-orange-300';
    case 'Validated':
      return 'bg-blue-50 text-blue-800 border-blue-300';
    case 'Assigned to University':
      return 'bg-teal-50 text-teal-800 border-teal-300';
    case 'Project Initiated':
      return 'bg-indigo-50 text-indigo-800 border-indigo-300';
    case 'In Progress':
      return 'bg-sky-50 text-sky-800 border-sky-300';
    case 'Pilot':
      return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold';
    case 'Implemented':
    case 'Completed':
      return 'bg-green-100 text-green-900 border-green-400 font-bold';
    case 'Rejected':
      return 'bg-rose-50 text-rose-800 border-rose-300';
    case 'Duplicate Linked':
      return 'bg-zinc-100 text-zinc-700 border-zinc-300';
    case 'On Hold':
      return 'bg-yellow-50 text-yellow-800 border-yellow-300';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-300';
  }
};

export const getPriorityBadgeStyle = (priority: Priority): string => {
  switch (priority) {
    case 'Critical':
      return 'bg-red-100 text-red-800 border-red-300 font-bold animate-pulse';
    case 'High':
      return 'bg-orange-100 text-orange-800 border-orange-300 font-semibold';
    case 'Medium':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Low':
      return 'bg-slate-100 text-slate-700 border-slate-300';
  }
};
