import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminNavbar from "../admin/AdminNavbar";
import { X } from "lucide-react";
import { useAdminStore } from "../../store/AdminStore";
import SuccessModal from "../../components/shared/SuccessModal";
import ErrorModal from "../../components/shared/ErrorModal";

function AdminShowReports() {
  const { student_id } = useParams();

  const { getAllStudents, reports, fetchShowReports, deleteReport } =
    useAdminStore();

  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch students on mount (only if not already fetched)
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        if (!students || students.length === 0) {
          const data = await getAllStudents();
          if (data && data.data) {
            setStudents(data.data);
          }
        }
      } catch (error) {
        console.log("Error fetching students:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [students, getAllStudents]);

  // Find the student after students are loaded
  const selectedStudent = students.find(
    (student) => student.student_id === student_id
  );

  // Fetch reports when student is available
  useEffect(() => {
    if (selectedStudent?.student_id) {
      fetchShowReports(selectedStudent.student_id);
    }
  }, [selectedStudent?.student_id, fetchShowReports]);

  const openReportModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const handleDeleteClick = (report) => {
    setSelectedReport(report);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedReport) return;
    try {
      await deleteReport(selectedReport.report_id);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      if (selectedStudent?.student_id) {
        await fetchShowReports(selectedStudent.student_id);
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      setErrorMessage("Failed to delete report");
      setShowErrorModal(true);
    } finally {
      setSelectedReport(null);
    }
  };

  if (loading && students.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center pb-5">
        <AdminNavbar />
        <div className="w-full max-w-5xl px-5 mt-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (!selectedStudent && students.length > 0 && !loading) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center pb-5">
        <AdminNavbar />
        <div className="w-full max-w-5xl px-5 mt-10">
          <div className="alert alert-info">No student selected</div>
        </div>
      </div>
    );
  }

  const reportsData = reports || {
    teacherReports: [],
    adminReports: [],
    count: 0,
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center pb-5">
      <AdminNavbar />

      <div className="w-full max-w-5xl px-5 mt-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Student Reports</h1>
        </div>

        {/* Admin Reports Table */}
        <div className="bg-base-100 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            Admin Reports for {selectedStudent?.full_name}
          </h2>

          {reportsData.adminReports?.length > 0 ? (
            <div className="overflow-x-auto ">
              <table className="table w-full text-center">
                <thead>
                  <tr className="bg-primary text-base-100">
                    <th>Admin</th>
                    <th>Date</th>
                    <th>Title</th>
                    <th colSpan="2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reportsData.adminReports.map((report) => (
                    <tr
                      key={report.report_id}
                      className="hover"
                    >
                      <td>{report.admin}</td>
                      <td>{new Date(report.date).toLocaleDateString()}</td>
                      <td>{report.title}</td>
                      <td colSpan="2">
                        <div className="flex flex-row justify-center gap-2">
                          <button
                            onClick={() => openReportModal(report)}
                            className="btn btn-primary btn-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteClick(report)}
                            className="btn btn-outline btn-primary btn-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              No admin reports available for this student
            </div>
          )}
        </div>

        {/* Teacher Reports Table */}
        <div className="bg-base-100 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            Teacher Reports for {selectedStudent?.full_name}
          </h2>

          {reportsData.teacherReports?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table w-full text-center">
                <thead>
                  <tr className="bg-primary text-base-100">
                    <th>Course</th>
                    <th>Teacher</th>
                    <th>Date</th>
                    <th>Title</th>
                    <th colSpan="2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reportsData.teacherReports.map((report) => (
                    <tr
                      key={report.report_id}
                      className="hover"
                    >
                      <td>{report.course || "N/A"}</td>
                      <td>{report.teacher}</td>
                      <td>{new Date(report.date).toLocaleDateString()}</td>
                      <td>{report.title}</td>
                      <td colSpan="2">
                        <div className="flex flex-row justify-center gap-2">
                          <button
                            onClick={() => openReportModal(report)}
                            className="btn btn-primary btn-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteClick(report)}
                            className="btn btn-outline btn-primary btn-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              No teacher reports available for this student
            </div>
          )}
        </div>
      </div>

      {/* Report Details Modal */}
      {isModalOpen && selectedReport && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <button
              onClick={closeModal}
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              <X />
            </button>
            <h3 className="font-bold text-2xl text-primary mb-2">
              {selectedReport.title}
            </h3>
            <div className="divider my-1"></div>
            <div className="space-y-4">
              {selectedReport.date && (
                <div className="flex gap-4">
                  <h4 className="font-semibold">Date:</h4>
                  <p>{new Date(selectedReport.date).toLocaleDateString()}</p>
                </div>
              )}
              {selectedReport.course && (
                <div className="flex gap-4">
                  <h4 className="font-semibold">Course:</h4>
                  <p>{selectedReport.course}</p>
                </div>
              )}
              {selectedReport.teacher && (
                <div className="flex gap-4">
                  <h4 className="font-semibold">Teacher:</h4>
                  <p>{selectedReport.teacher}</p>
                </div>
              )}
              {selectedReport.admin && (
                <div className="flex gap-4">
                  <h4 className="font-semibold">Admin:</h4>
                  <p>{selectedReport.admin}</p>
                </div>
              )}
              {selectedReport.description && (
                <div>
                  <h4 className="font-semibold">
                    {selectedReport.admin
                      ? "Admin Comments:"
                      : "Teacher's Comments:"}
                  </h4>
                  <p className="text-gray-700 bg-base-200 p-3 rounded-lg">
                    {selectedReport.description}
                  </p>
                </div>
              )}
            </div>
            <div className="modal-action">
              <button onClick={closeModal} className="btn btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete the report titled{" "}
              <span className="font-semibold">{selectedReport?.title}</span>?
              This action cannot be undone.
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
      )}

      <SuccessModal
        successMessage="Report deleted successfully."
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

export default AdminShowReports;
