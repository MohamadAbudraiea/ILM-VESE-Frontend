const ErrorModal = ({ showErrorModal, errorMessage, setShowErrorModal }) => {
  if (!showErrorModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4 text-red-600">Error</h3>
        <p className="mb-6">{errorMessage}</p>
        <div className="flex justify-end">
          <button
            onClick={() => setShowErrorModal(false)}
            className="btn btn-primary"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
