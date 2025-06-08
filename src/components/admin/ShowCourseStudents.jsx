import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { useCourseStore } from "../../store/CourseStore";
import StudentMarksModal from "./StudentMarksModal";

function ShowCourseStudents({ courseId, onClose, course }) {
  const { getStudentsInCourse } = useCourseStore();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const response = await getStudentsInCourse(courseId);
        setStudents(response.students || []);
      } catch (err) {
        setError(err.message || "Failed to load students");
        console.log("Error fetching students:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [courseId, getStudentsInCourse]);

  const handleOpenMarksModal = (student) => {
    setSelectedStudent(student);
    setIsMarkModalOpen(true);
  };

  const handleCloseMarksModal = () => {
    setIsMarkModalOpen(false);
    setSelectedStudent(null);
  };

  return (
    <>
      <div className="modal modal-open z-10">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">
            Students Enrolled in This Course
          </h3>

          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : error ? (
            <div className="alert alert-error">
              <AlertCircle className="h-6 w-6" />
              <span>{error}</span>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8">
              <p>No students enrolled in this course yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full text-center">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Student ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.student_id}>
                      <td>
                        {student.first_name} {student.last_name}
                      </td>
                      <td>{student.student_id}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleOpenMarksModal(student)}
                        >
                          View Marks
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="modal-action">
            <button className="btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Student Marks Modal */}
      {isMarkModalOpen && selectedStudent && (
        <StudentMarksModal
          isOpen={isMarkModalOpen}
          onClose={handleCloseMarksModal}
          student={`${selectedStudent.first_name} ${selectedStudent.last_name}`}
          studentId={selectedStudent.student_id}
          course={{ id: courseId, name: course?.course_name || "Course" }}
        />
      )}
    </>
  );
}

export default ShowCourseStudents;
