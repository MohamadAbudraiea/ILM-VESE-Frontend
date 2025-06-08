const ConfirmModal = ({
  showConfirmModal,
  setShowConfirmModal,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!showConfirmModal) return null;
    
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4 text-yellow-600">Confirm</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setShowConfirmModal(false);
              if (onCancel) onCancel();
            }}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setShowConfirmModal(false);
              if (onConfirm) onConfirm();
            }}
            className="btn btn-primary"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
