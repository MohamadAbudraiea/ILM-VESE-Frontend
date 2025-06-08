import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useCourseStore = create((set) => ({
  courses: [],
  teachersBySection: [],
  teachersByDepartment: [],
  studentsInSection: [],
  studentsInCourse: [],
  unitContent: [],
  allReports: [],

  getAllCourses: async () => {
    try {
      const response = await axiosInstance.get("/admin/course");
      set({ courses: response.data.data.filteredCourses });
      return response.data.data.filteredCourses;
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  },

  getStudentsInSection: async (section_id) => {
    try {
      const response = await axiosInstance.get(`/admin/students/${section_id}`);
      set({ studentsInSection: response.data.data });
      return response.data.data;
    } catch (error) {
      console.log(
        "Error fetching students:",
        error.response?.data?.error || error.message
      );
      throw error;
    }
  },

  getStudentsInCourse: async (course_id) => {
    try {
      const response = await axiosInstance.get(
        `/admin/course/getstudents/${course_id}`
      );
      set({ studentsInCourse: response.data.data });
      return response.data.data;
    } catch (error) {
      console.log(
        "Error fetching students:",
        error.response?.data?.error || error.message
      );
      throw error;
    }
  },

  getTeachersByDepartment: async (course_id) => {
    try {
      const response = await axiosInstance.get(
        `/admin/course/getteachersbycourse/${course_id}`
      );
      set({ teachersByDepartment: response.data.data });
      return response.data.data;
    } catch (error) {
      console.log("Error fetching teachers:", error.message);
    }
  },

  getAllReports: async () => {
    try {
      const response = await axiosInstance.get("/admin/course/getreport");
      set({ allReports: response.data.data });
      return response.data.data;
    } catch (error) {
      console.log(
        "Error getting all reports: ",
        error.response?.data?.error || error.message
      );
    }
  },

  involveStudents: async (course_id) => {
    try {
      const response = await axiosInstance.post("/admin/course/involve", {
        course_id,
      });
      return response.data;
    } catch (error) {
      console.log("Error involving students:", error);
    }
  },

  updateTeacher: async (course_id, newTeacher_id) => {
    try {
      const response = await axiosInstance.patch(
        "/admin/course/changeteacher",
        {
          course_id,
          newTeacher_id,
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error updating teacher:", error);
    }
  },

  getCourseUnits: async (course_id) => {
    try {
      const response = await axiosInstance.get(`/admin/course/${course_id}`);
      return response.data.data;
    } catch (error) {
      console.log(
        "Error fetching course units: ",
        error.response?.data?.error || error.message
      );
    }
  },

  deleteUnit: async (course_id, unit_id) => {
    try {
      const response = await axiosInstance.delete(
        `/admin/course/${course_id}/${unit_id}`
      );
      return response.data;
    } catch (error) {
      console.log(
        "Error deleting course unit: ",
        error.response?.data?.error || error.message
      );
    }
  },

  addCourseUnit: async (course_id, { unit_name, unit_description }) => {
    try {
      const response = await axiosInstance.post("/admin/course/addunit", {
        course_id,
        unit_name,
        unit_description,
      });
      return response.data.data;
    } catch (error) {
      console.log(
        "Error in add unit: ",
        error.response?.data?.error || error.message
      );
    }
  },

  getUnitContent: async (unit_id) => {
    try {
      const response = await axiosInstance.get(`admin/course/media/${unit_id}`);
      set({ unitContent: response.data.data });
      return response.data;
    } catch (error) {
      console.log(
        "Error fetching course units: ",
        error.response?.data?.error || error.message
      );
    }
  },

  addUnitContent: async (unit_id, formData) => {
    try {
      const response = await axiosInstance.post(
        `admin/course/${unit_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(
        "Error adding media: ",
        error.response?.data?.error || error.message
      );
      throw error;
    }
  },

  downloadResource: async (filePath, fileName) => {
    try {
      const url = `${
        import.meta.env.VITE_API_URL
      }/shared/download?path=${encodeURIComponent(
        filePath
      )}&filename=${encodeURIComponent(fileName)}`;

      // For direct download (better approach)
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      link.setAttribute("target", "_blank");
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

  deleteUnitContent: async (unit_id, media_id) => {
    try {
      const response = await axiosInstance.delete(
        `admin/course/media/${unit_id}/${media_id}`
      );
      return response.data;
    } catch (error) {
      console.log(
        "Error deleting media from a unit: ",
        error.response?.data?.error || error.message
      );
    }
  },

  getAbsence: async (section_id, date) => {
    try {
      const response = await axiosInstance.get(
        `/admin/absence/${section_id}/${date}`
      );
      return response.data.data;
    } catch (error) {
      console.log(
        "Error updating absence: ",
        error.response?.data?.error || error.message
      );
    }
  },

  updateAbsence: async (students, section_id, date) => {
    try {
      const response = await axiosInstance.post("/admin/absence", {
        students,
        section_id,
        date,
      });
      return response.data;
    } catch (error) {
      console.log(
        "Error updating absence: ",
        error.response?.data?.error || error.message
      );
    }
  },

  getMark: async (course_id, student_id, mark_type) => {
    try {
      const response = await axiosInstance.get(
        `/admin/course/${course_id}/mark/${student_id}/${mark_type}`
      );
      return response.data.data;
    } catch (error) {
      console.log(
        "Error getting mark:",
        error.response?.data?.error || error.message
      );
      throw error;
    }
  },

  addMark: async (course_id, { student_id, mark_type, mark_value }) => {
    try {
      const response = await axiosInstance.post(
        `/admin/course/${course_id}/mark`,
        {
          student_id,
          mark_type,
          mark_value,
        }
      );
      return response.data;
    } catch (error) {
      console.log(
        "Error adding mark:",
        error.response?.data?.error || error.message
      );
      throw error;
    }
  },

  editMark: async (course_id, { student_id, mark_type, mark_value }) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/course/${course_id}/mark`,
        {
          student_id,
          mark_type,
          mark_value,
        }
      );
      return response.data;
    } catch (error) {
      console.log(
        "Error editing mark:",
        error.response?.data?.error || error.message
      );
      throw error;
    }
  },
}));
