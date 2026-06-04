import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  LineChart, 
  Wallet, 
  Layers, 
  FileText, 
  Settings, 
  User, 
  LogOut, 
  ChevronLeft 
} from "lucide-react";
import { sidebarStyles, cn } from "../assets/dummyStyles";
import { UserProfile } from "../context/AuthContext";

interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
}

const MENU_ITEMS: MenuItem[] = [
  { text: "Dashboard", path: "/", icon: <LayoutDashboard size={16} /> },
  { text: "Transactions", path: "/transactions", icon: <ArrowLeftRight size={16} /> },
  { text: "Analytics", path: "/analytics", icon: <LineChart size={16} /> },
  { text: "Budgets", path: "/budgets", icon: <Wallet size={16} /> },
  { text: "Categories", path: "/categories", icon: <Layers size={16} /> },
  { text: "Reports", path: "/reports", icon: <FileText size={16} /> },
  { text: "Settings", path: "/settings", icon: <Settings size={16} /> },
  { text: "Profile", path: "/profile", icon: <User size={16} /> },
];

// Core 4 items for clean mobile navigation tab bar layout
const MOBILE_MENU_ITEMS: MenuItem[] = [
  { text: "Dashboard", path: "/", icon: <LayoutDashboard size={16} /> },
  { text: "Ledger", path: "/transactions", icon: <ArrowLeftRight size={16} /> },
  { text: "Analytics", path: "/analytics", icon: <LineChart size={16} /> },
  { text: "Profile", path: "/profile", icon: <User size={16} /> },
];

interface SidebarProps {
  user: UserProfile | null;
  isCollapsed: boolean;
  onLogout: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({
  user,
  isCollapsed,
  onLogout,
  mobileOpen,
  setMobileOpen,
  setSidebarCollapsed,
}: SidebarProps) => {
  const { pathname } = useLocation();
  const [localCollapsed, setLocalCollapsed] = useState(isCollapsed);
  const [activeHover, setActiveHover] = useState<string | null>(null);

  const toggleCollapse = () => {
    const newVal = !localCollapsed;
    setLocalCollapsed(newVal);
    if (typeof setSidebarCollapsed === "function") {
      setSidebarCollapsed(newVal);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderMenuItem = ({ text, path, icon }: MenuItem) => {
    const isActive = pathname === path;
    return (
      <motion.li key={text} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Link
          to={path}
          className={cn(
            sidebarStyles.menuItem.base,
            isActive ? sidebarStyles.menuItem.active : sidebarStyles.menuItem.inactive,
            localCollapsed ? sidebarStyles.menuItem.collapsed : sidebarStyles.menuItem.expanded
          )}
          onMouseEnter={() => setActiveHover(text)}
          onMouseLeave={() => setActiveHover(null)}
        >
          <span className={isActive ? sidebarStyles.menuIcon.active : sidebarStyles.menuIcon.inactive}>
            {icon}
          </span>
          {!localCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              {text}
            </motion.span>
          )}
          {activeHover === text && !isActive && !localCollapsed && (
            <span className={sidebarStyles.activeIndicator}></span>
          )}
        </Link>
      </motion.li>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          sidebarStyles.sidebarContainer.base,
          localCollapsed ? "w-20" : "w-60"
        )}
      >
        <div className={sidebarStyles.sidebarInner.base}>
          {/* Collapse Trigger Button */}
          <button
            onClick={toggleCollapse}
            className={sidebarStyles.toggleButton.base}
            aria-label={localCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <motion.div
              animate={{ rotate: localCollapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft size={12} />
            </motion.div>
          </button>

          {/* User badge container */}
          <div
            className={cn(
              sidebarStyles.userProfileContainer.base,
              localCollapsed ? sidebarStyles.userProfileContainer.collapsed : sidebarStyles.userProfileContainer.expanded
            )}
          >
            <div className="flex items-center gap-3">
              <div className={sidebarStyles.userInitials.base}>
                {getInitials(user?.name)}
              </div>
              {!localCollapsed && (
                <motion.div
                  className="ml-1 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="font-semibold text-xs text-text-app truncate max-w-[120px]">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[10px] text-muted-app truncate max-w-[120px] mt-0.5">
                    {user?.email || "user@example.com"}
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Sidebar Menu Link Options */}
          <nav className="flex-1 py-4">
            <ul className={sidebarStyles.menuList.base}>
              {MENU_ITEMS.map((item) => renderMenuItem(item))}
            </ul>
          </nav>

          {/* Sidebar logout card bottom */}
          <div
            className={cn(
              sidebarStyles.footerContainer.base,
              localCollapsed ? sidebarStyles.footerContainer.collapsed : sidebarStyles.footerContainer.expanded
            )}
          >
            <button
              onClick={onLogout}
              className={sidebarStyles.logoutButton.base}
            >
              <LogOut size={14} className="text-muted-app" />
              {!localCollapsed && <span>Log Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Tab-Bar Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-45 bg-surface-app border-t border-border-app pb-2 flex items-center justify-around py-1.5 px-2 transition-colors duration-150">
        {MOBILE_MENU_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.text}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1.5 py-1 px-3 text-xs font-medium rounded-md transition-all cursor-pointer",
                isActive 
                  ? "text-text-app font-semibold" 
                  : "text-muted-app hover:text-text-app"
              )}
            >
              <span className={cn(
                "p-1 rounded transition-colors",
                isActive 
                  ? "bg-bg-app border border-border-app text-text-app" 
                  : "text-muted-app"
              )}>
                {item.icon}
              </span>
              <span className="text-[9px] tracking-wide mt-0.5">{item.text}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;
