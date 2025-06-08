import { useLocation, useParams } from "react-router-dom";
import { Trash2, File, Video, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTeacherStore } from "../../../store/TeacherStore";
import { useCourseStore } from "../../../store/CourseStore";
import UploadModal from "../../course/UploadModal";
import MediaPreviewModal from "../../course/MediaPreviewModal";
import ErrorModal from "../../shared/ErrorModal";
import SuccessModal from "../../shared/SuccessModal";
import ConfirmModal from "../../shared/ConfirmModal";

function TeacherUnitContentTab() {
  const location = useLocation();
  const unit = location.state?.unit;
  const { unit_id } = useParams();

  const { getUnitContent, unitContent, addUnitContent, deleteUnitContent } =
    useTeacherStore();
  const { downloadResource } = useCourseStore();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [mediaToDelete, setMediaToDelete] = useState({
    unit_id: "",
    media_id: "",
  });

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadState, setUploadState] = useState({
    file: null,
    title: "",
    isUploading: false,
    uploadProgress: 0,
  });

  // Fetch unit content
  useEffect(() => {
    const fetchContents = async () => {
      setIsLoading(true);
      try {
        await getUnitContent(unit_id);
      } catch {
        setModalMessage("Failed to load unit content. Please try again.");
        setShowErrorModal(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, [unit_id, getUnitContent]);

  // Open upload modal
  const openUploadModal = () => {
    setIsUploadModalOpen(true);
    setUploadState({
      file: null,
      title: "",
      isUploading: false,
      uploadProgress: 0,
    });
  };

  // Close upload modal
  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  // Handle file change
  const handleFileChange = (e) => {
    setUploadState({
      ...uploadState,
      file: e.target.files[0],
      title: e.target.files[0]?.name.split(".")[0] || "",
    });
  };

  // Handle upload content
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

      // Simulate upload progress
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

      await addUnitContent(unit_id, formData);
      await getUnitContent(unit_id);

      clearInterval(interval);
      setModalMessage("Content uploaded successfully!");
      setShowSuccessModal(true);
      closeUploadModal();
    } catch (error) {
      setModalMessage(
        error.response?.data?.error || "Upload failed. Please try again."
      );
      setShowErrorModal(true);
    } finally {
      setUploadState((prev) => ({ ...prev, isUploading: false }));
    }
  };

  // Open media modal for preview
  const openMediaModal = (media) => {
    setSelectedMedia(media);
    setIsModalOpen(true);
  };

  // Close media modal
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

  // Handle download of media
  const handleDownload = async (media) => {
    try {
      setIsLoading(true);
      await downloadResource(
        media.path.split("/").pop(),
        `${media.title}.${getFileType(media.type).toLowerCase()}`
      );
      setModalMessage("Download started successfully!");
      setShowSuccessModal(true);
    } catch {
      setModalMessage("Failed to download file. Please try again.");
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Open confirmation modal for deletion
  const confirmDeleteMedia = (unit_id, media_id) => {
    setMediaToDelete({ unit_id, media_id });
    setModalMessage("Are you sure you want to delete this content?");
    setShowConfirmModal(true);
  };

  // Handle media deletion
  const handleDeleteMedia = async () => {
    try {
      setIsLoading(true);
      await deleteUnitContent(mediaToDelete.unit_id, mediaToDelete.media_id);
      await getUnitContent(mediaToDelete.unit_id);
      setModalMessage("Content deleted successfully!");
      setShowSuccessModal(true);
    } catch (error) {
      setModalMessage(
        error.response?.data?.error || "Failed to delete content."
      );
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
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
    <div className="bg-base-100 p-6 rounded-lg shadow-md">
      {/* Unit Header */}
      <h2 className="text-2xl font-bold text-primary mb-6">Unit Content </h2>
      <div className="bg-base-200 rounded-md px-4 py-2 flex justify-between items-center font-semibold text-lg mb-4">
        <span>{unit.unit_name}</span>
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-ghost"
            onClick={openUploadModal}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <>
                <Plus /> Add
              </>
            )}
          </button>
        </div>
      </div>

      {isLoading && unitContent?.length === 0 ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : unitContent?.length > 0 ? (
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
                {getFileType(media.type)} • Uploaded on {formatDate(media.date)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => confirmDeleteMedia(unit_id, media._id)}
                className="btn btn-sm btn-ghost text-error"
                disabled={isLoading}
              >
                {isLoading ? (
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

      {/* Modals */}
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
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
}

export default TeacherUnitContentTab;
