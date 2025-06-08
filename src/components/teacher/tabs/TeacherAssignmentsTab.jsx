import { useNavigate, useParams } from "react-router-dom";
import { Calendar, FileText, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useTeacherStore } from "../../../store/TeacherStore";
import SuccessModal from "../../shared/SuccessModal";
import ErrorModal from "../../shared/ErrorModal";
import ConfirmModal from "../../shared/ConfirmModal";

export default function TeacherAssignmentsTab() {
  const {
    assignments,
    TeacherGetAssignment,
    TeacherAddAssignment,
    TeacherDelteAssignment,
    downloadAssignments,
  } = useTeacherStore();

  const { course_id } = useParams();
  const navigate = useNavigate();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);

  // Fetch assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true);
      try {
        await TeacherGetAssignment(course_id);
      } catch (error) {
        setModalMessage(
          error.response.data.error || "Failed to load assignments."
        );
        setShowErrorModal(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, [course_id, TeacherGetAssignment]);

  // Open confirm delete modal
  const confirmDeleteAssignment = (assignment_id) => {
    setAssignmentToDelete(assignment_id);
    setModalMessage("Are you sure you want to delete this assignment?");
    setShowConfirmModal(true);
  };

  // Handle delete assignment
  const handleDeleteAssignment = async () => {
    try {
      setIsLoading(true);
      await TeacherDelteAssignment(course_id, assignmentToDelete);
      await TeacherGetAssignment(course_id);
      setModalMessage("Assignment deleted successfully");
      setShowSuccessModal(true);
    } catch (error) {
      setModalMessage(
        error.response?.data?.error || "Failed to delete assignment"
      );
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
      setAssignmentToDelete(null);
      setShowConfirmModal(false);
    }
  };

  // Open add new assignment modal
  const handleAddAssignment = () => {
    setShowModal(true);
  };

  // Close add new assignment modal
  const handleCloseModal = () => {
    setShowModal(false);
    setNewAssignment({ title: "", description: "", dueDate: "" });
    setSelectedFile(null);
  };

  // Handle input changes for new assignment
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection for new assignment
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // Validate new assignment input
  const validateAssignment = () => {
    if (!newAssignment.title.trim()) {
      setModalMessage("Title is required");
      setShowErrorModal(true);
      return false;
    }
    if (!selectedFile) {
      setModalMessage("File is required");
      setShowErrorModal(true);
      return false;
    }
    return true;
  };

  // Handle save new assignment
  const handleSaveAssignment = async () => {
    if (!validateAssignment()) return;

    const formData = new FormData();
    formData.append("title", newAssignment.title);
    formData.append("description", newAssignment.description);
    formData.append("end_at", newAssignment.dueDate);
    formData.append("media", selectedFile);

    setIsLoading(true);
    try {
      await TeacherAddAssignment(course_id, formData);
      await TeacherGetAssignment(course_id);
      setModalMessage("Assignment added successfully!");
      setShowSuccessModal(true);
      handleCloseModal();
    } catch (error) {
      setModalMessage(
        error.response?.data?.error ||
          "Error saving assignment. Please try again."
      );
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getFileType = (mimeType) => {
    if (mimeType.includes("video")) return "Video";
    if (mimeType.includes("pdf")) return "PDF";
    if (mimeType.includes("word") || mimeType.includes("msword")) return "DOC";
    return mimeType.split("/")[1]?.toUpperCase() || "File";
  };

  // Handle download assignment
  const handleDownload = async (assignment) => {
    try {
      setIsLoading(true);
      await downloadAssignments(
        assignment.path.split("/").pop(),
        `${assignment.title}.${getFileType(assignment.type).toLowerCase()}`
      );
      setModalMessage("Download started successfully!");
      setShowSuccessModal(true);
    } catch (error) {
      setModalMessage(error.response.data.error || "Failed to download file.");
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md">
      {/* Loader */}
      {isLoading && assignments.length === 0 ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : // No assignments available
      assignments.length === 0 ? (
        <div className="text-center space-y-4">
          <p className="text-primary font-bold text-2xl">
            No assignments available.
          </p>
          <button onClick={handleAddAssignment} className="btn btn-primary">
            + Add Assignment
          </button>
        </div>
      ) : (
        // Assignments list
        <div className="grid gap-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-3xl text-primary font-semibold">Assignments</h2>
            <button
              onClick={handleAddAssignment}
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "+ Add Assignment"
              )}
            </button>
          </div>
          {assignments.map((assignment, i) => (
            <div
              key={i}
              className="border border-base-300 p-4 rounded-lg shadow-sm bg-base-100 flex justify-between items-center"
            >
              <div className="space-y-1 cursor-pointer">
                <button
                  onClick={() => handleDownload(assignment)}
                  className="text-lg font-bold flex items-center gap-2 text-primary hover:underline"
                  disabled={isLoading}
                >
                  <FileText className="w-5 h-5" />
                  {assignment.title || `Untitled`}
                </button>
                <p className="text-gray-700">
                  {assignment.description || "No description available."}
                </p>
                <div className="text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Due: {assignment.end_at || "No due date"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    navigate(
                      `/teacher-course-content/${course_id}/assignment-detail`,
                      {
                        state: { assignment },
                      }
                    )
                  }
                  className="btn btn-sm btn-outline btn-primary"
                  disabled={isLoading}
                >
                  Show submission
                </button>
                <button
                  onClick={() => confirmDeleteAssignment(assignment._id)}
                  className="btn btn-sm btn-outline btn-error"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg text-primary font-semibold">
                Add New Assignment
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignment Title:
                </label>
                <input
                  type="text"
                  name="title"
                  value={newAssignment.title}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Enter assignment title"
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description:
                </label>
                <textarea
                  name="description"
                  value={newAssignment.description}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full"
                  placeholder="Enter description"
                  rows="3"
                  disabled={isLoading}
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline:
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={newAssignment.dueDate}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <label className="form-control w-full">
                  <span className="label-text mb-1 font-medium">
                    Upload File
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="file-input file-input-bordered w-full"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    required
                    title="Upload assignment file (PDF, DOC, DOCX) only"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={handleCloseModal}
                className="btn btn-ghost"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssignment}
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        message={modalMessage}
        onConfirm={handleDeleteAssignment}
        onCancel={() => {
          setAssignmentToDelete(null);
          setShowConfirmModal(false);
        }}
      />

      <SuccessModal
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
        successMessage={modalMessage}
      />

      <ErrorModal
        showErrorModal={showErrorModal}
        setShowErrorModal={setShowErrorModal}
        errorMessage={modalMessage}
      />
    </div>
  );
}
