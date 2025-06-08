import { useState } from "react";
import { useAuthStore } from "../../store/AuthStore";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";

function StudentLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { isUserLoggingIn, adminLogin, teacherLogin } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let response;
      if (role === "admin") {
        response = await adminLogin({ email, password });
      } else {
        response = await teacherLogin({ email, password });
      }

      if (response?.status === "success") {
        navigate(role === "admin" ? "/admin-dashboard" : "/teacher-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  if (isUserLoggingIn) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Blurred background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm scale-105"
        style={{ backgroundImage: "url('/about5.jpg')" }}
      ></div>

      {/* Optional overlay for darker blur */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Login box */}
      <div className="relative z-10 bg-primary text-base-100 rounded-xl shadow-lg p-8 w-full max-w-md border-[3px] border-accent">
        <h1 className="text-3xl font-bold mb-2">Thinking Flares School</h1>
        <h2 className="text-xl font-bold mb-1">
          Welcome to Thinking Flares School
        </h2>
        <p className="mb-2">
          Enter your details to log in as a{" "}
          <span className="font-bold capitalize">{role}</span>
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Role Selector */}
          <div>
            <label className="label">
              <span className="label-text text-base-100">Login as</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="select select-bordered w-full bg-primary text-base-100 focus:border-base-100"
            >
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="label">
              <span className="label-text text-base-100">Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="input input-bordered w-full bg-primary text-base-100 placeholder-base-100 focus:border-base-100"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="label">
              <span className="label-text text-base-100">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="input input-bordered w-full bg-primary text-base-100 placeholder-base-100 pr-12 focus:border-base-100"
                required
              />
              <button
                type="button"
                className="absolute top-3 right-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="text-base-100 w-6 h-6" />
                ) : (
                  <Eye className="text-base-100 w-6 h-6" />
                )}
              </button>
            </div>
            <div className="text-right mt-1">
              <Link
                to="/forgot-password"
                className="text-blue-600 font-medium hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 font-medium">{error}</p>}

          {/* Login button */}
          <button
            type="submit"
            className="btn w-full bg-accent text-base-100 text-2xl font-bold border-none"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentLogin;
