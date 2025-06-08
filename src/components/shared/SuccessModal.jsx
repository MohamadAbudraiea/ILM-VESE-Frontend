import { useEffect } from "react";

const SuccessModal = ({
  showSuccessModal,
  setShowSuccessModal,
  successMessage,
}) => {
  // a timer will close the modal after 3 seconds
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [setShowSuccessModal, showSuccessModal]);

  if (!showSuccessModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4 text-green-600">Success!</h3>
        <p className="mb-6">{successMessage}</p>
        <div className="flex justify-end">
          <button
            onClick={() => setShowSuccessModal(false)}
            className="btn btn-primary"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
