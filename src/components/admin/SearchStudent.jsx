import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Search } from "lucide-react";
import { useAdminStore } from "../../store/AdminStore";
import AdminReportModal from "../admin/adminReportModal";

function SearchStudent() {
  const navigate = useNavigate();

  const { isFetchingStudents, getAllStudents } = useAdminStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  // fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getAllStudents();
        const sortedStudents = response.data.sort(
          (a, b) =>
            a.student_id.split("-")[1] -
            b.student_id.split("-")[1]
        );
        console.log(sortedStudents);
        if (response && response.data) {
          setAllStudents(sortedStudents);
          setFilteredStudents(sortedStudents);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, [getAllStudents]);

  // open add report modal
  const handleAddReportClick = (student) => {
    setSelectedStudent({
      ...student,
      student_name: `${student.first_name} ${student.last_name}`,
    });
    setIsReportModalOpen(true);
  };

  // open view student reports page
  const handleViewReportClick = (student) => {
    navigate(`/admin/view-report/${student.student_id}`, {
      state: {
        student_name: `${student.first_name} ${student.last_name}`,
        student_id: student.student_id,
      },
    });
  };

  // search for a student eiher by his name or his ID
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1);
    if (term.length > 0) {
      const results = allStudents.filter(
        (student) =>
          `${student.first_name} ${student.last_name}`
            .toLowerCase()
            .includes(term.toLowerCase()) ||
          student.student_id.toString().includes(term)
      );
      setFilteredStudents(results);
    } else {
      setFilteredStudents(allStudents);
    }
  };

  // navigate to student absence page
  const handleAbsenceClick = (student) => {
    navigate(
      `/admin-show-absences/${student.student_id}/${student.section_id}`
    );
  };

  // pagination logic
  const studentsPerPage = 5;
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  if (isFetchingStudents) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search by student name or ID"
          className="input input-bordered w-full pl-10"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Search
          className="absolute left-3 top-[0.9rem] text-gray-500"
          size={20}
        />
      </div>

      {/* Search Results Table */}
      {filteredStudents.length > 0 && (
        <div className="bg-base-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Student Search Results</h2>
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="table w-full text-center">
              <thead>
                <tr className="bg-primary text-base-100">
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Department</th>
                  <th>Grade</th>
                  <th>Section</th>
                  <th>Parent ID</th>
                  <th>Absences</th>
                  <th>Action</th>
                  <th>View Reports</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((student) => (
                  <tr key={student.student_id} className="hover">
                    <td>{student.student_id}</td>
                    <td>
                      {student.first_name} {student.last_name}
                    </td>
                    <td>{student.dept_name}</td>
                    <td>{student.grade_name}</td>
                    <td>{student.section_name}</td>
                    <td>{student.parent_id}</td>
                    <td>
                      <button
                        onClick={() => handleAbsenceClick(student)}
                        className="btn btn-secondary btn-sm"
                      >
                        Show absence
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleAddReportClick(student)}
                        className="btn btn-primary btn-sm"
                      >
                        add report
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleViewReportClick(student)}
                        className="btn btn-outline btn-primary btn-sm"
                      >
                        view reports
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => {
                if (currentPage > 1) setCurrentPage((prev) => prev - 1);
              }}
              className="btn btn-sm"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => {
                if (currentPage < totalPages)
                  setCurrentPage((prev) => prev + 1);
              }}
              className="btn btn-sm"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      <AdminReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
}

export default SearchStudent;
