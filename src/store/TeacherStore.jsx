import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useTeacherStore = create((set) => ({
  coursesForTeacher: [],
  studentsInSection: [],
  course: [],
  units: [],
  unitContent: [],
  assignments: [],

  // add report
  addReport: async (course_id, student_id, title, description, date) => {
    try {
      const response = await axiosInstance.post(
        `/teacher/course/${course_id}/addnewreport`,
        {
          course_id,
          student_id,
          title,
          description,
          date,
        }
      );
      return response.data;
    } catch (error) {
      console.log(
        "Error adding report from teacher: ",
        error.response?.data?.error || error.message
      );
    }
  },

  addCourseUnit: async (course_id, { unit_name, unit_description }) => {
    try {
      const response = await axiosInstance.post(
        `/teacher/course/${course_id}/addunit`,
        {
          course_id,
          unit_name,
          unit_description,
        }
      );
      return response.data.data;
    } catch (error) {
      console.log(
        "Error in add unit: ",
        error.response?.data?.error || error.message
      );
    }
  },

  getCoursesForTeacher: async () => {
    try {
      const response = await axiosInstance.get("/teacher/courses/");
      set({ coursesForTeacher: response.data.data });
    } catch (error) {
      console.log(
        "Error fetching courses: ",
        error.response?.data?.error || error.message
      );
    }
  },

  getCourseByID: async (course_id) => {
    try {
      const response = await axiosInstance.get(`/teacher/course/${course_id}`);
      return response.data.data;
    } catch (error) {
      console.log(
        "Error fetching course: ",
        error.response?.data?.error || error.message
      );
    }
  },

  getCourseUnits: async (course_id) => {
    try {
      const response = await axiosInstance.get(
        `/teacher/course/${course_id}/units`
      );
      set({ units: response.data.data });
      return response.data.data;
    } catch (error) {
      console.log(
        "Error fetching course units: ",
        error.response?.data?.error || error.message
      );
    }
  },

  getUnitContent: async (unit_id) => {
    try {
      const response = await axiosInstance.get(
        `teacher/course/media/${unit_id}`
      );
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
        `teacher/course/${unit_id}`,
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

  deleteUnit: async (course_id, unit_id) => {
    try {
      const response = await axiosInstance.delete(
        `/teacher/course/${course_id}/${unit_id}`
      );
      return response.data;
    } catch (error) {
      console.log(
        "Error deleting course unit: ",
        error.response?.data?.error || error.message
      );
    }
  },

  deleteUnitContent: async (unit_id, media_id) => {
    try {
      const response = await axiosInstance.delete(
        `teacher/course/media/${unit_id}/${media_id}`
      );
      return response.data;
    } catch (error) {
      console.log(
        "Error deleting media from a unit: ",
        error.response?.data?.error || error.message
      );
    }
  },

  getStudentsInCourse: async (course_id) => {
    try {
      const response = await axiosInstance.get(
        `/teacher/course/${course_id}/students`
      );
      return response.data.data.students;
    } catch (error) {
      console.log(
        "Error fetching students in course: ",
        error.response?.data?.error || error.message
      );
    }
  },

  TeacherGetAssignment: async (course_id) => {
    try {
      const response = await axiosInstance.get(
        `/teacher/course/${course_id}/assigments`
      );
      set({ assignments: response.data.data });
      return response.data.data;
    } catch (error) {
      console.log(
        "Error fetching assignments: ",
        error.response?.data?.error || error.message
      );
    }
  },

  TeacherAddAssignment: async (course_id, assignmentData) => {
    try {
      const response = await axiosInstance.post(
        `/teacher/course/${course_id}/addassigment`,
        assignmentData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response; // Add this line
    } catch (error) {
      console.log(
        "Error adding assignment: ",
        error.response?.data?.error || error.message
      );
      throw error; // Re-throw the error
    }
  },

  TeacherDelteAssignment: async (course_id, assignment_id) => {
    try {
      const response = await axiosInstance.delete(
        `/teacher/course/${course_id}/assigments/delete-assignment/${assignment_id}`
      );
      return response.data.data;
    } catch (error) {
      console.log(
        "Error deleting assignment: ",
        error.response?.data?.error || error.message
      );
    }
  },

  TeacherShowSubmition: async (course_id, assignment_id) => {
    try {
      const response = await axiosInstance.get(
        `/teacher/course/${course_id}/assigments/${assignment_id}`
      );
      return response.data.data;
    } catch (error) {
      console.log(
        "Error fetching submissions: ",
        error.response?.data?.error || error.message
      );
    }
  },

  TeacherUpdateSubmition: async (
    course_id,
    assignment_id,
    { studentsSubmissions }
  ) => {
    try {
      const response = await axiosInstance.patch(
        `/teacher/course/${course_id}/assigments/update/${assignment_id}`,
        { studentsSubmissions }
      );
      return response.data.data;
    } catch (error) {
      console.log(
        "Error fetching submissions: ",
        error.response?.data?.error || error.message
      );
    }
  },

  downloadAssignments: async (filePath, fileName) => {
    try {
      const url = `${
        import.meta.env.VITE_API_URL
      }/teacher/download/assignments?path=${encodeURIComponent(
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
      }/teacher/download/submissions?path=${encodeURIComponent(
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

  getStudentsInSection: async (section_id) => {
    try {
      const response = await axiosInstance.get(
        `/teacher/students/${section_id}`
      );
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

  getAbsenceForTeacher: async (date) => {
    try {
      const response = await axiosInstance.get(`/teacher/absence/${date}`);
      return response.data.data;
    } catch (error) {
      console.log(
        "Error updating absence: ",
        error.response?.data?.error || error.message
      );
    }
  },

  updateAbsenceForTeacher: async (students, date) => {
    try {
      const response = await axiosInstance.post("/teacher/absence", {
        students,
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

  // Get all quizzes for a course
  getQuizzesForCourse: async (course_id) => {
    try {
      const response = await axiosInstance.get(
        `/teacher/course/${course_id}/allQuizes`
      );
      return response.data.data;
    } catch (error) {
      console.log(
        "Error fetching quizzes: ",
        error.response?.data?.error || error.message
      );
      throw error;
    }
  },

  // Get a single quiz by ID
  getQuizById: async (quiz_id) => {
    try {
      const response = await axiosInstance.get(
        `/teacher/course/quiz/${quiz_id}`
      );
      return response.data.data;
    } catch (error) {
      console.log(
        "Error fetching quiz: ",
        error.response?.data?.error || error.message
      );
      throw error;
    }
  },

  // Add a new quiz
  addQuiz: async (course_id, quizData) => {
    try {
      const questions = quizData.questions.map((question) => ({
        question_text: question.question,
        points: question.points,
        options: question.choices.map((choice, index) => ({
          option_text: choice,
          isCorrectAnswer: index === question.correctAnswerIndex,
        })),
      }));

      const response = await axiosInstance.post(
        `/teacher/course/${course_id}/quiz`,
        {
          title: quizData.quizTitle,
          description: quizData.description,
          start_date: quizData.startDate,
          start_time: quizData.startTime,
          duration: quizData.duration,
          total_points: quizData.totalPoints,
          questions: questions,
        }
      );
      return response.data;
    } catch (error) {
      console.log(
        "Error adding quiz: ",
        error.response?.data?.error || error.message
      );
      throw error;
    }
  },

  // Edit an existing quiz
  editQuiz: async (quiz_id, quizData) => {
    try {
      const questions = quizData.questions.map((question) => ({
        question_text: question.question,
        points: question.points,
        options: question.choices.map((choice, index) => ({
          option_text: choice,
          isCorrectAnswer: index === question.correctAnswerIndex,
        })),
      }));

      const response = await axiosInstance.patch(
        `/teacher/course/quiz/${quiz_id}`,
        {
          title: quizData.quizTitle,
          description: quizData.description,
          start_date: quizData.startDate,
          start_time: quizData.startTime,
          duration: quizData.duration,
          total_points: quizData.totalPoints,
          questions: questions,
        }
      );
      return response.data;
    } catch (error) {
      console.log(
        "Error editing quiz: ",
        error.response?.data?.error || error.message
      );
      throw error;
    }
  },

  // Delete a quiz
  deleteQuiz: async (quiz_id) => {
    try {
      const response = await axiosInstance.delete(
        `/teacher/course/delete/quiz/${quiz_id}`
      );
      return response.data;
    } catch (error) {
      console.log(
        "Error deleting quiz: ",
        error.response?.data?.error || error.message
      );
      throw error;
    }
  },

  getQuizSubmissions: async (course_id, quiz_id) => {
    try {
      const response = await axiosInstance.get(
        `/teacher/course/${course_id}/${quiz_id}/submissions`
      );
      return response.data.data;
    } catch (error) {
      console.log(
        "Error fetching quiz: ",
        error.response?.data?.error || error.message
      );
      throw error;
    }
  },

  // get a student asnwers for a quiz
  getStudentQuizMark: async (course_id, quiz_id, student_id) => {
    try {
      const response = await axiosInstance.get(
        `/teacher/course/${course_id}/${quiz_id}/${student_id}/submit`
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

  publishMarks: async (quiz_id, able_to_view) => {
    try {
      const response = await axiosInstance.patch(
        `/teacher/course/quiz/${quiz_id}/view`,
        { able_to_view }
      );
      return response.data.data;
    } catch (error) {
      console.log(
        "Error publish quiz marks: ",
        error.response?.data?.error || error.message
      );
      throw error;
    }
  },

  getMark: async (course_id, student_id, mark_type) => {
    try {
      const response = await axiosInstance.get(
        `/teacher/course/${course_id}/mark/${student_id}/${mark_type}`
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
        `/teacher/course/${course_id}/mark`,
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

  getTeacherDepartment: async () => {
    try {
      const response = await axiosInstance.get("/teacher/department");
      return response.data.data;
    } catch (error) {
      console.log(
        "error in get departments for the teacher: ",
        error.response?.data?.error || error.message
      );
      throw error; // Add this to handle errors properly
    }
  },

  getAnnoucments: async (department_id) => {
    try {
      const response = await axiosInstance.get(
        `/teacher/annoucments/${department_id || "general"}`
      );
      return response.data.data;
    } catch (error) {
      console.log(
        "error in get announcement for the teacher: ",
        error.response?.data?.error || error.message
      );
      throw error; // Add this to handle errors properly
    }
  },
}));
