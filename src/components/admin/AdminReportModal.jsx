import { useState } from "react";
import { useAdminStore } from "../../store/AdminStore";
import SuccessModal from "../shared/SuccessModal";
import ErrorModal from "../shared/ErrorModal";

function AdminReportModal({ isOpen, onClose, student }) {
  const addReport = useAdminStore((state) => state.addReport);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddReport = async (student_id, title, date, description) => {
    try {
      if (!student_id || !title || !date || !description) {
        setErrorMessage("All fields are required.");
        setShowErrorModal(true);
        return;
      }

      await addReport(student_id, title, description, date);

      setTitle("");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
      setSuccessMessage("Report added successfully!");
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        onClose();
      }, 1000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || error.message || "Error adding report."
      );
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <dialog open={isOpen} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box max-w-4xl">
        <h3 className="font-bold text-2xl text-primary mb-4">
          Student Report Form
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Title</span>
            </label>
            <input
              type="text"
              placeholder="Report title"
              className="input input-bordered w-full"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Student Name</span>
            </label>
            <div className="bg-base-200 p-3 rounded-lg">
              {student.student_name}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={date}
              required
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Department</span>
            </label>
            <div className="bg-primary text-primary-content p-3 rounded-lg">
              {student.dept_name}
            </div>
          </div>
        </div>

        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text font-semibold">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-32"
            placeholder="Report details..."
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={() => {
              setTitle("");
              setDescription("");
              setDate(new Date().toISOString().split("T")[0]);
            }}
          >
            Clear
          </button>
          <button
            className="btn btn-primary"
            onClick={() =>
              handleAddReport(student.student_id, title, date, description)
            }
          >
            Generate Report
          </button>
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      {/* Success and Error Modals */}
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
    </dialog>
  );
}

export default AdminReportModal;
