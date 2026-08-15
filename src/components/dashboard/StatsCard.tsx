import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: { value: number; label: string };
  className?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-blue-600",
  iconBg = "bg-blue-50 dark:bg-blue-950/40",
  trend,
  className = "",
}: StatsCardProps) {
  const TrendIcon =
    trend?.value == null ? Minus : trend.value > 0 ? TrendingUp : TrendingDown;
  const trendColor =
    trend?.value == null
      ? "text-slate-400"
      : trend.value > 0
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-red-500 dark:text-red-400";

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm card-hover ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white mb-0.5">
          {value}
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">{title}</div>
        {subtitle && (
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {subtitle}
          </div>
        )}
        {trend && (
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {trend.label}
          </div>
        )}
      </div>
    </div>
  );
}
