import React from 'react';

interface KpiCardProps {
  id?: string;
  title: string;
  value: string | number;
  subValue?: string;
  subtitle?: string;
  badgeText?: string;
  accent?: 'blue' | 'amber' | 'neutral';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  id,
  title,
  value,
  subValue,
  subtitle,
  badgeText,
  accent = 'neutral',
}) => {
  const borderTopColor =
    accent === 'blue'
      ? 'border-t-[#3069F6]'
      : accent === 'amber'
      ? 'border-t-[#FEBB02]'
      : 'border-t-slate-300';

  const valueColor =
    accent === 'blue'
      ? 'text-[#3069F6]'
      : 'text-[#2D384C]';

  const badgeClasses =
    accent === 'amber'
      ? 'text-[#9A6200] bg-amber-50/90 border border-[#FEBB02]/50'
      : accent === 'blue'
      ? 'text-[#0D47A1] bg-blue-50/80 border border-[#3069F6]/30'
      : 'text-slate-600 bg-slate-100 border border-slate-200';

  return (
    <div
      id={id}
      className={`p-4 bg-white border border-slate-200/90 border-t-2 ${borderTopColor} rounded-xl shadow-xs hover:shadow-sm transition-all`}
    >
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1.5">
        <span className="uppercase tracking-wider font-semibold text-[10px] text-[#2D384C]/80">
          {title}
        </span>
        {badgeText && (
          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${badgeClasses}`}>
            {badgeText}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-bold tracking-tight font-mono ${valueColor}`}>
          {value}
        </span>
        {subValue && (
          <span className="text-xs text-slate-500 font-mono">
            {subValue}
          </span>
        )}
      </div>

      {subtitle && (
        <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 truncate">
          {subtitle}
        </div>
      )}
    </div>
  );
};

