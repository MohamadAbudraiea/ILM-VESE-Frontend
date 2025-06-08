import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ParentNavBar from "../../components/parent/ParentNavBar";
import { X } from "lucide-react";
import useParentsStore from "../../store/ParentStore";

function ParentShowReports() {
  const { student_id } = useParams();

  const { students, reports, error, loading, fetchStudents, fetchShowReports } =
    useParentsStore();

  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔹 Fetch students on mount (only if not already fetched)
  useEffect(() => {
    if (!students || students.length === 0) {
      fetchStudents();
    }
  }, [students, fetchStudents]);

  // 🔹 Find the student after students are loaded
  const selectedStudent = students.find(
    (student) => student.student_id === student_id
  );

  // 🔹 Fetch reports when student is available
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

  // 🔹 Optional: show spinner if students are still loading
  if (loading && students.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center pb-5">
        <ParentNavBar />
        <div className="w-full max-w-5xl px-5 mt-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center pb-5">
        <ParentNavBar />
        <div className="w-full max-w-5xl px-5 mt-10">
          <div className="alert alert-error">{error}</div>
        </div>
      </div>
    );
  }

  if (!selectedStudent && students.length > 0 && !loading) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center pb-5">
        <ParentNavBar />
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
      <ParentNavBar />

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
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-primary text-base-100">
                    <th className="text-center">Admin</th>
                    <th className="text-center">Date</th>
                    <th className="text-center">Title</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reportsData.adminReports.map((report) => (
                    <tr
                      key={`admin-${report.title}-${report.date}`}
                      className="hover"
                    >
                      <td className="text-center">{report.admin}</td>
                      <td className="text-center">
                        {new Date(report.date).toLocaleDateString()}
                      </td>
                      <td className="text-center">{report.title}</td>
                      <td className="text-center">
                        <button
                          onClick={() => openReportModal(report)}
                          className="btn btn-primary btn-sm"
                        >
                          View
                        </button>
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
              <table className="table w-full">
                <thead>
                  <tr className="bg-primary text-base-100">
                    <th className="text-center">Course</th>
                    <th className="text-center">Teacher</th>
                    <th className="text-center">Date</th>
                    <th className="text-center">Title</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reportsData.teacherReports.map((report) => (
                    <tr
                      key={`teacher-${report.course}-${report.date}`}
                      className="hover"
                    >
                      <td className="text-center">{report.course || "N/A"}</td>
                      <td className="text-center">{report.teacher}</td>
                      <td className="text-center">
                        {new Date(report.date).toLocaleDateString()}
                      </td>
                      <td className="text-center">{report.title}</td>
                      <td className="text-center">
                        <button
                          onClick={() => openReportModal(report)}
                          className="btn btn-primary btn-sm"
                        >
                          View
                        </button>
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
    </div>
  );
}

export default ParentShowReports;
