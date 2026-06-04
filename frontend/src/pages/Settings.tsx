import React, { useState } from "react";
import { Settings, Shield, Bell, HelpCircle } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

const SettingsPage = () => {
  const { theme } = useTheme();
  const [currency, setCurrency] = useState("USD");
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    weeklyReports: false,
    securityAlerts: true,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto p-4 md:p-6 text-text-app">
      {/* Header Container */}
      <div className="bg-surface-app rounded-lg p-5 border border-border-app mb-4">
        <h1 className="text-xl font-semibold tracking-tight text-text-app">Settings</h1>
        <p className="text-xs text-muted-app">Configure your platform preferences and workspace settings</p>
      </div>

      <div className="space-y-4">
        {/* Appearance Settings */}
        <div className="bg-surface-app border border-border-app rounded-lg p-5 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider pb-2 border-b border-border-app flex items-center gap-2">
            <Settings size={14} /> Workspace Preferences
          </h3>

          <div className="flex items-center justify-between py-2 text-xs">
            <div>
              <p className="font-semibold text-text-app">Interface Theme</p>
              <p className="text-[10px] text-muted-app mt-0.5">Toggle between light and dark visual themes</p>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex items-center justify-between py-2 border-t border-border-app/40 text-xs">
            <div>
              <p className="font-semibold text-text-app">Primary Currency</p>
              <p className="text-[10px] text-muted-app mt-0.5">Set the active currency for ledger balances</p>
            </div>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-bg-app border border-border-app rounded-md px-2.5 py-1.5 text-xs text-text-app focus:outline-none"
            >
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="INR">INR (₹) - Indian Rupee</option>
            </select>
          </div>
        </div>

        {/* Notifications Alert Settings */}
        <div className="bg-surface-app border border-border-app rounded-lg p-5 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider pb-2 border-b border-border-app flex items-center gap-2">
            <Bell size={14} /> Alert & Notifications
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-text-app">Monthly Budget Warnings</p>
                <p className="text-[10px] text-muted-app mt-0.5">Receive warnings when category spending reaches 90% limit</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.budgetAlerts}
                onChange={() => handleToggle("budgetAlerts")}
                className="w-3.5 h-3.5 text-text-app border-border-app rounded bg-bg-app focus:ring-zinc-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between border-t border-border-app/40 pt-3 text-xs">
              <div>
                <p className="font-semibold text-text-app">Weekly Insights Digest</p>
                <p className="text-[10px] text-muted-app mt-0.5">Get a weekly summary email of cashflow velocity</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.weeklyReports}
                onChange={() => handleToggle("weeklyReports")}
                className="w-3.5 h-3.5 text-text-app border-border-app rounded bg-bg-app focus:ring-zinc-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between border-t border-border-app/40 pt-3 text-xs">
              <div>
                <p className="font-semibold text-text-app">Security & Auth Alerts</p>
                <p className="text-[10px] text-muted-app mt-0.5">Get notified immediately upon account changes or login anomalies</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.securityAlerts}
                onChange={() => handleToggle("securityAlerts")}
                className="w-3.5 h-3.5 text-text-app border-border-app rounded bg-bg-app focus:ring-zinc-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-surface-app border border-border-app rounded-lg p-5 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider pb-2 border-b border-border-app flex items-center gap-2">
            <Shield size={14} /> Security Compliance
          </h3>
          <div className="text-xs text-muted-app">
            <p>Data stored on Monetra is fully encrypted. We follow bank-level industry security practices to keep your ledger credentials safe.</p>
            <p className="mt-2 text-[10px] flex items-center gap-1"><HelpCircle size={10} /> Need help? Contact compliance support.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
