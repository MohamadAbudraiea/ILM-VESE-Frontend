import { useState } from "react";
import { useAuthStore } from "../../store/AuthStore";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";

function StudentLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [id, setID] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { isUserLoggingIn, studentLogin, parentLogin } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (role === "student") {
        let student_id = id;
        await studentLogin({ student_id, password });
        navigate("/student-dashboard");
      } else {
        let parent_id = id;
        await parentLogin({ parent_id, password });
        navigate("/parent-dashboard");
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
              className="select select-bordered w-full bg-primary text-base-100"
            >
              <option value="student">Student</option>
              <option value="parent">Parent</option>
            </select>
          </div>

          {/* ID */}
          <div>
            <label className="label">
              <span className="label-text text-base-100">{role} ID</span>
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setID(e.target.value)}
              placeholder="Enter ID"
              className="input input-bordered w-full bg-primary text-base-100 placeholder-base-100"
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
                className="input input-bordered w-full bg-primary text-base-100 placeholder-base-100 pr-12"
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
