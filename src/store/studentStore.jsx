import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

const useStudentStore = create((set) => ({
  courses: [],
  course: [],
  courseContent: [],
  grades: [],
  quizzes: [],
  unitDetails: null,
  unitContent: null,
  loading: false,
  error: null,
  assignments: [],

  fetchCourses: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get("/student/courses");
      set({ courses: response.data.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to load courses",
        loading: false,
      });
    }
  },

  fetchCourseByID: async (courseId) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(`/student/course/${courseId}`);
      set({ course: response.data.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to load course",
        loading: false,
      });
    }
  },

  fetchCourseUnits: async (courseId) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(
        `/student/course/${courseId}/units`
      );
      set({ courseContent: response.data.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to load units",
        loading: false,
      });
    }
  },

  fetchUnitContent: async (courseId, unitId) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(
        `/student/course/${courseId}/${unitId}/content`
      );
      set({
        unitContent: response.data.data,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to load unit",
        loading: false,
      });
    }
  },

  fetchShowGrades: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/student/grades");
      set({ grades: response.data.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to load grades",
        loading: false,
      });
    }
  },

  fetchAssignments: async (courseId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(
        `/student/course/${courseId}/assignments/getassignments`
      );
      set({ assignments: res.data.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  downloadAssignments: async (filePath, fileName) => {
    try {
      const url = `${
        import.meta.env.VITE_API_URL
      }/student/download/submissions?path=${encodeURIComponent(
        filePath
      )}&filename=${encodeURIComponent(fileName)}`;

      // For direct download (better approach)
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(
        "Download error:",
        error.response?.data?.error || error.message
      );
    }
  },

  submitAssignment: async (course_id, assignment_id, formData) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post(
        `/student/course/${course_id}/assignments/${assignment_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({ error: err.response.data.message || err.message, loading: false });
    }
  },

  getQuizzes: async (course_id) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get(
        `/student/course/${course_id}/quizes`
      );
      set({ quizzes: response.data.data, loading: false });
      return response.data.data;
    } catch (err) {
      set({ error: err.response.data.message || err.message, loading: false });
    }
  },

  getQuizToStart: async (course_id, quiz_id) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get(
        `/student/course/${course_id}/quizes/${quiz_id}`
      );
      set({ loading: false });
      return response.data.data;
    } catch (err) {
      set({ error: err.response.data.message || err.message, loading: false });
    }
  },

  submitQuiz: async (course_id, quiz_id, { answers }) => {
    try {
      set({ error: null });
      const response = await axiosInstance.post(
        `/student/course/${course_id}/quizes/${quiz_id}`,
        {
          answers,
        }
      );
      set({ quizzes: response.data.data });
      return response.data.data;
    } catch (err) {
      set({ error: err.response.data.message || err.message });
    }
  },

  getStudentQuizMark: async (course_id, quiz_id) => {
    try {
      const response = await axiosInstance.get(
        `/student/course/${course_id}/quizes/${quiz_id}/mark`
      );
      return response.data.data;
    } catch (error) {
      console.log(
        "Error getting a student asnwers for a quiz: ",
        error.response?.data?.error || error.message
      );
      throw error;
    }
  },

  getStudentDepartment: async () => {
    try {
      const response = await axiosInstance.get("/student/department");
      return response.data.data;
    } catch (error) {
      console.log(
        "error in get departments for the student: ",
        error.response?.data?.error || error.message
      );
      throw error; // Add this to handle errors properly
    }
  },

  getAnnoucments: async (department_id) => {
    try {
      const response = await axiosInstance.get(
        `/student/annoucments/${department_id || "general"}`
      );
      return response.data.data;
    } catch (error) {
      console.log(
        "error in get announcement for the student: ",
        error.response?.data?.error || error.message
      );
      throw error; // Add this to handle errors properly
    }
  },
}));

export default useStudentStore;
