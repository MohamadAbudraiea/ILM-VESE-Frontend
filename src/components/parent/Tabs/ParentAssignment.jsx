import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Download, XCircle, Loader2 } from "lucide-react";
import useParentsStore from "../../../store/ParentStore";

function ParentAssignment() {
  const { course_id, student_id } = useParams();
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    assignments = [],
    fetchAssignments,
    downloadAssignments,
    downloadRSubmissions,
  } = useParentsStore();

  // Fetch assignments
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (course_id && student_id) {
          await fetchAssignments(course_id, student_id);
        }
      } catch (err) {
        console.error("Failed to fetch assignments:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [course_id, student_id, fetchAssignments]);

  // function to check if the assignment is past due
  const isPastDue = (dueDateString) => {
    const dueDate = new Date(dueDateString);
    const currentDate = new Date();
    return currentDate > dueDate;
  };

  // function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // function to get the status badge based on submission status
  const getStatusBadge = (assignment) => {
    if (assignment.submission === "Not exist") {
      return (
        <span className="badge badge-error text-base-100 w-full h-full">
          Not Submitted
        </span>
      );
    }
    return (
      <span className="badge badge-success text-base-100 w-full h-full">
        Submitted
      </span>
    );
  };

  // function to get the action content based on submission status and due date
  const getActionContent = (assignment) => {
    const hasSubmission = assignment.submission !== "Not exist";
    const isExpired = isPastDue(assignment.end_at);

    if (!hasSubmission && isExpired) {
      return (
        <span className="text-error font-bold flex justify-center items-center gap-1">
          <XCircle className="h-5 w-5" />
          Deadline Passed
        </span>
      );
    }

    if (hasSubmission) {
      return (
        <label
          htmlFor="submit-modal"
          className="btn btn-primary btn-sm w-full h-full"
          onClick={() => setSelectedAssignment(assignment)}
        >
          View Submission
        </label>
      );
    }

    return <span className="text-warning font-semibold">Pending</span>;
  };

  const getFileType = (mimeType) => {
    if (mimeType.includes("video")) return "Video";
    if (mimeType.includes("pdf")) return "PDF";
    if (mimeType.includes("word") || mimeType.includes("msword")) return "DOC";
    return mimeType.split("/")[1]?.toUpperCase() || "File";
  };

  // Handle download assignments
  const handleDownloadAssignment = (assignment) => {
    downloadAssignments(
      assignment.path.split("/").pop(),
      `${assignment.title}.${getFileType(assignment.type).toLowerCase()}`
    );
  };

  // Handle download assignments
  const handleDownloadSubmissions = (assignment) => {
    downloadRSubmissions(
      assignment.path.split("/").pop(),
      `${selectedAssignment.title}.${getFileType(
        assignment.type
      ).toLowerCase()}`
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-lg shadow-md p-6">
      <h2 className="text-3xl text-primary font-bold mb-6">Assignments</h2>
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
              assignments.map((assignment, index) => (
                <tr key={assignment._id || index}>
                  <td>
                    <div className="font-semibold">{assignment.title}</div>
                    <div className="text-sm text-gray-500">
                      Published: {assignment.published_at}
                    </div>
                  </td>
                  <td>{formatDate(assignment.end_at)}</td>
                  <td>{getStatusBadge(assignment)}</td>
                  <td>{getActionContent(assignment)}</td>
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

      {/* MODAL for submission */}
      <input type="checkbox" id="submit-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-full max-w-2xl">
          {selectedAssignment && (
            <>
              <div className="mb-6 pb-4">
                <h3 className="font-bold text-lg mb-2">Download assignment:</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadAssignment(selectedAssignment)}
                    className="link link-primary font-medium flex gap-2 mt-2"
                  >
                    <Download />
                    {selectedAssignment.title}
                  </button>
                </div>
              </div>

              <div className="divider divider-primary m-0"></div>

              <div className="mt-4">
                <h3 className="font-bold text-lg mb-2">
                  Download student submission:
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedAssignment.submission === "Not exist" ? (
                    "No submission yet."
                  ) : (
                    <button
                      onClick={() =>
                        handleDownloadSubmissions(selectedAssignment.submission)
                      }
                      className="link link-primary font-medium flex gap-2 mt-2"
                    >
                      <Download />
                      {selectedAssignment.title}
                    </button>
                  )}
                </p>
              </div>

              <div className="modal-action">
                <label htmlFor="submit-modal" className="btn btn-outline">
                  Close
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ParentAssignment;
