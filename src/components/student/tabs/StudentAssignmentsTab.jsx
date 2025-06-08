import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, Download, Loader2, XCircle } from "lucide-react";
import useStudentStore from "../../../store/studentStore";
import SuccessModal from "../../../components/shared/SuccessModal";
import ErrorModal from "../../../components/shared/ErrorModal";

function StudentAssignmentsTab() {
  const { course_id } = useParams();
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    assignments = [],
    fetchAssignments,
    submitAssignment,
    downloadAssignments,
    loading,
  } = useStudentStore();

  useEffect(() => {
    if (course_id) {
      fetchAssignments(course_id);
    }
  }, [course_id, fetchAssignments]);

  const isPastDue = (dueDateString) => {
    const dueDate = new Date(dueDateString);
    const currentDate = new Date();
    return currentDate > dueDate;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSubmit = async () => {
    if (!selectedFile || !selectedAssignment) return;

    const formData = new FormData();
    formData.append("media", selectedFile);
    setIsSubmitting(true);

    try {
      await submitAssignment(course_id, selectedAssignment._id, formData);
      setModalMessage("Assignment submitted successfully!");
      setShowSuccessModal(true);
      document.getElementById("submit-modal").checked = false;
      fetchAssignments(course_id);
      setSelectedAssignment(null);
      setSelectedFile(null);
    } catch (err) {
      console.error("Submission failed:", err);
      setModalMessage(
        err.response?.data?.message || "Upload failed. Please try again."
      );
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (media) => {
    try {
      setIsSubmitting(true);
      await downloadAssignments(
        media.path.split("/").pop(),
        `${media.title}.${getFileType(media.type).toLowerCase()}`
      );
      setModalMessage("Download started successfully!");
      setShowSuccessModal(true);
    } catch (error) {
      setModalMessage(
        error.data.response.error ||
          "Failed to download file. Please try again."
      );
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (assignment) => {
    if (isPastDue(assignment.end_at)) {
      return (
        <span className="badge badge-error text-base-100 w-fit h-fit">
          Deadline Passed
        </span>
      );
    }

    return assignment.submission === "Not exist" ? (
      <span className="badge badge-warning text-base-100 w-fit h-fit">
        Not Submitted
      </span>
    ) : (
      <span className="badge badge-success text-base-100 w-fit h-fit">
        Submitted
      </span>
    );
  };

  const getActionButton = (assignment) => {
    if (isPastDue(assignment.end_at)) {
      return (
        <span className="text-error font-bold flex justify-center items-center gap-1">
          <XCircle className="h-5 w-5" />
          Deadline Passed
        </span>
      );
    }

    return assignment.submission === "Not exist" ? (
      <label
        htmlFor="submit-modal"
        className="btn btn-primary btn-sm"
        onClick={() => {
          setSelectedAssignment(assignment);
          setSelectedFile(null);
        }}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "View and Submit"
        )}
      </label>
    ) : (
      <span className="flex items-center gap-1 justify-center font-bold text-success">
        <CheckCircle2 className="h-5 w-5" /> Submitted successfully
      </span>
    );
  };

  const getFileType = (mimeType) => {
    if (mimeType.includes("video")) return "Video";
    if (mimeType.includes("pdf")) return "PDF";
    if (mimeType.includes("word") || mimeType.includes("msword")) return "DOC";
    return mimeType.split("/")[1]?.toUpperCase() || "File";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-lg shadow-md p-6">
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="table table-zebra w-full text-center">
          <thead className="bg-primary text-base-100">
            <tr>
              <th>Assignment</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <tr key={assignment._id}>
                  <td className="flex flex-col text-start">
                    <div className="font-semibold">{assignment.title}</div>
                    <div className="text-sm text-gray-500">
                      {assignment.description}
                    </div>
                  </td>
                  <td>{formatDate(assignment.end_at)}</td>
                  <td>{getStatusBadge(assignment)}</td>
                  <td>{getActionButton(assignment)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  No assignment available for this course
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Submission Modal */}
      <input type="checkbox" id="submit-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-full max-w-2xl">
          {selectedAssignment && (
            <>
              <div className="mb-6">
                <h3 className="font-bold text-lg">Download Instructions</h3>
                <button
                  onClick={() => handleDownload(selectedAssignment)}
                  className="link link-primary flex items-center gap-2 mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Download /> {selectedAssignment.title}.pdf
                    </>
                  )}
                </button>
              </div>

              <div className="divider divider-primary"></div>

              <div>
                <h3 className="font-bold text-lg mb-4">
                  Submit: {selectedAssignment.title}
                </h3>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  disabled={isSubmitting}
                />
                {selectedFile && (
                  <p className="text-sm mt-2 text-gray-600">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              <div className="modal-action mt-4">
                <label
                  htmlFor="submit-modal"
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </label>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={!selectedFile || isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Submit Assignment"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Success and Error Modals */}
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

export default StudentAssignmentsTab;
