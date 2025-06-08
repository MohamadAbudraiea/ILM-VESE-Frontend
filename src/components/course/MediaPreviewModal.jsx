import { File } from "lucide-react";

function MediaPreviewModal({
  isOpen,
  selectedMedia,
  closeModal,
  handleDownload,
  formatDate,
}) {
  if (!isOpen || !selectedMedia) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box w-11/12 max-w-3xl">
        <h3 className="font-bold text-xl mb-2">{selectedMedia.title}</h3>
        <p className="text-sm text-gray-500 mb-4">
          Uploaded on {formatDate(selectedMedia.date)}
        </p>

        <div className="w-full flex items-center justify-center">
          {selectedMedia.type.includes("video") ? (
            <div className="w-full aspect-video bg-black">
              <video
                controls
                controlsList="nodownload"
                disablePictureInPicture
                className="w-full rounded"
              >
                <source
                  src={`${
                    import.meta.env.VITE_API_URL
                  }/resources/${selectedMedia.path.split("/").pop()}`}
                  type={selectedMedia.type}
                />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <File className="h-16 w-16 mx-auto text-gray-400" />
                <p className="mt-4">Preview not available for this file type</p>
                <button
                  onClick={() => handleDownload(selectedMedia)}
                  className="btn btn-primary mt-4"
                >
                  Download File
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="modal-action">
          <button className="btn" onClick={closeModal}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default MediaPreviewModal;
