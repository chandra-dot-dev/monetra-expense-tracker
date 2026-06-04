import React from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface SparklinePoint {
  value: number;
}

interface FinancialCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  additionalContent?: React.ReactNode;
  sparklineData?: SparklinePoint[];
  percentageChange?: string | number;
  trendType?: "positive" | "negative" | "neutral";
}

const FinancialCard = ({
  icon,
  label,
  value,
  additionalContent,
  sparklineData,
  percentageChange,
  trendType = "neutral",
}: FinancialCardProps) => {
  const getTrendColor = () => {
    if (trendType === "positive") return "#5E7A68"; // forest green
    if (trendType === "negative") return "#9B5B57"; // burgundy
    return "#C5A059"; // gold
  };

  const trendColorClass = 
    trendType === "positive" 
      ? "bg-[#5E7A68]/10 text-[#5E7A68] border border-[#5E7A68]/20" 
      : trendType === "negative" 
        ? "bg-[#9B5B57]/10 text-[#9B5B57] border border-[#9B5B57]/20" 
        : "bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20";

  return (
    <div className="bg-surface-app rounded-2xl p-6 border border-border-app flex flex-col justify-between transition-all duration-150 shadow-xs hover:shadow-sm relative overflow-hidden group">
      {/* Subtle hover gradient highlight */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-gold-hex)]/0 via-[var(--color-gold-hex)]/0 to-[var(--color-gold-hex)]/[0.015] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

      <div className="flex justify-between items-start relative z-10 w-full">
        <div className="space-y-1.5 flex-1 min-w-0">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-app block font-sans">
            {label}
          </span>
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <span className="text-2xl md:text-3xl font-bold text-text-app tracking-tight block font-serif">
              {value}
            </span>
            {percentageChange != null && (
              <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md border font-sans ${trendColorClass}`}>
                {trendType === "positive" ? "↑" : trendType === "negative" ? "↓" : "→"} {percentageChange}
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className="flex-shrink-0 p-2 bg-bg-app border border-border-app rounded-xl text-[var(--color-gold-hex)] shadow-2xs">
            {icon}
          </div>
        )}
      </div>

      {/* Dynamic Sparkline Chart */}
      {sparklineData && sparklineData.length > 0 && (
        <div className="w-full h-8 mt-3 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData} margin={{ top: 2, bottom: 2, left: 2, right: 2 }}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={getTrendColor()}
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {additionalContent && (
        <div className="mt-4 border-t border-border-app pt-3 text-xs text-muted-app font-sans relative z-10">
          {additionalContent}
        </div>
      )}
    </div>
  );
};

export default FinancialCard;

