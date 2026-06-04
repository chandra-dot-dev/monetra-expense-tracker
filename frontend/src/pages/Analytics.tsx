import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  LineChart, 
  BarChart, 
  Bar, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Activity, 
  PieChart as DonutIcon, 
  Layers, 
  Sparkles, 
  ArrowUpRight 
} from "lucide-react";
import { LayoutContextType } from "../components/Layout";
import FinancialCard from "../components/FinancialCard";
import { COLORS } from "../assets/color";
import { dashboardStyles, chartStyles } from "../assets/dummyStyles";
import { useTheme } from "../context/ThemeContext";

const AnalyticsPage = () => {
  const { theme } = useTheme();
  const { transactions = [], timeFrame = "monthly" } = useOutletContext<LayoutContextType>();

  // 1. Basic sums calculations
  const totals = useMemo(() => {
    let income = 0;
    let expenses = 0;
    
    transactions.forEach((t) => {
      if (t.type === "income") {
        income += t.amount;
      } else {
        expenses += t.amount;
      }
    });

    const netCashflow = income - expenses;
    const savingsRate = income > 0 ? Math.round((netCashflow / income) * 100) : 0;
    
    // Calculate simple health score (ranges from 30 to 99)
    let score = 50;
    if (savingsRate > 0) score += Math.min(savingsRate * 0.4, 30);
    if (income > 1000) score += 10;
    if (expenses > 0 && expenses < income * 0.7) score += 10;
    const healthScore = Math.min(Math.max(Math.round(score), 30), 99);

    return { income, expenses, netCashflow, savingsRate, healthScore };
  }, [transactions]);

  // 2. Generate dynamic sparkline trend datasets based on actual ledger history
  const sparklines = useMemo(() => {
    const defaultData = Array.from({ length: 8 }, (_, i) => ({ value: 10 + i * 2 }));
    if (transactions.length === 0) {
      return { balance: defaultData, income: defaultData, expense: defaultData, savings: defaultData };
    }

    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Slice into 8 historic segments
    const segments = 8;
    const segmentSize = Math.max(Math.ceil(sorted.length / segments), 1);
    
    const balancePoints: { value: number }[] = [];
    const incomePoints: { value: number }[] = [];
    const expensePoints: { value: number }[] = [];
    
    let cumBalance = 0;
    for (let i = 0; i < segments; i++) {
      const startIdx = i * segmentSize;
      const endIdx = Math.min(startIdx + segmentSize, sorted.length);
      const segmentTx = sorted.slice(startIdx, endIdx);
      
      let segIncome = 0;
      let segExpense = 0;
      
      segmentTx.forEach(tx => {
        if (tx.type === "income") {
          cumBalance += tx.amount;
          segIncome += tx.amount;
        } else {
          cumBalance -= tx.amount;
          segExpense += tx.amount;
        }
      });

      balancePoints.push({ value: cumBalance });
      incomePoints.push({ value: segIncome });
      expensePoints.push({ value: segExpense });
    }

    return {
      balance: balancePoints,
      income: incomePoints,
      expense: expensePoints,
      savings: balancePoints.map(p => ({ value: p.value > 0 ? p.value * 0.08 : 0 })) // Simulate investment return
    };
  }, [transactions]);

  // 3. Category donut chart data
  const categoryDistribution = useMemo(() => {
    const categories: Record<string, number> = {};
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === "expense") {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
        totalExpense += t.amount;
      }
    });

    return Object.keys(categories).map((cat) => ({
      name: cat,
      value: Math.round(categories[cat]),
      percentage: totalExpense > 0 ? Math.round((categories[cat] / totalExpense) * 100) : 0
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  // 4. Chronological Chart Data (Monthly Cashflow / Area overlays)
  const cashflowTimeline = useMemo(() => {
    // Group transactions by month
    const groups: Record<string, { month: string; income: number; expense: number; investments: number }> = {};
    
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthLabel = date.toLocaleString("default", { month: "short", year: "2-digit" });
      
      if (!groups[monthLabel]) {
        groups[monthLabel] = { month: monthLabel, income: 0, expense: 0, investments: 0 };
      }
      
      if (t.type === "income") {
        groups[monthLabel].income += t.amount;
      } else {
        groups[monthLabel].expense += t.amount;
      }
    });

    const list = Object.values(groups);
    // Sort chronologically
    list.sort((a, b) => {
      const parseDate = (lbl: string) => {
        const [m, y] = lbl.split(" ");
        return new Date(Date.parse(`${m} 1, 20${y}`));
      };
      return parseDate(a.month).getTime() - parseDate(b.month).getTime();
    });

    // Populate simulated investment growth overlays
    let cumInvestments = 25000; // Base wealth mock
    const resolved = list.map((item, idx) => {
      cumInvestments += (item.income - item.expense) * 0.2 + (cumInvestments * 0.006); // compound savings + growth
      return {
        ...item,
        investments: Math.round(cumInvestments),
        net: item.income - item.expense
      };
    });

    if (resolved.length === 0) {
      return [
        { month: "Jan", income: 4200, expense: 2900, investments: 25000, net: 1300 },
        { month: "Feb", income: 4500, expense: 3200, investments: 26500, net: 1300 },
        { month: "Mar", income: 4100, expense: 3100, investments: 27800, net: 1000 },
        { month: "Apr", income: 5200, expense: 3400, investments: 30000, net: 1800 },
        { month: "May", income: 4900, expense: 3500, investments: 31800, net: 1400 }
      ];
    }
    return resolved;
  }, [transactions]);

  const gridColor = "var(--color-border-app)";
  const labelColor = "var(--color-muted-app)";
  const chartTextFill = theme === "dark" ? "#F5F5F0" : "#1C1917";

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8 text-text-app">
      {/* Dynamic Luxury Executive Header */}
      <div className="bg-surface-app rounded-2xl p-6 border border-border-app shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-text-app flex items-center gap-2">
              <Activity size={24} className="text-[var(--color-gold-hex)]" /> Financial Intelligence & Analytics
            </h1>
            <p className="text-xs text-muted-app mt-1.5 font-sans">
              Private wealth indicators, cashflow trends, and portfolio allocation analytics
            </p>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-widest font-bold font-sans text-muted-app">Portfolio Rating</span>
            <div className="flex items-center gap-1.5 text-text-app mt-0.5 justify-end">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5E7A68]"></span>
              <span className="font-serif font-bold text-sm tracking-wide">Excellent Health</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Six Executive KPI Sparkline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FinancialCard
          label="Total Net Value"
          value={`$${totals.netCashflow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sparklineData={sparklines.balance}
          percentageChange="8.4%"
          trendType={totals.netCashflow >= 0 ? "positive" : "negative"}
          icon={<DollarSign size={16} />}
        />
        <FinancialCard
          label="Gross Inflow (Monthly)"
          value={`$${totals.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sparklineData={sparklines.income}
          percentageChange="12.1%"
          trendType="positive"
          icon={<TrendingUp size={16} className="text-[#5E7A68]" />}
        />
        <FinancialCard
          label="Gross Outflow (Monthly)"
          value={`$${totals.expenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sparklineData={sparklines.expense}
          percentageChange="4.2%"
          trendType="negative"
          icon={<TrendingDown size={16} className="text-[#9B5B57]" />}
        />
        <FinancialCard
          label="Savings Rate Index"
          value={`${totals.savingsRate}%`}
          sparklineData={sparklines.balance.map(p => ({ value: Math.max(p.value * 0.005, 0) }))}
          percentageChange={`${totals.savingsRate > 20 ? "+2.5%" : "-1.1%"}`}
          trendType={totals.savingsRate >= 20 ? "positive" : "neutral"}
          icon={<Layers size={16} />}
        />
        <FinancialCard
          label="Simulated Wealth Assets"
          value={`$${(totals.netCashflow > 0 ? totals.netCashflow * 4.2 + 25000 : 25000).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          sparklineData={sparklines.savings}
          percentageChange="6.8% YTD"
          trendType="positive"
          icon={<Sparkles size={16} />}
        />
        <FinancialCard
          label="Financial Health Score"
          value={`${totals.healthScore}/100`}
          sparklineData={sparklines.balance.map((p, i) => ({ value: 65 + i * 2 }))}
          percentageChange="+1.5%"
          trendType="positive"
          icon={<Target size={16} />}
        />
      </div>

      {/* Main Double Grid: Charts Left, Dial Widgets Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns - Advanced interactive charts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Revenue Trend vs Expense Analysis Overlay (Area Chart) */}
          <div className="bg-surface-app border border-border-app rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-serif font-semibold text-text-app mb-4 pb-2 border-b border-border-app flex items-center gap-2">
              <TrendingUp size={14} className="text-[var(--color-gold-hex)]" /> Revenue Trend & Expense Analysis
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashflowTimeline} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5E7A68" stopOpacity={0.4}/>
                      <stop offset="100%" stopColor="#5E7A68" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="expenseArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9B5B57" stopOpacity={0.4}/>
                      <stop offset="100%" stopColor="#9B5B57" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: labelColor, fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: labelColor, fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={dashboardStyles.tooltipContent} />
                  <Legend verticalAlign="top" align="right" iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10, paddingBottom: 15 }} />
                  
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    name="Gross Revenue" 
                    stroke="#5E7A68" 
                    strokeWidth={2}
                    fill="url(#incomeArea)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expense" 
                    name="Outbound Expenses" 
                    stroke="#9B5B57" 
                    strokeWidth={2}
                    fill="url(#expenseArea)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Cash Flow Chart (Bar Chart) & Net Index */}
          <div className="bg-surface-app border border-border-app rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-serif font-semibold text-text-app mb-4 pb-2 border-b border-border-app flex items-center gap-2">
              <Layers size={14} className="text-[var(--color-gold-hex)]" /> Monthly Net Cashflow Delta
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashflowTimeline} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-gold-hex)" stopOpacity={0.95}/>
                      <stop offset="100%" stopColor="var(--color-gold-hex)" stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: labelColor, fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: labelColor, fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={dashboardStyles.tooltipContent} />
                  <Bar 
                    dataKey="net" 
                    name="Net Cashflow" 
                    fill="url(#goldGrad)" 
                    radius={[4, 4, 0, 0]} 
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Investment Portfolio Growth Visualization (Area/Line) */}
          <div className="bg-surface-app border border-border-app rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-serif font-semibold text-text-app mb-4 pb-2 border-b border-border-app flex items-center gap-2">
              <Sparkles size={14} className="text-[var(--color-gold-hex)]" /> Simulated Asset Growth
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashflowTimeline} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="wealthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-gold-hex)" stopOpacity={0.25}/>
                      <stop offset="100%" stopColor="var(--color-gold-hex)" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: labelColor, fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: labelColor, fontSize: 10 }} tickFormatter={(v) => `$${Math.round(v/1000)}k`} />
                  <Tooltip contentStyle={dashboardStyles.tooltipContent} />
                  <Area 
                    type="monotone" 
                    dataKey="investments" 
                    name="Simulated Investments" 
                    stroke="var(--color-gold-hex)" 
                    strokeWidth={2.5}
                    fill="url(#wealthGrad)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column - Score Dial, Allocation, Goal Indicators */}
        <div className="space-y-6">
          
          {/* Dial Dial: Financial Health Score Speedy Meter */}
          <div className="bg-surface-app border border-border-app rounded-2xl p-6 flex flex-col items-center shadow-xs">
            <h3 className="text-base font-serif font-bold text-text-app mb-3">
              Executive Health Gauge
            </h3>
            <div className="w-full h-44 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  data={[{ name: "Health", value: totals.healthScore }]}
                  cx="50%"
                  cy="70%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius="75%"
                  outerRadius="105%"
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background={{ fill: "var(--color-border-app)" }}
                    dataKey="value"
                    cornerRadius="50%"
                    fill="var(--color-gold-hex)"
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              
              {/* Dial Score Label positioning */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-6">
                <span className="text-3xl font-serif font-bold text-text-app tracking-tight">
                  {totals.healthScore}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-muted-app font-semibold mt-1">
                  Wealth score
                </span>
              </div>
            </div>
            
            <div className="text-center mt-2 border-t border-border-app pt-4 w-full text-xs font-sans">
              <p className="text-muted-app">
                Based on a savings rate of <span className="font-semibold text-text-app">{totals.savingsRate}%</span> and total positive cash retentions.
              </p>
            </div>
          </div>

          {/* Spend allocation pie breakdown */}
          <div className="bg-surface-app border border-border-app rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-serif font-semibold text-text-app mb-4 pb-2 border-b border-border-app flex items-center gap-2">
              <DonutIcon size={14} className="text-[var(--color-gold-hex)]" /> Spend Allocation
            </h3>
            {categoryDistribution.length > 0 ? (
              <div className="space-y-4">
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart className={chartStyles.pieChart}>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={theme === 'dark' ? 'var(--color-surface-hex)' : 'var(--color-background-hex)'} strokeWidth={1.5} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, "Amount"]} contentStyle={dashboardStyles.tooltipContent} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend List */}
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pt-2">
                  {categoryDistribution.map((item, idx) => (
                    <div key={item.name} className="flex items-center justify-between text-xs font-sans">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                        <span className="font-semibold text-text-app">{item.name}</span>
                      </div>
                      <div className="text-muted-app font-semibold">
                        <span>${item.value.toLocaleString()}</span>
                        <span className="ml-1 text-[10px] font-normal font-sans text-muted-app">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-muted-app">
                No outbound transactions recorded during this period.
              </div>
            )}
          </div>

          {/* Goal Progress Tracker */}
          <div className="bg-surface-app border border-border-app rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-serif font-semibold text-text-app mb-4 pb-2 border-b border-border-app flex items-center gap-2">
              <Target size={14} className="text-[var(--color-gold-hex)]" /> Wealth Targets
            </h3>
            <div className="space-y-4">
              {[
                { name: "Emergency Reserve", current: totals.netCashflow > 0 ? Math.min(totals.netCashflow, 10000) : 2500, target: 10000 },
                { name: "Luxury Investment Fund", current: totals.netCashflow > 0 ? Math.min(totals.netCashflow * 2, 50000) : 10000, target: 50000 },
                { name: "Real Estate Deposit", current: totals.netCashflow > 0 ? Math.min(totals.netCashflow, 100000) : 45000, target: 100000 }
              ].map((goal) => {
                const percentage = Math.min((goal.current / goal.target) * 100, 100);
                return (
                  <div key={goal.name} className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-sans">
                      <span className="font-semibold text-text-app">{goal.name}</span>
                      <span className="text-muted-app font-semibold">
                        ${goal.current.toLocaleString(undefined, { maximumFractionDigits: 0 })} / <span className="text-text-app">${goal.target.toLocaleString()}</span>
                      </span>
                    </div>
                    <div className="w-full bg-bg-app border border-border-app h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[var(--color-gold-hex)] rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AnalyticsPage;
