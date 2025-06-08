import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useSharedStore = create((set) => ({
  isFetchingEvents: false,

  getAllEvents: async () => {
    try {
      set({ isFetchingEvents: true });
      const response = await axiosInstance.get("/shared/events/getEvents");
      return response.data;
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      set({ isFetchingEvents: false });
    }
  },
}));
