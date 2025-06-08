import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

const useParentsStore = create((set) => ({
  students: [],
  courses: [],
  grades: [],
  absence: [],
  reports: [],
  course: [],
  assignments: [],
  quizzes: [],
  unitDetails: null,
  unitContent: null,
  count: 0,
  dates: [],
  loading: false,
  error: null,

  fetchStudents: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/parent/students");
      set({ students: response.data.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load students",
        loading: false,
      });
    }
  },

  getCoursesForStudent: async (studentId) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(`/parent/courses/${studentId}`);
      set({
        courses: response.data.data, // assuming response structure
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch courses",
        loading: false,
      });
    }
  },

  fetchCourseByID: async (course_id) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(`/parent/course/${course_id}`);
      set({ course: response.data.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load course",
        loading: false,
      });
    }
  },

  getAllUnitsInCourse: async (course_id) => {
    try {
      const response = await axiosInstance.get(
        `/parent/course/${course_id}/allunits`
      );

      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to load units" });
      throw error;
    }
  },

  fetchUnitContent: async (course_id, unit_id) => {
    if (!course_id || !unit_id) {
      set({ error: "Course ID or Unit ID is missing", loading: false });
      console.error("Course ID or Unit ID is undefined");
      return;
    }
    try {
      const response = await axiosInstance.get(
        `/parent/course/${course_id}/${unit_id}/content`
      );
      set({ unitContent: response.data.data });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load unit content",
      });
    }
  },

  fetchAssignments: async (course_id, student_id) => {
    try {
      const response = await axiosInstance.get(
        `/parent/coures/${course_id}/assignment/${student_id}`
      );
      set({ assignments: response.data.data });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load assignments",
      });
    }
  },

  fetchShowGrades: async (studentId) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(`/parent/marks/${studentId}`);
      set({
        grades: response.data.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load grades",
        loading: false,
      });
    }
  },

  fetchShowAbsences: async (studentId, sectionId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/parent/absence/${studentId}/${sectionId}`
      );

      set({
        absence: {
          count: response.data.absenceCount,
          dates: response.data.absenceDates,
        },
        loading: false,
      });
    } catch (error) {
      console.error("Absence fetch error:", error);
      set({
        error: error.response?.data?.message || "Failed to load absences",
        loading: false,
        absence: { count: 0, dates: [] }, // Reset on error
      });
    }
  },

  fetchShowReports: async (studentId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/parent/reports/${studentId}`);
      set({
        reports: response.data.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load reports",
        loading: false,
      });
    }
  },

  getQuizzes: async (course_id, student_id) => {
    try {
      const response = await axiosInstance.get(
        `/parent/course/${course_id}/student/${student_id}/quizes/`
      );
      set({ quizzes: response.data.data, loading: false });
      return response.data.data;
    } catch (err) {
      set({ error: err.response.data.message || err.message, loading: false });
    }
  },

  getStudentQuizMark: async (course_id, quiz_id, student_id) => {
    try {
      const response = await axiosInstance.get(
        `/parent/course/${course_id}/quizes/${quiz_id}/${student_id}/mark`
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

  getParentDepartment: async () => {
    try {
      const response = await axiosInstance.get("/parent/departments");
      return response.data.data;
    } catch (error) {
      console.log(
        "error in get departments for the parent: ",
        error.response?.data?.error || error.message
      );
      throw error;
    }
  },

  getAnnoucments: async (department_id) => {
    try {
      const response = await axiosInstance.get(
        `/parent/annoucments/${department_id || "general"}`
      );
      return response.data.data;
    } catch (error) {
      console.log(
        "error in get announcement for the parent: ",
        error.response?.data?.error || error.message
      );
      throw error;
    }
  },

  downloadAssignments: async (filePath, fileName) => {
    try {
      const url = `${
        import.meta.env.VITE_API_URL
      }/parent/download/assignments?path=${encodeURIComponent(
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

  downloadRSubmissions: async (filePath, fileName) => {
    try {
      const url = `${
        import.meta.env.VITE_API_URL
      }/parent/download/submissions?path=${encodeURIComponent(
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
}));

export default useParentsStore;
