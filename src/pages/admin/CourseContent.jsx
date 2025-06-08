import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/admin/adminNavbar";
import { useCourseStore } from "../../store/CourseStore";
import { useAdminStore } from "../../store/AdminStore";
import ConfirmModal from "../../components/shared/ConfirmModal";
import SuccessModal from "../../components/shared/SuccessModal";
import ErrorModal from "../../components/shared/ErrorModal";
function CourseContent() {
  const navigate = useNavigate();

  const {
    courses,
    getAllCourses,
    getStudentsInCourse,
    involveStudents,
    teachersByDepartment,
    getTeachersByDepartment,
    updateTeacher,
  } = useCourseStore();

  const { deleteCourse } = useAdminStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [studentCounts, setStudentCounts] = useState({});

  // Add these with your existing state declarations
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [actionToConfirm, setActionToConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all courses
  useEffect(() => {
    getAllCourses();
  }, [getAllCourses]);

  // Memoized filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      return searchTerm
        ? course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.teacher_name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
    });
  }, [searchTerm, courses]);

  const coursesPerPage = 5;
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;
    return filteredCourses.slice(startIndex, endIndex);
  }, [filteredCourses, currentPage]);

  // Fetch students in all courses
  const fetchStudentCounts = useCallback(async () => {
    const results = await Promise.all(
      courses.map(async (course) => {
        try {
          const response = await getStudentsInCourse(course.course_id);
          return { id: course.course_id, count: response?.count ?? 0 };
        } catch (error) {
          return {
            id: course.course_id,
            count: error.response?.data?.error ?? "Error",
          };
        }
      })
    );

    const newCounts = results.reduce((acc, { id, count }) => {
      acc[id] = count;
      return acc;
    }, {});
    setStudentCounts(newCounts);
  }, [courses, getStudentsInCourse]);

  useEffect(() => {
    if (courses.length > 0) {
      fetchStudentCounts();
    }
  }, [courses, fetchStudentCounts]);

  const handleInvolveStudents = useCallback(
    async (course_id) => {
      try {
        const response = await involveStudents(course_id);
        if (response.status === "success") {
          setModalMessage(response.message);
          setShowSuccessModal(true);
          const updated = await getStudentsInCourse(course_id);
          setStudentCounts((prev) => ({
            ...prev,
            [course_id]: updated?.count ?? 0,
          }));
        } else {
          setModalMessage(response?.message || "Failed to involve students");
          setShowErrorModal(true);
        }
      } catch (error) {
        setModalMessage(
          error.response?.data?.message || "Error involving students"
        );
        setShowErrorModal(true);
      }
    },
    [involveStudents, getStudentsInCourse]
  );

  // Handle delete course
  const handleDeleteCourse = useCallback(
    (course) => {
      setModalMessage(
        `Are you sure you want to delete the course "${course.course_name}"?`
      );
      setActionToConfirm(() => async () => {
        try {
          await deleteCourse(course.course_id);
          await getAllCourses();
          setModalMessage("Course deleted successfully!");
          setShowSuccessModal(true);
        } catch (error) {
          setModalMessage(
            error.response?.data?.message || "Failed to delete course"
          );
          setShowErrorModal(true);
        }
      });
      setShowConfirmModal(true);
    },
    [deleteCourse, getAllCourses]
  );

  // Handle fetch teachers by department
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await getTeachersByDepartment(
          currentCourse?.course_id
        );
        setSelectedTeacher(
          response.data?.first_name + " " + response.data?.last_name
        );
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    if (currentCourse) {
      fetchTeachers();
    }
  }, [currentCourse, getTeachersByDepartment]);

  const handleChangeTeacher = useCallback(
    async (course) => {
      setCurrentCourse(course);
      setSelectedTeacher({
        teacher_id: course.teacher_id,
        full_name: course.teacher_name,
      });
      await getTeachersByDepartment(course.course_id);
      setShowTeacherModal(true);
    },
    [getTeachersByDepartment]
  );

  const handleSaveTeacher = useCallback(
    async (course_id, newTeacher_id) => {
      if (!newTeacher_id) {
        setModalMessage("Please select a teacher.");
        setShowErrorModal(true);
        return;
      }

      try {
        await updateTeacher(course_id, newTeacher_id);
        await getAllCourses();
        setModalMessage("Teacher changed successfully!");
        setShowSuccessModal(true);
        setShowTeacherModal(false);
        setCurrentCourse(null);
        setSelectedTeacher(null);
      } catch (error) {
        setModalMessage(
          error.response?.data?.message || "Failed to update teacher"
        );
        setShowErrorModal(true);
      }
    },
    [updateTeacher, getAllCourses]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Course Management
          </h1>
          <p className="text-gray-600">Manage all courses and their content</p>
        </div>

        {/* Search Bar */}
        <div className="bg-base-100 p-4 rounded-lg shadow mb-6">
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Search Courses</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Search by name or teacher..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setSearchTerm("")}
              className="btn btn-ghost btn-sm"
            >
              Clear Search
            </button>
          </div>
        </div>

        {/* Courses List */}
        <div className="space-y-4">
          {paginatedCourses.length > 0 ? (
            paginatedCourses.map((course) => (
              <div
                key={course.course_id}
                className="p-4 bg-base-100 rounded-lg shadow hover:shadow-md transition-shadow relative"
              >
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      {course.course_name}
                      <button
                        onClick={() => handleDeleteCourse(course)}
                        className="btn btn-error btn-xs absolute right-3 top-3"
                        title="Delete course"
                      >
                        Delete
                      </button>
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="badge badge-primary">
                        {course.grade_name}
                      </span>
                      <span className="badge badge-secondary">
                        {course.section_name}
                      </span>
                    </div>
                    <p className="mt-2">
                      <span className="font-medium">Teacher:</span>{" "}
                      {course.teacher_name}
                    </p>
                    <p>
                      <span className="font-medium">Students:</span>{" "}
                      {studentCounts[course.course_id] ?? "Loading..."}
                    </p>
                  </div>

                  <div className="flex flex-col md:items-center space-y-2 md:space-y-0 md:space-x-2 md:flex-row">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleInvolveStudents(course.course_id)}
                    >
                      Involve Students
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleChangeTeacher(course)}
                    >
                      Change Teacher
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() =>
                        navigate(`/admin-course-overview/${course.course_id}`, {
                          state: { course },
                        })
                      }
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-base-100 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-700">
                No courses found
              </h3>
              <button
                onClick={() => setSearchTerm("")}
                className="btn btn-ghost btn-sm mt-4"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-4">
            <button
              className="btn btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
            <span className="self-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-sm"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Teacher Modal */}
      {showTeacherModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Change Teacher for {currentCourse?.course_name}
            </h3>
            <p className="py-2">
              Current teacher: {currentCourse?.teacher_name}
            </p>
            <p className="py-2">
              Selected: {selectedTeacher?.full_name || "None"}
            </p>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Select New Teacher</span>
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {teachersByDepartment?.map((teacher) => {
                  const fullName = teacher.first_name + " " + teacher.last_name;
                  const isSelected =
                    selectedTeacher?.teacher_id === teacher.teacher_id;
                  return (
                    <div
                      key={teacher.teacher_id}
                      className={`p-2 rounded cursor-pointer ${
                        isSelected
                          ? "bg-primary text-primary-content"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() =>
                        setSelectedTeacher({
                          teacher_id: teacher.teacher_id,
                          full_name: fullName,
                        })
                      }
                    >
                      {fullName}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setShowTeacherModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() =>
                  handleSaveTeacher(
                    currentCourse.course_id,
                    selectedTeacher?.teacher_id
                  )
                }
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Confirmation Modal */}
      <ConfirmModal
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        message={modalMessage}
        onConfirm={actionToConfirm}
        confirmText="Confirm"
        dangerAction={true}
      />

      {/* Success Modal */}
      <SuccessModal
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
        successMessage={modalMessage}
      />

      {/* Error Modal */}
      <ErrorModal
        showErrorModal={showErrorModal}
        setShowErrorModal={setShowErrorModal}
        errorMessage={modalMessage}
      />
    </div>
  );
}

export default CourseContent;
