import React from 'react';
import { ChallengeStatus, Priority } from '../../types';
import { getStatusBadgeStyle, getPriorityBadgeStyle } from '../../utils/helpers';

interface StatusBadgeProps {
  status: ChallengeStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const style = getStatusBadgeStyle(status);
  const sizeClass = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${style} ${sizeClass}`}>
      {status}
    </span>
  );
};

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  const style = getPriorityBadgeStyle(priority);
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-md border uppercase tracking-wider font-semibold ${style} ${sizeClass}`}>
      {priority}
    </span>
  );
};
