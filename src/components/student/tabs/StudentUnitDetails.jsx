import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useStudentStore from "../../../store/studentStore";
import { Video, File, X, Loader2 } from "lucide-react";
import { useCourseStore } from "../../../store/CourseStore";

function StudentOverviewTab() {
  const { course_id, unit_id } = useParams();

  const { fetchUnitContent, unitContent } = useStudentStore();
  const { downloadResource } = useCourseStore();
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetcheUnits = async () => {
      try {
        setLoading(true);
        await fetchUnitContent(course_id, unit_id);
      } catch (error) {
        console.error("Failed to load unit content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetcheUnits();
  }, [course_id, unit_id, fetchUnitContent]);

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

  const handleDownload = (media) => {
    downloadResource(
      media.path.split("/").pop(),
      `${media.title}.${getFileType(media.type).toLowerCase()}`
    );
  };

  const openMediaModal = (media) => {
    setSelectedMedia(media);
    setIsModalOpen(true);
  };

  const closeMediaModal = () => {
    setSelectedMedia(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-lg shadow-md p-6">
      <h2 className="text-2xl text-primary font-bold mb-6">Resources</h2>

      <div className="space-y-4">
        {unitContent?.length > 0 ? (
          unitContent.map((media) => (
            <div
              key={media._id}
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
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No content available for this unit
          </div>
        )}

        {/* Media Preview Modal */}
        {isModalOpen && selectedMedia && (
          <dialog className="modal modal-open">
            <div className="modal-box w-11/12 max-w-3xl">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xl">{selectedMedia.title}</h3>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={closeMediaModal}
                >
                  <X />
                </button>
              </div>

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
                      <p className="mt-4">
                        Preview not available for this file type
                      </p>
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
                <button className="btn" onClick={closeMediaModal}>
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
}

export default StudentOverviewTab;
