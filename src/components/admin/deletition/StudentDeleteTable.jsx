import { useEffect, useState } from "react";
import { useAdminStore } from "../../../store/AdminStore";
import { Loader2 } from "lucide-react";
import SuccessModal from "../../shared/SuccessModal";
import ErrorModal from "../../shared/ErrorModal";

function StudentDeleteTable({ searchTerm }) {
  const { isFetchingStudents, getAllStudents, deleteStudent } = useAdminStore();

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [deletingIds, setDeletingIds] = useState([]);

  const [studentToDelete, setStudentToDelete] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // fetching all the students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getAllStudents();
        if (response?.data) {
          setStudents(response.data);
          setFilteredStudents(response.data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        setErrorMessage("Failed to fetch students");
        setShowErrorModal(true);
      }
    };
    fetchStudents();
  }, [getAllStudents]);

  // filtering the student either by name or id
  useEffect(() => {
    if (searchTerm) {
      const results = students.filter(
        (student) =>
          `${student.first_name} ${student.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.student_id.toString().includes(searchTerm)
      );
      setFilteredStudents(results);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  // open the confirmation modal
  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowConfirmModal(true);
  };

  // handle deleting student
  const confirmDelete = async () => {
    if (!studentToDelete) return;

    try {
      setShowConfirmModal(false);
      setDeletingIds((prev) => [...prev, studentToDelete.student_id]);

      await deleteStudent(studentToDelete.student_id);

      setStudents(
        students.filter((s) => s.student_id !== studentToDelete.student_id)
      );
      setFilteredStudents(
        filteredStudents.filter(
          (s) => s.student_id !== studentToDelete.student_id
        )
      );

      setSuccessMessage("Student deleted successfully!");
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 2000);
    } catch (error) {
      console.error("Error deleting student:", error);
      setErrorMessage(
        error.response?.data?.error || "Failed to delete student"
      );
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 2000);
    } finally {
      setDeletingIds((prev) =>
        prev.filter((id) => id !== studentToDelete.student_id)
      );
      setStudentToDelete(null);
    }
  };

  // confirmation modal
  const DeleteConfirmationModal = () => {
    if (!showConfirmModal) return null;

    return (
      <dialog
        open={showConfirmModal}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">
            Are you sure you want to delete student{" "}
            {studentToDelete &&
              `${studentToDelete.first_name} ${studentToDelete.last_name}`}
            ? This action cannot be undone.
          </p>
          <div className="modal-action">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="btn btn-error text-base-100"
            >
              Delete
            </button>
          </div>
        </div>

        {/* DaisyUI backdrop click handler */}
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowConfirmModal(false)}>close</button>
        </form>
      </dialog>
    );
  };

  if (isFetchingStudents) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <>
      <table className="table w-full text-center">
        <thead className="bg-primary text-base-100">
          <tr>
            <th>ID</th>
            <th>Details</th>
            <th>Confirm Deletion</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <tr key={student.student_id}>
                <td className="font-medium">{student.student_id}</td>
                <td>
                  <div className="font-medium">
                    {student.first_name} {student.last_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {student.grade_name}
                  </div>
                </td>
                <td className="text-red-600">
                  Are you sure you want to delete?
                  <div className="text-sm">This action cannot be undone.</div>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteClick(student)}
                    className="btn btn-error btn-sm text-base-100"
                    disabled={deletingIds.includes(student.student_id)}
                  >
                    {deletingIds.includes(student.student_id) ? (
                      <Loader2 className="animate-spin h-4 w-4 mx-auto" />
                    ) : (
                      "Delete"
                    )}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center p-8 text-gray-500">
                No students found{searchTerm ? " matching your search" : ""}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <DeleteConfirmationModal />

      <SuccessModal
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
        successMessage={successMessage}
      />

      <ErrorModal
        showErrorModal={showErrorModal}
        setShowErrorModal={setShowErrorModal}
        errorMessage={errorMessage}
      />
    </>
  );
}

export default StudentDeleteTable;
