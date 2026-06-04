import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { signupStyles } from "../assets/dummyStyles";

const Signup = () => {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setErrors({});

      const res = await api.post("/user/signup", {
        name,
        email,
        password,
      });

      const { token, user } = res.data || {};

      if (token && user) {
        login(token, user, rememberMe);
        navigate("/");
      } else {
        setErrors({ api: "Invalid server response." });
      }
    } catch (err: any) {
      console.error("Signup error:", err?.response || err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setErrors({ api: err.response.data.message });
      } else {
        setErrors({ api: err.message || "An unexpected error occurred" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={signupStyles.pageContainer}>
      <div className={signupStyles.cardContainer}>
        {/* Header */}
        <div className={signupStyles.header}>
          <button 
            onClick={() => navigate("/login")}
            className={signupStyles.backButton}
            title="Back to login"
          >
            <ArrowLeft size={20} />
          </button>
          <div className={signupStyles.avatar}>
            <User size={40} />
          </div>
          <h2 className={signupStyles.headerTitle}>Create Account</h2>
          <p className={signupStyles.headerSubtitle}>Start tracking your finances today</p>
        </div>

        {/* Form Container */}
        <div className={signupStyles.formContainer}>
          {errors.api && (
            <div className={signupStyles.apiError}>
              {errors.api}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name field */}
            <div>
              <label className={signupStyles.label}>Full Name</label>
              <div className={signupStyles.inputContainer}>
                <span className={signupStyles.inputIcon}>
                  <User size={18} />
                </span>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`${signupStyles.input} ${errors.name ? "border-red-500 focus:ring-red-200" : "border-zinc-200"}`}
                />
              </div>
              {errors.name && (
                <p className={signupStyles.fieldError}>{errors.name}</p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label className={signupStyles.label}>Email Address</label>
              <div className={signupStyles.inputContainer}>
                <span className={signupStyles.inputIcon}>
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${signupStyles.input} ${errors.email ? "border-red-500 focus:ring-red-200" : "border-zinc-200"}`}
                />
              </div>
              {errors.email && (
                <p className={signupStyles.fieldError}>{errors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className={signupStyles.label}>Password</label>
              <div className={signupStyles.inputContainer}>
                <span className={signupStyles.inputIcon}>
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${signupStyles.passwordInput} ${errors.password ? "border-red-500 focus:ring-red-200" : "border-zinc-300"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={signupStyles.passwordToggle}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className={signupStyles.fieldError}>{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className={signupStyles.checkboxContainer}>
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={signupStyles.checkbox}
              />
              <label htmlFor="remember-me" className={signupStyles.checkboxLabel}>
                Remember me on this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`${signupStyles.button} ${isLoading ? signupStyles.buttonDisabled : ""}`}
            >
              {isLoading ? (
                <>
                  <svg className={signupStyles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className={signupStyles.signInContainer}>
            <span className={signupStyles.signInText}>Already have an account? </span>
            <Link to="/login" className={signupStyles.signInLink}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
