import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const base = "px-2 py-0.5 rounded-md border text-xs font-medium inline-block";
  let colorClasses = "";

  switch (status) {
    case 'Open':
      colorClasses = "text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      break;
    case 'In Behandeling':
      colorClasses = "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
      break;
    case 'Wacht op feedback':
      colorClasses = "text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800";
      break;
    case 'Voltooid':
      colorClasses = "text-green-700 bg-green-50 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      break;
    default:
      colorClasses = "text-gray-700 bg-gray-100 border-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:border-zinc-700";
      break;
  }

  return (
    <span className={`${base} ${colorClasses}`}>
      {status || 'Open'}
    </span>
  );
}
