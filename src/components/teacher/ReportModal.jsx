import { useState } from "react";
import { useTeacherStore } from "../../store/TeacherStore";
import { useParams } from "react-router-dom";
import SuccessModal from "../../components/shared/SuccessModal";
import ErrorModal from "../../components/shared/ErrorModal";
import ConfirmModal from "../../components/shared/ConfirmModal";

function ReportModal({ isOpen, onClose, student }) {
  const { course_id } = useParams();
  const { addReport } = useTeacherStore();

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (!title.trim()) {
      setModalMessage("Please enter a title for the report");
      setShowErrorModal(true);
      return false;
    }
    if (!description.trim()) {
      setModalMessage("Please enter a description for the report");
      setShowErrorModal(true);
      return false;
    }
    if (!date) {
      setModalMessage("Please select a valid date");
      setShowErrorModal(true);
      return false;
    }
    return true;
  };

  const handleAddReport = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await addReport(course_id, student.id, title, description, date);
      setModalMessage("Report added successfully!");
      setShowSuccessModal(true);
      resetForm();
      // Close the form after successful submission
      setTimeout(onClose, 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || "Failed to add report";
      setModalMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  const handleClear = () => {
    setModalMessage("Are you sure you want to clear the form?");
    setShowConfirmModal(true);
  };

  const confirmClear = () => {
    resetForm();
    setShowConfirmModal(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-4xl shadow-xl space-y-4">
        <h2 className="text-2xl text-primary font-bold mb-5">
          Student Report Form
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Title:</label>
            <input
              className="input input-bordered w-full"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="font-medium">Student Name:</label>
            <div className="bg-gray-200 p-3 rounded-md text-center">
              {student.name}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Date:</label>
            <input
              type="date"
              className="input input-bordered w-full text-center"
              value={date}
              required
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="font-medium">Description:</label>
          <textarea
            className="textarea textarea-bordered w-full h-32"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex justify-between gap-10">
          <button
            type="button"
            className="btn flex-1 bg-gray-300 hover:bg-gray-400"
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleAddReport}
            className="btn flex-1 bg-primary text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Generate"
            )}
          </button>
        </div>

        <div className="text-right">
          <button className="text-md text-red-500 mt-2" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      {/* Modals */}
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
      <ConfirmModal
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        message={modalMessage}
        onConfirm={confirmClear}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
}

export default ReportModal;