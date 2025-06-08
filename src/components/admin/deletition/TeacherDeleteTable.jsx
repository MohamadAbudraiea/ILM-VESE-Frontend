import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAdminStore } from "../../../store/AdminStore";
import SuccessModal from "../../../components/shared/SuccessModal";
import ErrorModal from "../../../components/shared/ErrorModal";

export default function TeacherDeleteTable({ searchTerm }) {
  const { isFetchingTeachers, getAllTeachers, deleteTeacher } = useAdminStore();

  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);

  const [deletingIds, setDeletingIds] = useState([]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // fetching all the teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await getAllTeachers();
        if (response?.data) {
          setTeachers(response.data);
          setFilteredTeachers(response.data);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
        setErrorMessage("Failed to fetch teachers");
        setShowErrorModal(true);
      }
    };
    fetchTeachers();
  }, [getAllTeachers]);

  // filtering the teachers either by name or id
  useEffect(() => {
    if (searchTerm) {
      const results = teachers.filter(
        (teacher) =>
          `${teacher.first_name} ${teacher.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          teacher.teacher_id.toString().includes(searchTerm)
      );
      setFilteredTeachers(results);
    } else {
      setFilteredTeachers(teachers);
    }
  }, [searchTerm, teachers]);

  // open the confirmation modal
  const handleDeleteClick = (teacher) => {
    setTeacherToDelete(teacher);
    setShowConfirmModal(true);
  };

  // handle deleting teacher
  const confirmDelete = async () => {
    if (!teacherToDelete) return;

    try {
      setShowConfirmModal(false);
      setDeletingIds((prev) => [...prev, teacherToDelete.teacher_id]);

      await deleteTeacher(teacherToDelete.teacher_id);

      setTeachers(
        teachers.filter((t) => t.teacher_id !== teacherToDelete.teacher_id)
      );
      setFilteredTeachers(
        filteredTeachers.filter(
          (t) => t.teacher_id !== teacherToDelete.teacher_id
        )
      );

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error deleting teacher:", error);
      setErrorMessage("Failed to delete teacher");
      setShowErrorModal(true);
    } finally {
      setDeletingIds((prev) =>
        prev.filter((id) => id !== teacherToDelete.teacher_id)
      );
      setTeacherToDelete(null);
    }
  };

  // confirmation modal
  const DeleteConfirmationModal = () => {
    if (!showConfirmModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
          <p className="mb-6">
            Are you sure you want to delete teacher{" "}
            {teacherToDelete &&
              `${teacherToDelete.first_name} ${teacherToDelete.last_name}`}
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="btn btn-error text-white"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isFetchingTeachers) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <>
      <table className="table w-full text-center">
        <thead className="bg-primary text-white">
          <tr>
            <th>ID</th>
            <th>Details</th>
            <th>Confirm Deletion</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <tr key={teacher.teacher_id}>
                <td className="font-medium">{teacher.teacher_id}</td>
                <td>
                  <div className="font-medium">
                    {teacher.first_name} {teacher.last_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {teacher.dept_name}
                  </div>
                </td>
                <td className="text-red-600">
                  Are you sure you want to delete?
                  <div className="text-sm">This action cannot be undone.</div>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteClick(teacher)}
                    className="btn btn-error btn-sm text-white"
                    disabled={deletingIds.includes(teacher.teacher_id)}
                  >
                    {deletingIds.includes(teacher.teacher_id) ? (
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
                No teachers found{searchTerm ? " matching your search" : ""}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <DeleteConfirmationModal />

      <SuccessModal
        successMessage="Teacher deleted successfully."
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
      />
      <ErrorModal
        errorMessage={errorMessage}
        showErrorModal={showErrorModal}
        setShowErrorModal={setShowErrorModal}
      />
    </>
  );
}
