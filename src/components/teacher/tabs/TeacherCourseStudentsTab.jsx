import { useState } from "react";
import { useParams } from "react-router-dom";
import StudentReportModal from "../ReportModal";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { useTeacherStore } from "../../../store/TeacherStore";
import { useEffect } from "react";
import TeacherStudentMarksModal from "../TeacherStudentMarksModal";

function TeacherCourseStudentsTab() {
  const { course_id } = useParams();
  const { getStudentsInCourse } = useTeacherStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isMarksModalOpen, setIsMarksModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const allStudents = await getStudentsInCourse(course_id);
        const sortedStudents = allStudents?.sort((a, b) =>
          a.first_name.localeCompare(b.first_name)
        );
        setStudents(sortedStudents || []);
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudents([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, [course_id, getStudentsInCourse]);

  // handle report click
  const handleReportClick = (student) => {
    setSelectedStudent(student);
    setIsReportModalOpen(true);
  };

  // handle add mark
  const handleAddMarks = (student) => {
    setSelectedStudent(student);
    setIsMarksModalOpen(true);
  };

  const studentsPerPage = 5;
  const filteredStudents = (students || []).filter((student) =>
    student?.first_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const currentStudents = filteredStudents.slice(
    startIndex,
    startIndex + studentsPerPage
  );

  return (
    <div className="bg-base-100 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-4">Students</h2>

      {/* Search */}
      <div className="w-full flex items-center mb-4">
        <input
          type="text"
          placeholder="Search students..."
          className="input input-secondary w-full pr-12"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : (
        <>
          {/* Students table */}
          {filteredStudents.length > 0 ? (
            <>
              <div className="rounded border border-base-300 overflow-x-auto">
                <table className="table table-zebra w-full text-center">
                  <thead className="bg-base-300">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStudents.map((student, index) => (
                      <tr key={index}>
                        <td>{student.student_id}</td>
                        <td>
                          {student.first_name} {student.last_name}
                        </td>
                        <td>
                          <div className="dropdown dropdown-end">
                            <button tabIndex={0} className="btn btn-sm">
                              <MoreHorizontal size={16} />
                            </button>
                            <ul
                              tabIndex={0}
                              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40"
                            >
                              <li>
                                <button
                                  onClick={() =>
                                    handleReportClick({
                                      id: student.student_id,
                                      name:
                                        student.first_name +
                                        " " +
                                        student.last_name,
                                    })
                                  }
                                >
                                  Report
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() =>
                                    handleAddMarks({
                                      id: student.student_id,
                                      name:
                                        student.first_name +
                                        " " +
                                        student.last_name,
                                    })
                                  }
                                >
                                  Add marks
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <p>
                  Page {currentPage} of {totalPages}
                </p>

                <button
                  className="btn btn-sm btn-primary"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            // Show simple message when no students
            <div className="flex justify-center items-center h-40">
              <p className="text-lg">
                {searchTerm
                  ? "No students match your search"
                  : "No students found in this course"}
              </p>
            </div>
          )}

          {isReportModalOpen && (
            <StudentReportModal
              isOpen={isReportModalOpen}
              onClose={() => setIsReportModalOpen(false)}
              student={selectedStudent}
            />
          )}

          {isMarksModalOpen && (
            <TeacherStudentMarksModal
              isOpen={isMarksModalOpen}
              onClose={() => setIsMarksModalOpen(false)}
              student={selectedStudent}
            />
          )}
        </>
      )}
    </div>
  );
}

export default TeacherCourseStudentsTab;
