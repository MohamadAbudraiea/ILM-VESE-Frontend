import { X } from "lucide-react";
import { useEffect, useRef } from "react";

function UploadModal({
  isOpen,
  closeUploadModal,
  uploadState,
  setUploadState,
  handleFileChange,
  handleUpload,
}) {
  const fileInputRef = useRef();

  useEffect(() => {
    if (!isOpen && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [isOpen]);

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Upload Content</h3>
          <button onClick={closeUploadModal} className="btn btn-ghost btn-sm">
            <X />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Content Title</span>
            </label>
            <input
              type="text"
              placeholder="Enter content title"
              className="input input-bordered w-full"
              value={uploadState.title}
              onChange={(e) =>
                setUploadState({
                  ...uploadState,
                  title: e.target.value,
                })
              }
            />
          </div>

          <label className="form-control">
            <div className="label">
              <span className="label-text">
                Select File (PDF, DOC, DOCX, MP4)
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,video/mp4"
              className="file-input file-input-bordered w-full"
              onChange={handleFileChange}
            />
            {uploadState.file && (
              <div className="mt-2 text-sm text-gray-500">
                Selected: {uploadState.file.name}
              </div>
            )}
          </label>

          {uploadState.isUploading && (
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span>Uploading...</span>
                <span>{uploadState.uploadProgress}%</span>
              </div>
              <progress
                className="progress progress-primary w-full"
                value={uploadState.uploadProgress}
                max="100"
              ></progress>
            </div>
          )}
        </div>

        <div className="modal-action mt-6">
          <button
            className="btn"
            onClick={closeUploadModal}
            disabled={uploadState.isUploading}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={
              uploadState.isUploading || !uploadState.file || !uploadState.title
            }
          >
            {uploadState.isUploading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default UploadModal;
