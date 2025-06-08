import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useAuthStore = create((set) => ({
  authAdmin: null,
  authTeacher: null,
  authStudent: null,
  authParent: null,
  isCheckingAuth: false,
  isUserLoggingIn: false,
  isUserLoggingOut: false,

  adminLogin: async (data) => {
    try {
      set({ isUserLoggingIn: true });
      const response = await axiosInstance.post(
        "/shared/login/adminLogin",
        data
      );
      set({ authAdmin: response.data.data });
      return response.data;
    } catch (error) {
      console.log(error.response?.data?.message || "Login failed");
      throw error;
    } finally {
      set({ isUserLoggingIn: false });
    }
  },

  teacherLogin: async (data) => {
    try {
      set({ isUserLoggingIn: true });
      const response = await axiosInstance.post(
        "/shared/login/teacherLogin",
        data
      );
      set({ authTeacher: response.data.data });
      return response.data;
    } catch (error) {
      console.log(error.response?.data?.message || "Login failed");
      throw error;
    } finally {
      set({ isUserLoggingIn: false });
    }
  },

  studentLogin: async (data) => {
    try {
      set({ isUserLoggingIn: true });
      const response = await axiosInstance.post(
        "/shared/login/studentLogin",
        data
      );
      set({ authStudent: response.data.data });
      return response.data;
    } catch (error) {
      console.log(error.response?.data?.message || "Login failed");
      throw error;
    } finally {
      set({ isUserLoggingIn: false });
    }
  },

  parentLogin: async (data) => {
    try {
      set({ isUserLoggingIn: true });
      const response = await axiosInstance.post(
        "/shared/login/parentLogin",
        data
      );
      set({ authParent: response.data.data });
      return response.data;
    } catch (error) {
      console.log(error.response?.data?.message || "Login failed");
      throw error;
    } finally {
      set({ isUserLoggingIn: false });
    }
  },

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await axiosInstance.get("/shared/check");

      if (res.data?.data && res.data?.role) {
        switch (res.data.role) {
          case "admin":
            set({ authAdmin: res.data.data });
            break;
          case "teacher":
            set({ authTeacher: res.data.data });
            break;
          case "student":
            set({ authStudent: res.data.data });
            break;
          case "parent":
            set({ authParent: res.data.data });
            break;
        }
      }
      return res.data;
    } catch (error) {
      console.log("Error in checkAuth:", error.message);
      set({
        authAdmin: null,
        authTeacher: null,
        authStudent: null,
        authParent: null,
      });
      return null;
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    try {
      set({ isUserLoggingOut: true });
      const res = await axiosInstance.post("/shared/logout");
      set({
        authAdmin: null,
        authTeacher: null,
        authStudent: null,
        authParent: null,
      });
      return res.data;
    } catch (error) {
      console.error("Logout Error:", error.response?.data?.message);
      throw error;
    } finally {
      set({ isUserLoggingOut: false });
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post("/shared/forgotpassword", {
        email,
      });
      return response.data;
    } catch (error) {
      console.log(
        "error in forgot pawword: ",
        error.response.data.error || error.message
      );
    }
  },

  verifyOtpAndResetPassword: async (email, otp, newPassword) => {
    try {
      const response = await axiosInstance.patch(
        "/shared/forgotpassword/check",
        {
          email,
          otp_code: otp,
          newPassword,
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data.message || error.response.data.error
        );
      }
      throw error;
    }
  },
}));
