import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import LoginSuccess from "./LoginSuccess";
import RegisterSuccess from "./RegisterSuccess";
import PasswordChangedSuccess from "./PasswordChangedSuccess";
import PasswordChangePage from "./PasswordChangePage";
import VerifyEmail from "./verifyEmail";
import Profile from "./Profile";
import VerifyOTP from "./VerifyOTP";

function AuthPage() {
  const navigate = useNavigate();

  const [view, setView] = useState<"login" | "register" | "forgot">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");

  const [errors, setErrors] = useState<any>({});

  const changeView = (newView: "login" | "register" | "forgot") => {
    setView(newView);
    setErrors({});
    setEmail("");
    setPassword("");
    setFullName("");
    setConfirmPassword("");
    setMobile("");
  };

  const validate = () => {
    let newErrors: any = {};

    if (!email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Invalid email";

    if (view !== "forgot") {
      if (!password) newErrors.password = "Password required";
      else if (password.length < 6)
        newErrors.password = "Min 6 characters";
    }

    if (view === "register") {
      if (!fullName.trim()) {
        newErrors.fullName = "Full name is required";
      }

      if (password !== confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";

      if (!mobile) {
        newErrors.mobile = "Mobile number is required";
      } else if (!/^[0-9]{10}$/.test(mobile)) {
        newErrors.mobile = "Enter valid 10-digit mobile number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (view === "register") {
        const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            mobile,
            fullName
          }),
        });

        const data = await res.json();


        if (res.status === 200 && data.status === true) {
          navigate("/register-success");
        } else {
          // ❌ Show backend message
          alert(data.message);
        }
      }

      if (view === "login") {
        const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password
          }),
        });

        const data = await res.json();
        if (res.status === 200 && data.status === true) {
          if (data.access_token) {
            localStorage.setItem("access_token", data.access_token)
          }
          navigate("/profile");
        } else {
          // ❌ Show backend message
          alert(data.message);
        }
      }

      if (view === "forgot") {
        const res = await fetch(import.meta.env.VITE_BACKENDURL + "/api/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email
          }),
        });

        const data = await res.json();


        if (res.status === 200 && data.status === true) {
          // navigate("/register-success");
        } else {
          // ❌ Show backend message
          alert(data.message);
        }
      }
    } catch (err: any) {
      alert(err.message); // you can improve UI later
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>
          {view === "login" && "Welcome Back"}
          {view === "register" && "Create Account"}
          {view === "forgot" && "Forgot Password"}
        </h2>

        {view !== "forgot" && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </>
        )}

        {view === "login" && (
          <>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </>
        )}

        {view === "register" && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {errors.fullName && <p className="error">{errors.fullName}</p>}

            <input
              type="text"
              placeholder="Mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            {errors.mobile && <p className="error">{errors.mobile}</p>}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="error">{errors.password}</p>}

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword}</p>
            )}
          </>
        )}

        {view === "forgot" && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        )}

        <button className="primary" onClick={handleSubmit}>
          {view === "login" && "Login"}
          {view === "register" && "Register"}
          {view === "forgot" && "Send Reset Link"}
        </button>

        <div className="links">
          {view === "login" && (
            <>
              <span onClick={() => changeView("forgot")}>
                Forgot Password?
              </span>
              <span onClick={() => changeView("register")}>
                Create Account
              </span>
            </>
          )}

          {view === "register" && (
            <span onClick={() => changeView("login")}>
              Already have an account? Login
            </span>
          )}

          {view === "forgot" && (
            <span onClick={() => changeView("login")}>
              Back to Login
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/login-success" element={<LoginSuccess />} />
      <Route path="/register-success" element={<RegisterSuccess />} />
      <Route path="/password-changed" element={<PasswordChangedSuccess />} />
      <Route path="/password-change" element={<PasswordChangePage />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/verify" element={<VerifyOTP />} />
    </Routes>
  );
}