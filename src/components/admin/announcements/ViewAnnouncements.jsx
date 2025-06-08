import { useState } from "react";
import { Filter } from "lucide-react";
import { useAdminStore } from "../../../store/AdminStore";
import SuccessModal from "../../shared/SuccessModal";
import ErrorModal from "../../shared/ErrorModal";

function ViewAnnouncements({
  announcements,
  depts,
  selectedGroup,
  setSelectedGroup,
  setActiveTab,
  fetchAnnouncements,
}) {
  const { deleteAnnouncement } = useAdminStore();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);

  // Handle delete button click
  const handleDeleteClick = (id) => {
    setAnnouncementToDelete(id);
    setConfirmDelete(true);
  };

  // Confirm delete action
  const confirmDeleteAnnouncement = async () => {
    try {
      await deleteAnnouncement(announcementToDelete);
      await fetchAnnouncements();
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage(
        "Failed to delete announcement: ",
        error.response.data.error || error.message
      );
      setShowErrorModal(true);
    } finally {
      setConfirmDelete(false);
      setAnnouncementToDelete(null);
    }
  };

  // Filter announcements based on selected group
  const filtered =
    selectedGroup === "" || selectedGroup === "general"
      ? announcements
      : announcements.filter((a) => a.group === selectedGroup);

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div>
        <h3 className="text-sm font-medium text-neutral mb-2 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter by Group
        </h3>
        <div className="flex flex-wrap gap-2">
          {depts.map((department) => (
            <button
              key={department.department_id}
              onClick={() => setSelectedGroup(department.department_id)}
              className={`px-3 py-1 text-xs rounded-full border ${
                selectedGroup === department.department_id
                  ? "bg-secondary text-primary"
                  : "hover:bg-neutral/10"
              }`}
            >
              {department.name}
            </button>
          ))}
        </div>
      </div>

      {/* Announcement List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((a) => {
            const formattedTime = new Date(
              `${a.date}T${a.time}`
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });

            return (
              <div
                key={a.id}
                className="p-4 bg-base-100 rounded-lg border shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  {a.sender && (
                    <div className="mb-1 text-xs text-neutral/60">
                      Sent by: {a.sender}
                    </div>
                  )}
                  <button
                    className="btn btn-primary btn-xs"
                    onClick={() => handleDeleteClick(a.id)}
                  >
                    delete
                  </button>
                </div>

                <p className="text-neutral">{a.text}</p>
                <div className="mt-2 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-secondary text-primary rounded-full">
                      {depts.find((d) => d.department_id === a.group)?.name ||
                        "General"}
                    </span>
                    {a.group === "general" && a.department_id && (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-accent text-primary rounded-full">
                        {depts.find((d) => d.department_id === a.department_id)
                          ?.name || a.department_id}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-neutral/60">
                    <span>{a.date}</span> at <span>{formattedTime}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="text-neutral/50 mb-2">No announcements found</div>
            {selectedGroup && (
              <button
                onClick={() => {
                  setSelectedGroup("");
                  setActiveTab("send");
                }}
                className="text-sm text-primary hover:underline font-medium"
              >
                Create one now
              </button>
            )}
          </div>
        )}
      </div>

      {/* Inline Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-semibold text-neutral mb-4">
              Confirm Deletion
            </h2>
            <p className="text-sm text-neutral/70 mb-6">
              Are you sure you want to delete this announcement? This action
              cannot be undone.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setConfirmDelete(false);
                  setAnnouncementToDelete(null);
                }}
                className="px-4 py-2 text-sm rounded-md border border-neutral/30 text-neutral hover:bg-neutral/10"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAnnouncement}
                className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success and Error Modals */}
      <SuccessModal
        successMessage="Announcement deleted successfully."
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
      />
      <ErrorModal
        errorMessage={errorMessage}
        showErrorModal={showErrorModal}
        setShowErrorModal={setShowErrorModal}
      />
    </div>
  );
}

export default ViewAnnouncements;
