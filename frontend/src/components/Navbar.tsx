import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, User, LogOut } from "lucide-react";
import { navbarStyles } from "../assets/dummyStyles";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import { UserProfile } from "../context/AuthContext";

interface NavbarProps {
  user: UserProfile | null;
  onLogout: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const Navbar = ({ user, onLogout, mobileOpen, setMobileOpen }: NavbarProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className={navbarStyles.header}>
      <div className={navbarStyles.container}>
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-4">
          <div 
            onClick={() => navigate("/")} 
            className="cursor-pointer"
          >
            <Logo showText={true} iconSize={36} />
          </div>
        </div>

        {/* Right Side: Theme, Profile */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* User profile dropdown menu */}
          <div className={navbarStyles.userContainer} ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={navbarStyles.userButton}
            >
              <div className="relative flex items-center">
                <div className={navbarStyles.userAvatar}>
                  {getInitials(user?.name)}
                </div>
                <span className={navbarStyles.statusIndicator}></span>
              </div>
              <ChevronDown className={navbarStyles.chevronIcon(dropdownOpen)} />
            </button>

            {dropdownOpen && (
              <div className={navbarStyles.dropdownMenu}>
                <div className={navbarStyles.dropdownHeader}>
                  <div className="flex items-center gap-2.5">
                    <div className={navbarStyles.dropdownAvatar}>
                      {getInitials(user?.name)}
                    </div>
                    <div className="overflow-hidden">
                      <p className={navbarStyles.dropdownName + " font-semibold truncate"}>
                        {user?.name || "User"}
                      </p>
                      <p className={navbarStyles.dropdownEmail + " truncate"}>
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className={navbarStyles.menuItemContainer}>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/profile");
                    }}
                    className={navbarStyles.menuItem}
                  >
                    <User size={12} className="text-muted-app" />
                    My Profile
                  </button>
                </div>

                <div className={navbarStyles.menuItemBorder}>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    className={navbarStyles.logoutButton}
                  >
                    <LogOut size={12} />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
