import React from "react";
import { 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis
} from "recharts";

interface GaugeData {
  name: string;
  value: number;
  max: number;
}

interface GaugeCardProps {
  gauge: GaugeData;
  colorInfo: {
    gradientStart: string;
    gradientEnd: string;
    text: string;
    bg: string;
  };
  timeFrameLabel?: string;
  highlightNegative?: boolean;
}

const GaugeCard = ({
  gauge,
  colorInfo,
  timeFrameLabel = "",
  highlightNegative = false,
}: GaugeCardProps) => {
  const { name = "Metric", value = 0, max = 100 } = gauge;
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  
  const chartValue = isNegative ? absValue : value;
  const percentage = Math.min((absValue / (max || 1)) * 100, 100);

  // Set luxury colors based on the metric type
  let gradientStart = "#C5A059";
  let gradientEnd = "#967A4F";
  let textColor = "text-text-app";

  if (isNegative) {
    gradientStart = "#9B5B57"; // Muted Burgundy
    gradientEnd = "#8A4D49";
    textColor = "text-[#9B5B57]";
  } else if (name === "Income" || name === "Revenue") {
    gradientStart = "#C5A059"; // Antique Gold
    gradientEnd = "#967A4F";
  } else if (name === "Spent" || name === "Expenses" || name === "Spent Period") {
    gradientStart = "#78716C"; // Taupe / Slate
    gradientEnd = "#5A5552";
  } else if (name === "Savings" || name === "Net Cashflow") {
    gradientStart = "#5E7A68"; // Forest Green
    gradientEnd = "#4A6052";
  }

  const radialBg = "var(--color-border-app)";
  const percentColor = "text-muted-app";

  return (
    <div className="bg-surface-app rounded-2xl p-6 flex flex-col items-center border border-border-app transition-all duration-150 shadow-xs hover:shadow-sm">
      <h3 className={`text-base font-serif font-bold mb-3 ${textColor}`}>
        {name}
      </h3>
      <div className="w-full h-48">
        <ResponsiveContainer>
          <RadialBarChart
            data={[{ ...gauge, value: chartValue }]}
            cx="50%"
            cy="40%"
            startAngle={180}
            endAngle={0}
            innerRadius="70%"
            outerRadius="100%"
          >
            <PolarAngleAxis
              type="number"
              domain={[0, max]}
              angleAxisId={0}
              tick={false}
              allowDataOverflow
            />

            <RadialBar
              background={{ fill: radialBg }}
              dataKey="value"
              cornerRadius="50%"
              fill={`url(#${name.replace(/\s+/g, '')}Gradient)`}
            />

            <text 
              x="50%" 
              y="45%" 
              textAnchor="middle" 
              dominantBaseline="middle"
              className={`text-2xl font-serif font-bold ${textColor}`}
              fill="currentColor"
            >
              {isNegative ? "-" : ""}${Math.round(absValue).toLocaleString()}
            </text>
            <text 
              x="50%" 
              y="62%" 
              textAnchor="middle" 
              dominantBaseline="middle"
              className={`text-xs font-sans font-medium ${percentColor}`}
              fill="currentColor"
            >
              {Math.round(percentage)}%
            </text>

            <defs>
              <linearGradient id={`${name.replace(/\s+/g, '')}Gradient`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradientStart} />
                <stop offset="100%" stopColor={gradientEnd} />
              </linearGradient>
            </defs>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center mt-3">
        {isNegative && highlightNegative && (
          <p className="text-xs text-[#9B5B57] font-semibold mb-1 animate-pulse font-serif">
            Negative Savings
          </p>
        )}
        <p className="text-xs text-muted-app font-sans">
          {timeFrameLabel} data
        </p>
      </div>
    </div>
  );
};

export default GaugeCard;

