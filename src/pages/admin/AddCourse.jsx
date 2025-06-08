import { useEffect, useState } from "react";
import AdminNavbar from "../../components/admin/adminNavbar";
import { useAdminStore } from "../../store/AdminStore";
import SuccessModal from "../../components/shared/SuccessModal";
import ErrorModal from "../../components/shared/ErrorModal";

function AddCourse() {
  const {
    getAllGrades,
    allGrades,
    getAllSections,
    allSectionsInGrade,
    getTeacherByDepartment,
    teachersInDepartment,
    addCourse,
  } = useAdminStore();

  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [courseName, setCourseName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // fetch grades on mount
  useEffect(() => {
    const fetchGrades = async () => {
      await getAllGrades();
    };
    fetchGrades();
  }, [getAllGrades]);

  // fetch sections by grade
  const fetchSections = async (grade_id) => {
    await getAllSections(grade_id);
  };

  // fetch teachers by section
  const fetchTeachers = async (grade_id, section_id) => {
    await getTeacherByDepartment(grade_id, section_id);
  };

  const handleGradeChange = (grade) => {
    setSelectedGrade(grade);
    setSelectedSection(null);
    setSelectedTeacher("");
    fetchSections(grade.grade_id);
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    setSelectedTeacher("");
    if (selectedGrade) {
      fetchTeachers(selectedGrade.grade_id, section.section_id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseName || !selectedSection) return;

    setIsSubmitting(true);

    try {
      const result = await addCourse({
        subject_name: courseName,
        section_id: selectedSection.section_id,
        teacher_id: selectedTeacher || null,
      });

      if (result) {
        setCourseName("");
        setSelectedGrade(null);
        setSelectedSection(null);
        setSelectedTeacher("");

        setSuccessMessage("Course created successfully!");
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Error creating course:", error);
      setErrorMessage("Failed to create course");
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add New Course</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          {/* Course Name */}
          <div className="mb-6">
            <label className="block font-medium mb-2">Course Name</label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter course name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </div>

          {/* Grade Selection */}
          <div className="mb-6">
            <label className="block font-medium mb-2">Grade</label>
            <div className="flex flex-wrap gap-2">
              {allGrades.map((grade) => (
                <button
                  key={grade.grade_id}
                  type="button"
                  onClick={() => handleGradeChange(grade)}
                  className={`btn btn-sm ${
                    selectedGrade?.grade_id === grade.grade_id
                      ? "btn-primary"
                      : "btn-ghost"
                  }`}
                >
                  {grade.grade_name}
                </button>
              ))}
            </div>
          </div>

          {/* Section Selection */}
          {selectedGrade && (
            <div className="mb-6">
              <label className="block font-medium mb-2">Section</label>
              <div className="flex flex-wrap gap-2">
                {allSectionsInGrade.map((section) => (
                  <button
                    key={section.section_id}
                    type="button"
                    onClick={() => handleSectionChange(section)}
                    className={`btn btn-sm ${
                      selectedSection?.section_id === section.section_id
                        ? "btn-primary"
                        : "btn-ghost"
                    }`}
                  >
                    {section.section_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Teacher Selection */}
          {selectedSection && (
            <div className="mb-6">
              <label className="block font-medium mb-2">Teacher</label>
              <select
                className="select select-bordered w-full"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                disabled={!teachersInDepartment.length}
              >
                <option value="" disabled>
                  {teachersInDepartment.length
                    ? "Select teacher"
                    : "Loading teachers..."}
                </option>
                {teachersInDepartment.map((teacher) => (
                  <option key={teacher.teacher_id} value={teacher.teacher_id}>
                    {teacher.first_name} {teacher.last_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                isSubmitting ||
                !courseName ||
                !selectedGrade ||
                !selectedSection
              }
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Creating...
                </>
              ) : (
                "Create Course"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success & Error Modals */}
      <SuccessModal
        successMessage={successMessage || "Course created successfully."}
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
      />
      <ErrorModal
        errorMessage={errorMessage}
        showErrorModal={showErrorModal}
        setShowErrorModal={setShowErrorModal}
      />
    </div>
  );
}

export default AddCourse;
