import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAdminStore } from "../../../store/AdminStore";
import SuccessModal from "../../../components/shared/SuccessModal";
import ErrorModal from "../../../components/shared/ErrorModal";

export default function ParentDeleteTable({ searchTerm }) {
  const { isFetchingParents, getAllParents, deleteParent } = useAdminStore();

  const [parents, setParents] = useState([]);
  const [filteredParents, setFilteredParents] = useState([]);

  const [deletingIds, setDeletingIds] = useState([]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [parentToDelete, setParentToDelete] = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // fetching all the parents
  useEffect(() => {
    const fetchParents = async () => {
      try {
        const response = await getAllParents();
        if (response?.data) {
          setParents(response.data);
          setFilteredParents(response.data);
        }
      } catch (error) {
        console.error("Error fetching parents:", error);
        setErrorMessage("Failed to fetch parents");
        setShowErrorModal(true);
      }
    };
    fetchParents();
  }, [getAllParents]);

  // filtering the parents either by name or id
  useEffect(() => {
    if (searchTerm) {
      const results = parents.filter(
        (parent) =>
          `${parent.first_name} ${parent.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          parent.parent_id.toString().includes(searchTerm)
      );
      setFilteredParents(results);
    } else {
      setFilteredParents(parents);
    }
  }, [searchTerm, parents]);

  // open the confirmation modal
  const handleDeleteClick = (parent) => {
    setParentToDelete(parent);
    setShowConfirmModal(true);
  };

  // handle deleting parent
  const confirmDelete = async () => {
    if (!parentToDelete) return;

    try {
      setShowConfirmModal(false);
      setDeletingIds((prev) => [...prev, parentToDelete.parent_id]);

      await deleteParent(parentToDelete.parent_id);

      setParents(
        parents.filter((p) => p.parent_id !== parentToDelete.parent_id)
      );
      setFilteredParents(
        filteredParents.filter((p) => p.parent_id !== parentToDelete.parent_id)
      );

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error deleting parent:", error);
      setErrorMessage("Failed to delete parent and associated students");
      setShowErrorModal(true);
    } finally {
      setDeletingIds((prev) =>
        prev.filter((id) => id !== parentToDelete.parent_id)
      );
      setParentToDelete(null);
    }
  };

  // confirmation modal
  const DeleteConfirmationModal = () => {
    if (!showConfirmModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
          <p className="mb-6">
            Are you sure you want to delete parent{" "}
            {parentToDelete &&
              `${parentToDelete.first_name} ${parentToDelete.last_name}`}
            ? This will also delete ALL their associated students.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="btn btn-error text-white"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isFetchingParents) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <>
      <table className="table w-full text-center">
        <thead className="bg-primary text-white">
          <tr>
            <th>ID</th>
            <th>Details</th>
            <th>Confirm Deletion</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredParents.length > 0 ? (
            filteredParents.map((parent) => (
              <tr key={parent.parent_id}>
                <td className="font-medium">{parent.parent_id}</td>
                <td className="font-medium">
                  {parent.first_name} {parent.last_name}
                </td>
                <td className="text-red-600">
                  Are you sure you want to delete?
                  <div className="text-sm">
                    This will delete ALL their students.
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteClick(parent)}
                    className="btn btn-error btn-sm text-white"
                    disabled={deletingIds.includes(parent.parent_id)}
                  >
                    {deletingIds.includes(parent.parent_id) ? (
                      <Loader2 className="animate-spin h-4 w-4 mx-auto" />
                    ) : (
                      "Delete"
                    )}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center p-8 text-gray-500">
                No parents found{searchTerm ? " matching your search" : ""}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <DeleteConfirmationModal />

      <SuccessModal
        successMessage="Parent and associated students deleted successfully."
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
      />
      <ErrorModal
        errorMessage={errorMessage}
        showErrorModal={showErrorModal}
        setShowErrorModal={setShowErrorModal}
      />
    </>
  );
}
