import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useAdminStore = create((set) => ({
  allGrades: [],
  allSectionsInGrade: [],
  teachersInDepartment: [],

  isFetchingStudents: false,
  isFetchingTeachers: false,
  isFetchingParents: false,
  isFetchingAdmins: false,

  isChangingPassword: false,

  // add admin
  addAdmin: async (admin) => {
    try {
      const formattedAdmin = {
        first_name: admin.firstName,
        last_name: admin.lastName,
        email: admin.email,
        password: admin.password,
      };

      const response = await axiosInstance.post(
        "admin/addition/admin",
        formattedAdmin
      );
      return response.data;
    } catch (error) {
      console.log("Error adding admin:", error);
    }
  },

  // add student
  addStudent: async (student) => {
    try {
      const formattedStudent = {
        first_name: student.firstName,
        last_name: student.lastName,
        parent_id: student.parent_id,
        grade_id: student.grade_id,
        section_id: student.section_id,
        password: student.password,
      };

      const response = await axiosInstance.post(
        "admin/addition/student",
        formattedStudent
      );
      return response.data;
    } catch (error) {
      console.log("error adding student:", error.message);
    }
  },

  // add parent
  addParent: async (parent) => {
    try {
      const formattedParent = {
        first_name: parent.firstName,
        last_name: parent.lastName,
        phone: parent.phone,
        password: parent.password,
      };

      const response = await axiosInstance.post(
        "admin/addition/parent",
        formattedParent
      );
      return response.data;
    } catch (error) {
      console.log("Error adding parent:", error);
    }
  },

  // add teacher
  addTeacher: async (teacher) => {
    try {
      const formattedTeacher = {
        first_name: teacher.firstName,
        last_name: teacher.lastName,
        email: teacher.email,
        password: teacher.password,
        section_id: teacher.section_id,
        dept_id: teacher.dept_id,
      };

      const response = await axiosInstance.post(
        "admin/addition/teacher",
        formattedTeacher
      );
      return response.data;
    } catch (error) {
      console.log("Error adding teacher:", error);
    }
  },

  // add event
  addEvent: async (formData) => {
    try {
      const response = await axiosInstance.post("/admin/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error adding event:", error);
    }
  },

  // add report
  addReport: async (student_id, title, description, date) => {
    try {
      if (title.length > 0) {
        const response = await axiosInstance.post(
          `admin/course/${student_id}/addreport`,
          {
            student_id,
            title,
            description,
            date,
          }
        );
        return response.data;
      } else {
        const response = await axiosInstance.post(
          `admin/course/${student_id}/addreport`,
          {
            student_id,
            description,
            date,
          }
        );
        return response.data;
      }
    } catch (error) {
      console.log(
        "Error adding report from admin: ",
        error.response?.data?.error || error.message
      );
    }
  },
  // add course
  addCourse: async ({ subject_name, section_id, teacher_id }) => {
    try {
      const response = await axiosInstance.post("/admin/addition/course", {
        subject_name,
        section_id,
        teacher_id,
      });
      return response.data.data;
    } catch (error) {
      console.log(
        "Error adding course: ",
        error.response?.data?.error || error.message
      );
    }
  },

  // add anouncements
  addAnnoucments: async (department_id, content) => {
    try {
      const response = await axiosInstance.post(
        "/admin/annoucments/sendannoucment",
        {
          department_id,
          content,
        }
      );
      console.log(response.data.newAnnouncment);
      return response.data.newAnnouncment;
    } catch (error) {
      console.log(
        "error in get announcement: ",
        error.response.data.error || error.message
      );
    }
  },

  getStudentAbsences: async (student_id, section_id) => {
    try {
      const response = await axiosInstance.get(
        `/admin/absence/check/${student_id}/${section_id}`
      );
      return response.data;
    } catch (error) {
      console.error("Absence fetch error:", error);
      set({
        error: error.response?.data?.message || "Failed to load absences",

        absence: { count: 0, dates: [] }, // Reset on error
      });
    }
  },

  // get all admins
  getAllAdmins: async () => {
    try {
      set({ isFetchingAdmins: true });
      const response = await axiosInstance.get("/admin/getAdmins");
      return response.data;
    } catch (error) {
      console.log("error fetching parents:", error.message);
    } finally {
      set({ isFetchingAdmins: false });
    }
  },

  // get all students
  getAllStudents: async () => {
    try {
      set({ isFetchingStudents: true });
      const response = await axiosInstance.get("/admin/getStudents");
      return response.data;
    } catch (error) {
      console.log("error fetching students:", error.message);
    } finally {
      set({ isFetchingStudents: false });
    }
  },

  // get all reports
  getAllReports: async (student_id) => {
    try {
      const response = await axiosInstance.get(
        `/admin/course/getreports/${student_id}`
      );
      return response.data;
    } catch (error) {
      console.log(
        "Error fetching reports from admin: ",
        error.response?.data?.error || error.message
      );
    }
  },

  // get all parents
  getAllParents: async () => {
    try {
      set({ isFetchingParents: true });
      const response = await axiosInstance.get("/admin/getParents");
      return response.data;
    } catch (error) {
      console.log("error fetching parents:", error.message);
    } finally {
      set({ isFetchingParents: false });
    }
  },

  fetchShowReports: async (studentId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/admin/reports/${studentId}`);
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

  // get all teachers
  getAllTeachers: async () => {
    try {
      set({ isFetchingTeachers: true });
      const response = await axiosInstance.get("/admin/getTeachers");
      return response.data;
    } catch (error) {
      console.log(
        "error fetching Teachers:",
        error.response.data.error || error.message
      );
    } finally {
      set({ isFetchingTeachers: false });
    }
  },

  // get all departments
  getAllDepartments: async () => {
    try {
      const response = await axiosInstance.get("/admin/depts");
      return response.data;
    } catch (error) {
      console.log("error fetching depts:", error.message);
    }
  },

  // get all grades
  getAllGrades: async () => {
    try {
      const response = await axiosInstance.get("/admin/addition/course/grades");
      set({ allGrades: response.data.data });
      return response.data;
    } catch (error) {
      console.log("error fetching grades:", error.message);
    }
  },

  // get all grades
  getGradesInDepartment: async (dept_id) => {
    try {
      const response = await axiosInstance.get(`/admin/${dept_id}/grades`);
      set({ allGrades: response.data.data });
      return response.data;
    } catch (error) {
      console.log("error fetching grades:", error.message);
    }
  },

  // get all sections
  getAllSections: async (grad_id) => {
    try {
      const response = await axiosInstance.get(
        `/admin/addition/course/grades/${grad_id}`
      );
      set({ allSectionsInGrade: response.data.data });
      return response.data;
    } catch (error) {
      console.log("error fetching sections:", error.message);
    }
  },

  getTeacherByDepartment: async (grade_id, section_id) => {
    try {
      const response = await axiosInstance.get(
        `/admin/addition/course/grades/${grade_id}/${section_id}`
      );
      set({ teachersInDepartment: response.data.data });
      return response.data;
    } catch (error) {
      console.log(
        "error fetching teachers by department:",
        error.response.data.error || error.message
      );
    }
  },

  // get announcement
  getAnnoucments: async (department_id) => {
    try {
      const response = await axiosInstance.get(
        `/admin/annoucments/${department_id}`
      );
      return response.data.data;
    } catch (error) {
      console.log(
        "error in get announcement: ",
        error.response.data.error || error.message
      );
    }
  },

  // delete student
  deleteStudent: async (student_id) => {
    try {
      const response = await axiosInstance.delete(
        `/admin/delete/student/${student_id}`
      );
      return response.data;
    } catch (error) {
      console.log("Error deleting student:", error);
    }
  },

  // delete parent
  deleteParent: async (parentId) => {
    try {
      const response = await axiosInstance.delete(
        `/admin/delete/parent/${parentId}`
      );
      return response.data;
    } catch (error) {
      console.log(
        "Error deleting parent:",
        error.response?.data?.error || error.message
      );
    }
  },

  // delete teacher
  deleteTeacher: async (teacherId) => {
    try {
      const response = await axiosInstance.delete(
        `/admin/delete/teacher/${teacherId}`
      );
      return response.data;
    } catch (error) {
      console.log("Error deleting teacher:", error);
    }
  },

  // delete admin
  deleteAdmin: async (AdminId) => {
    try {
      const response = await axiosInstance.delete(
        `/admin/delete/admin/${AdminId}`
      );
      return response.data;
    } catch (error) {
      console.log("Error deleting teacher:", error);
    }
  },
  // delete event
  deleteEvent: async (event_id) => {
    try {
      console.log("Deleting event with ID:", event_id);
      await axiosInstance.delete(`/admin/events/${event_id}`, {
        data: { event_id },
      });
    } catch (error) {
      console.log("Error deleting event:", error);
    }
  },

  // delete announcement
  deleteAnnouncement: async (annoucment_id) => {
    try {
      await axiosInstance.delete(`/admin/annoucments/${annoucment_id}`);
    } catch (error) {
      console.log(
        "Error deleting annoucment: ",
        error.response.data.error || error.message
      );
    }
  },

  // delete report
  deleteReport: async (report_id) => {
    try {
      await axiosInstance.delete("/admin/reports/delete/", {
        data: { report_id },
      });
    } catch (error) {
      console.log(
        "Error deleting report: ",
        error.response.data.error || error.message
      );
    }
  },

  // change user password
  changeUserPassword: async ({ userType, identifier, newPassword }) => {
    try {
      const response = await axiosInstance.patch("/admin/update/password", {
        userType,
        identifier,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.log(
        "Error changing password:",
        error.response?.data?.error || error.message
      );
      throw error;
    }
  },

  //change Admin password
  changeAdminPassword: async (oldPassword, newPassword) => {
    try {
      set({ isChangingPassword: true });
      const response = await axiosInstance.patch("/admin/settings/password", {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.log(
        "Error changing password:",
        error.response?.data?.error || error.message
      );
      throw error;
    } finally {
      set({ isChangingPassword: false });
    }
  },

  //change Admin name
  changeAdminName: async (firstName, lastName, oldPassword) => {
    try {
      const response = await axiosInstance.patch("/admin/settings/changename", {
        first_name: firstName,
        last_name: lastName,
        oldPassword,
      });
      return response.data;
    } catch (error) {
      console.log(
        "Error changing name:",
        error.response?.data?.error || error.message
      );
      throw error;
    }
  },

  // delete course
  deleteCourse: async (course_id) => {
    try {
      set({ isDeletingCourse: true });
      const response = await axiosInstance.delete(`/admin/course/${course_id}`);
      return response.data;
    } catch (error) {
      console.log(
        "Error deleting course:",
        error.response?.data?.error || error.message
      );
      throw error;
    } finally {
      set({ isDeletingCourse: false });
    }
  },
}));
