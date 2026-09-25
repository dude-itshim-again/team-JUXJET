import { ChallengeCategory, ChallengeStatus, Priority, Role } from '../types';

export const CATEGORIES: ChallengeCategory[] = [
  'Water and Sanitation',
  'Healthcare',
  'Agriculture',
  'Education',
  'Rural Development',
  'Urban Infrastructure',
  'Environment and Climate',
  'Renewable Energy',
  'Waste Management',
  'Transportation',
  'Public Safety',
  'Accessibility',
  'Digital Governance',
  'Livelihoods',
  'Other'
];

export const STATES_AND_DISTRICTS: Record<string, string[]> = {
  Jharkhand: ['Ranchi', 'Dhanbad', 'Jamshedpur', 'Bokaro', 'Hazaribagh', 'Deoghar', 'Giridih', 'Dumka']
};

export const ROLE_METADATA: Record<Role, { label: string; badgeClass: string; path: string; description: string }> = {
  citizen: {
    label: 'Citizen',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    path: '/citizen/dashboard',
    description: 'Report societal problems, provide ground truth, track solution progress, and engage locally.'
  },
  university: {
    label: 'Higher Education / R&D',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-300',
    path: '/university/dashboard',
    description: 'Discover validated challenges, assemble student teams, conduct research, and prototype solutions.'
  },
  government: {
    label: 'Government / Administrator',
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
    path: '/government/dashboard',
    description: 'AI-assisted challenge triage, department routing, university matching, and milestone governance.'
  },
  industry: {
    label: 'Industry / CSR Partner',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    path: '/partners/dashboard',
    description: 'Sponsor solutions, provide lab equipment, mentor teams, and scale pilot deployments.'
  }
};
