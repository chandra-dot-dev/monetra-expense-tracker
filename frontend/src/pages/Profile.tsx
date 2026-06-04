import React, { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User as UserIcon, Mail, Calendar, Key, X, Eye, EyeOff } from "lucide-react";
import api from "../utils/api";
import { useAuth, UserProfile } from "../context/AuthContext";
import { profileStyles } from "../assets/dummyStyles";

if (typeof window !== "undefined" && document.getElementById("root")) {
  Modal.setAppElement("#root");
}

interface PasswordInputProps {
  name: string;
  label: string;
  value: string;
  error?: string;
  showField: boolean;
  onToggle: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

const PasswordInput = memo(({ name, label, value, error, showField, onToggle, onChange, disabled }: PasswordInputProps) => (
  <div>
    <label className={profileStyles.passwordLabel}>
      {label}
    </label>
    <div className={profileStyles.passwordContainer}>
      <input
        type={showField ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className={`${profileStyles.inputWithError} ${
          error ? "border-red-300" : "border-zinc-200 dark:border-zinc-700 dark:border-zinc-700"
        }`}
        placeholder={`Enter ${label.toLowerCase()}`}
        disabled={disabled}
        key={`password-input-${name}`}
      />
      <button
        type="button"
        onClick={onToggle}
        className={profileStyles.passwordToggle}
        disabled={disabled}
      >
        {showField ? <EyeOff className="w-5 h-5 text-zinc-400 dark:text-zinc-500" /> : <Eye className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />}
      </button>
    </div>
    {error && (
      <p className={profileStyles.errorText}>{error}</p>
    )}
  </div>
));

PasswordInput.displayName = "PasswordInput";

const ProfilePage = () => {
  const { user: authUser, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState({ 
    name: "", 
    email: "",
    createdAt: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState({ name: "", email: "" });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Sync profile details with initial state
  useEffect(() => {
    if (authUser) {
      setUser({
        name: authUser.name || "",
        email: authUser.email || "",
        createdAt: authUser.createdAt || ""
      });
      setTempUser({
        name: authUser.name || "",
        email: authUser.email || ""
      });
    }
  }, [authUser]);

  // Fetch full details from database on mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await api.get("/user/profile");
        if (res.data?.success || res.data?.data) {
          const profile = res.data.data || res.data.user;
          setUser({
            name: profile.name || "",
            email: profile.email || "",
            createdAt: profile.createdAt || ""
          });
          setTempUser({
            name: profile.name || "",
            email: profile.email || ""
          });
        }
      } catch (err) {
        console.error("Fetch profile details error:", err);
      }
    };
    fetchUserDetails();
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempUser(prev => ({ ...prev, [name]: value }));
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setPasswordErrors(prev => ({ ...prev, [name]: "" }));
  }, []);

  const togglePasswordVisibility = useCallback((field: "current" | "new" | "confirm") => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const validatePassword = useCallback(() => {
    const errors: Record<string, string> = {};
    if (!passwordData.current) errors.current = "Current password is required";
    if (!passwordData.new) {
      errors.new = "New password is required";
    } else if (passwordData.new.length < 6) {
      errors.new = "Password must be at least 6 characters";
    }
    if (passwordData.new !== passwordData.confirm) {
      errors.confirm = "Passwords do not match";
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  }, [passwordData]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUser.name.trim() || !tempUser.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.put("/user/profile/update", tempUser);

      if (res.data?.success || res.data?.user) {
        const updated = res.data.user || res.data.data;
        setUser(prev => ({
          ...prev,
          name: updated.name,
          email: updated.email
        }));
        updateUser(updated);
        setEditMode(false);
        toast.success("Profile updated successfully!");
      }
    } catch (err: any) {
      console.error("Update profile error:", err);
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;

    try {
      setLoading(true);
      const res = await api.put("/user/profile/update-password", {
        currentPassword: passwordData.current,
        newPassword: passwordData.new
      });

      if (res.data?.success) {
        toast.success("Password updated successfully!");
        closePasswordModal();
      }
    } catch (err: any) {
      console.error("Update password error:", err);
      toast.error(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData({ current: "", new: "", confirm: "" });
    setShowPassword({ current: false, new: false, confirm: false });
    setPasswordErrors({});
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={profileStyles.container}>
      <div className={profileStyles.mainContainer}>
        {/* Banner header */}
        <div className={profileStyles.header}>
          <div className={profileStyles.avatar}>
            <span className="text-white font-bold text-3xl">
              {getInitials(user.name)}
            </span>
          </div>
          <h2 className={profileStyles.userName}>{user.name || "User Profile"}</h2>
          <p className={profileStyles.userEmail}>{user.email}</p>
        </div>

        {/* Content panel */}
        <div className={profileStyles.content}>
          <div className={profileStyles.grid}>
            {/* Account Details Card */}
            <div className={profileStyles.card}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={profileStyles.cardTitle}>
                  <UserIcon className={profileStyles.icon} /> Profile Details
                </h3>
                {!editMode && (
                  <button 
                    onClick={() => setEditMode(true)}
                    className={`${profileStyles.editButton} cursor-pointer`}
                  >
                    Edit
                  </button>
                )}
              </div>

              {editMode ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label className={profileStyles.label}>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={tempUser.name}
                      onChange={handleInputChange}
                      className={profileStyles.input}
                      required
                    />
                  </div>
                  <div>
                    <label className={profileStyles.label}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={tempUser.email}
                      onChange={handleInputChange}
                      className={profileStyles.input}
                      required
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`${profileStyles.buttonPrimary} cursor-pointer`}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTempUser({ name: user.name, email: user.email });
                        setEditMode(false);
                      }}
                      className={`${profileStyles.buttonSecondary} cursor-pointer`}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <span className={profileStyles.label}>Full Name</span>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200 dark:text-zinc-200 text-lg">{user.name || "N/A"}</p>
                  </div>
                  <div>
                    <span className={profileStyles.label}>Email Address</span>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200 dark:text-zinc-200 text-lg">{user.email || "N/A"}</p>
                  </div>
                  {user.createdAt && (
                    <div>
                      <span className={profileStyles.label}>
                        <Calendar className="inline w-4 h-4 mr-1 text-zinc-400 dark:text-zinc-500" /> Joined On
                      </span>
                      <p className="font-semibold text-zinc-800 dark:text-zinc-200 dark:text-zinc-200">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Account Settings / Security Card */}
            <div className={profileStyles.card}>
              <h3 className={profileStyles.cardTitle}>
                <Key className={profileStyles.icon} /> Security & Account
              </h3>
              
              <div className="space-y-4 mt-4">
                <div className={profileStyles.securityItem}>
                  <div>
                    <p className="font-medium text-zinc-700 dark:text-zinc-300 dark:text-zinc-300">Account Password</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 dark:text-zinc-550 mt-1">Change your password regularly to secure your budget data.</p>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className={`${profileStyles.changeButton} cursor-pointer`}
                  >
                    Change
                  </button>
                </div>

                <div className={profileStyles.securityItem}>
                  <div>
                    <p className="font-medium text-zinc-700 dark:text-zinc-300 dark:text-zinc-300">Log Out</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 dark:text-zinc-550 mt-1">Sign out of your active session on this device.</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 font-medium text-sm cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onRequestClose={closePasswordModal}
        contentLabel="Change Password"
        className="modal"
        overlayClassName="modal-overlay"
        shouldCloseOnOverlayClick={!loading}
        shouldCloseOnEsc={!loading}
      >
        <div className={profileStyles.modalContent}>
          <div className={profileStyles.modalHeader}>
            <h3 className={profileStyles.modalTitle}>Change Password</h3>
            <button 
              onClick={closePasswordModal}
              className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:text-zinc-200 disabled:opacity-50 cursor-pointer"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4 lg:-mx-20">
            <PasswordInput
              name="current"
              label="Current Password"
              value={passwordData.current}
              error={passwordErrors.current}
              showField={showPassword.current}
              onToggle={() => togglePasswordVisibility("current")}
              onChange={handlePasswordChange}
              disabled={loading}
            />
            
            <PasswordInput
              name="new"
              label="New Password"
              value={passwordData.new}
              error={passwordErrors.new}
              showField={showPassword.new}
              onToggle={() => togglePasswordVisibility("new")}
              onChange={handlePasswordChange}
              disabled={loading}
            />
            
            <PasswordInput
              name="confirm"
              label="Confirm New Password"
              value={passwordData.confirm}
              error={passwordErrors.confirm}
              showField={showPassword.confirm}
              onToggle={() => togglePasswordVisibility("confirm")}
              onChange={handlePasswordChange}
              disabled={loading}
            />
            
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className={`${profileStyles.buttonPrimary} cursor-pointer`}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
              <button
                type="button"
                onClick={closePasswordModal}
                className={`${profileStyles.buttonSecondary} cursor-pointer`}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
export { PasswordInput };
