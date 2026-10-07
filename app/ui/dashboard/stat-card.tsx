import React from 'react';

type ColorTheme = 'blue' | 'amber' | 'emerald';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  colorTheme: ColorTheme;
}

export function StatCard({ title, value, icon: Icon, colorTheme }: StatCardProps) {
  const themeStyles = {
    blue: {
      gradient: 'from-blue-50/50 dark:from-blue-900/10',
      bgIcon: 'bg-blue-50 dark:bg-blue-900/30',
      textIcon: 'text-blue-600 dark:text-blue-400',
      ringIcon: 'ring-blue-100 dark:ring-blue-800/50',
    },
    amber: {
      gradient: 'from-amber-50/50 dark:from-amber-900/10',
      bgIcon: 'bg-amber-50 dark:bg-amber-900/30',
      textIcon: 'text-amber-600 dark:text-amber-400',
      ringIcon: 'ring-amber-100 dark:ring-amber-800/50',
    },
    emerald: {
      gradient: 'from-emerald-50/50 dark:from-emerald-900/10',
      bgIcon: 'bg-emerald-50 dark:bg-emerald-900/30',
      textIcon: 'text-emerald-600 dark:text-emerald-400',
      ringIcon: 'ring-emerald-100 dark:ring-emerald-800/50',
    }
  };

  const style = themeStyles[colorTheme];

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-zinc-800 transition-all hover:shadow-md hover:-translate-y-1">
      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">{title}</p>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${style.bgIcon} ${style.textIcon} ring-1 ring-inset ${style.ringIcon}`}>
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}
