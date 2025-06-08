import { useLocation } from "react-router-dom";
import { Trash2, File, Video, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import AdminNavbar from "../adminNavbar";
import { useCourseStore } from "../../../store/CourseStore";
import MediaPreviewModal from "../../course/MediaPreviewModal";
import UploadModal from "../../course/UploadModal";
import SuccessModal from "../../shared/SuccessModal";
import ErrorModal from "../../shared/ErrorModal";
import ConfirmModal from "../../shared/ConfirmModal";

function AdminUnitContent() {
  const location = useLocation();
  const unit = location.state?.unit;
  const {
    unitContent,
    getUnitContent,
    addUnitContent,
    downloadResource,
    deleteUnitContent,
  } = useCourseStore();

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingMediaId, setDeletingMediaId] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadState, setUploadState] = useState({
    file: null,
    title: "",
    isUploading: false,
    uploadProgress: 0,
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [mediaToDelete, setMediaToDelete] = useState({
    unit_id: null,
    media_id: null,
  });

  // fetch unit content
  useEffect(() => {
    if (unit?.unit_id) {
      getUnitContent(unit.unit_id);
    }
  }, [getUnitContent, unit?.unit_id]);

  // open the upload modal
  const openUploadModal = () => {
    setIsUploadModalOpen(true);
    setUploadState({
      file: null,
      title: "",
      isUploading: false,
      uploadProgress: 0,
    });
  };

  // close the upload modal
  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  // handle file input change
  const handleFileChange = (e) => {
    setUploadState({
      ...uploadState,
      file: e.target.files[0],
      title: e.target.files[0]?.name.split(".")[0] || "",
    });
  };

  // handle upload click
  const handleUpload = async () => {
    if (!uploadState.file || !uploadState.title) {
      setModalMessage("Please provide both a file and a title");
      setShowErrorModal(true);
      return;
    }

    setUploadState({ ...uploadState, isUploading: true });

    try {
      const formData = new FormData();
      formData.append("media", uploadState.file);
      formData.append("title", uploadState.title);

      // simnulate upload progress
      const interval = setInterval(() => {
        setUploadState((prev) => {
          const newProgress = prev.uploadProgress + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            return { ...prev, uploadProgress: 100, isUploading: false };
          }
          return { ...prev, uploadProgress: newProgress };
        });
      }, 300);

      await addUnitContent(unit.unit_id, formData);
      await getUnitContent(unit.unit_id);

      clearInterval(interval);
      setModalMessage("File uploaded successfully!");
      setShowSuccessModal(true);
      closeUploadModal();
    } catch {
      setModalMessage("Upload failed. Please try again.");
      setShowErrorModal(true);
    } finally {
      setUploadState((prev) => ({ ...prev, isUploading: false }));
    }
  };

  // open media modal
  const openMediaModal = (media) => {
    setSelectedMedia(media);
    setIsModalOpen(true);
  };

  // close media modal
  const closeMediaModal = () => {
    setSelectedMedia(null);
    setIsModalOpen(false);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getFileType = (mimeType) => {
    if (mimeType.includes("video")) return "Video";
    if (mimeType.includes("pdf")) return "PDF";
    if (mimeType.includes("word") || mimeType.includes("msword")) return "DOC";
    return mimeType.split("/")[1]?.toUpperCase() || "File";
  };

  // handle download file
  const handleDownload = (media) => {
    try {
      downloadResource(
        media.path.split("/").pop(),
        `${media.title}.${getFileType(media.type).toLowerCase()}`
      );
    } catch {
      setModalMessage("Download failed. Please try again.");
      setShowErrorModal(true);
    }
  };

  // confirm delete media
  const confirmDeleteMedia = (unit_id, media_id) => {
    setMediaToDelete({ unit_id, media_id });
    setModalMessage("Are you sure you want to delete this media?");
    setShowConfirmModal(true);
  };

  // handle delete media
  const handleDeleteMedia = async () => {
    try {
      setDeletingMediaId(mediaToDelete.media_id);
      await deleteUnitContent(mediaToDelete.unit_id, mediaToDelete.media_id);
      await getUnitContent(mediaToDelete.unit_id);
      setModalMessage("Media deleted successfully!");
      setShowSuccessModal(true);
    } catch (error) {
      setModalMessage(
        error.response?.data?.error ||
          "Failed to delete media. Please try again."
      );
      setShowErrorModal(true);
    } finally {
      setDeletingMediaId(null);
      setShowConfirmModal(false);
    }
  };

  if (!unit) {
    return (
      <div className="text-center text-error text-2xl mt-16 font-bold">
        No unit selected
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <AdminNavbar />

      <div className="bg-base-100 p-6 pb-0 max-w-6xl w-full mx-auto rounded-lg shadow-md mt-6">
        <h2 className="text-2xl font-bold text-primary mb-6">Unit Content</h2>

        <div className="bg-base-200 rounded-md px-4 py-2 flex justify-between items-center font-semibold text-lg mb-4">
          <span>{unit.unit_name}</span>
          <div className="flex gap-2">
            <button className="btn btn-sm btn-ghost" onClick={openUploadModal}>
              <Plus /> Add
            </button>
          </div>
        </div>

        {unitContent?.length > 0 ? (
          unitContent.map((media, i) => (
            <div
              key={i}
              className="bg-base-100 border rounded-md mt-2 px-4 py-3 mb-3 flex justify-between items-center"
            >
              <div>
                <div
                  className="font-medium cursor-pointer flex items-center gap-2 link-hover"
                  onClick={() =>
                    media.type.includes("video")
                      ? openMediaModal(media)
                      : handleDownload(media)
                  }
                >
                  {media.type.includes("video") ? <Video /> : <File />}
                  {media.title}
                </div>
                <p className="text-sm text-gray-500">
                  {getFileType(media.type)} • Uploaded on{" "}
                  {formatDate(media.date)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => confirmDeleteMedia(unit.unit_id, media._id)}
                  className="btn btn-sm btn-ghost text-error"
                  disabled={deletingMediaId === media._id}
                >
                  {deletingMediaId === media._id ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <Trash2 />
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No content available for this unit
          </div>
        )}

        <UploadModal
          isOpen={isUploadModalOpen}
          closeUploadModal={closeUploadModal}
          uploadState={uploadState}
          setUploadState={setUploadState}
          handleFileChange={handleFileChange}
          handleUpload={handleUpload}
        />

        <MediaPreviewModal
          isOpen={isModalOpen}
          selectedMedia={selectedMedia}
          closeModal={closeMediaModal}
          handleDownload={handleDownload}
          formatDate={formatDate}
        />

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
          onConfirm={handleDeleteMedia}
        />
      </div>
    </div>
  );
}

export default AdminUnitContent;
