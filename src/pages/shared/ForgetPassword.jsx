import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/AuthStore";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();

  const { forgotPassword, verifyOtpAndResetPassword } = useAuthStore();

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (showOtpForm && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown, showOtpForm]);

  // Handle form submmission for sending OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await forgotPassword(email);
      if (response?.status === "success") {
        setSuccess("OTP sent to your email!");
        setShowOtpForm(true);
        setCountdown(60); // Reset countdown
      } else {
        setError(response?.message || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission for resetting password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await verifyOtpAndResetPassword(email, otp, newPassword);

      if (response?.status === "success") {
        setSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/stafflogin"), 2000);
      } else {
        setError(response?.message || "Failed to reset password");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await forgotPassword(email);
      if (response?.status === "success") {
        setSuccess("New OTP sent to your email!");
        setCountdown(60);
      } else {
        setError(response?.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
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
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>{" "}
      <div className="relative z-10 bg-primary text-base-100 rounded-xl shadow-lg p-8 w-full max-w-md border-[3px] border-accent">
        <h1 className="text-3xl font-bold mb-2">Thinking Flares School</h1>
        <h2 className="text-xl font-bold mb-1">
          {showOtpForm ? "Reset Your Password" : "Forgot Password"}
        </h2>

        {!showOtpForm ? (
          <>
            <p className="mb-6">
              Enter your email address to receive a password reset OTP
            </p>

            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Email */}
              <div>
                <label className="label">
                  <span className="label-text text-base-100">
                    Email Address
                  </span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="input input-bordered w-full bg-primary text-base-100 placeholder-base-100 focus:border-base-100"
                  required
                />
              </div>

              {/* Error message */}
              {error && <p className="text-red-500 font-medium">{error}</p>}

              {/* Success message */}
              {success && (
                <p className="text-green-500 font-medium">{success}</p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="btn w-full bg-accent text-base-100 text-2xl font-bold border-none"
              >
                Send OTP
              </button>

              {/* Back to login */}
              <div className="text-center mt-4">
                <Link
                  to="/stafflogin"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </>
        ) : (
          <>
            <p className="mb-6">
              Enter the OTP sent to {email} and your new password
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Email (readonly) */}
              <div>
                <label className="label">
                  <span className="label-text text-base-100">
                    Email Address
                  </span>
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="input input-bordered w-full bg-primary text-base-100 opacity-70"
                />
              </div>

              {/* OTP */}
              <div>
                <label className="label">
                  <span className="label-text text-base-100">OTP Code</span>
                  {countdown > 0 ? (
                    <span className="label-text-alt text-base-100">
                      Expires in: {countdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="label-text-alt text-blue-600 hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="input input-bordered w-full bg-primary text-base-100 placeholder-base-100 focus:border-base-100"
                  required
                  maxLength={6}
                />
              </div>

              {/* New Password */}
              <div>
                <label className="label">
                  <span className="label-text text-base-100">New Password</span>
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="input input-bordered w-full bg-primary text-base-100 placeholder-base-100 focus:border-base-100"
                  required
                  minLength={6}
                />
              </div>

              {/* Error message */}
              {error && <p className="text-red-500 font-medium">{error}</p>}

              {/* Success message */}
              {success && (
                <p className="text-green-500 font-medium">{success}</p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="btn w-full bg-accent text-base-100 text-2xl font-bold border-none"
                disabled={countdown === 0}
              >
                Reset Password
              </button>

              {/* Back to login */}
              <div className="text-center mt-4">
                <Link
                  to="/login"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
