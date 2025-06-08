import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAdminStore } from "../../../store/AdminStore";
import SuccessModal from "../../../components/shared/SuccessModal";
import ErrorModal from "../../../components/shared/ErrorModal";

export default function AdminDeleteTable({ searchTerm }) {
  const { isFetchingAdmins, getAllAdmins, deleteAdmin } = useAdminStore();

  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);

  const [deletingIds, setDeletingIds] = useState([]);

  const [adminToDelete, setAdminToDelete] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // fetching all the admion
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await getAllAdmins();
        if (response?.data) {
          setAdmins(response.data);
          setFilteredAdmins(response.data);
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
        setErrorMessage("Failed to fetch admins");
        setShowErrorModal(true);
      }
    };
    fetchAdmins();
  }, [getAllAdmins]);

  // filtering the admin either by name or id
  useEffect(() => {
    if (searchTerm) {
      const results = admins.filter(
        (admin) =>
          `${admin.first_name} ${admin.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          admin.gm_id.toString().includes(searchTerm)
      );
      setFilteredAdmins(results);
    } else {
      setFilteredAdmins(admins);
    }
  }, [searchTerm, admins]);

  // open the confirmation modal
  const handleDeleteClick = (admin) => {
    setAdminToDelete(admin);
    setShowConfirmModal(true);
  };

  // handle deleting student
  const confirmDelete = async () => {
    if (!adminToDelete) return;

    try {
      setShowConfirmModal(false);
      setDeletingIds((prev) => [...prev, adminToDelete.gm_id]);

      await deleteAdmin(adminToDelete.gm_id);

      setAdmins(admins.filter((a) => a.gm_id !== adminToDelete.gm_id));
      setFilteredAdmins(
        filteredAdmins.filter((a) => a.gm_id !== adminToDelete.gm_id)
      );

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error deleting admin:", error);
      setErrorMessage("Failed to delete admin");
      setShowErrorModal(true);
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== adminToDelete.gm_id));
      setAdminToDelete(null);
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
            Are you sure you want to delete admin{" "}
            {adminToDelete &&
              `${adminToDelete.first_name} ${adminToDelete.last_name}`}
            ? This action cannot be undone.
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

  if (isFetchingAdmins) {
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
          {filteredAdmins.length > 0 ? (
            filteredAdmins.map((admin) => (
              <tr key={admin.gm_id}>
                <td className="font-medium">{admin.gm_id}</td>
                <td>
                  <div className="font-medium">
                    {admin.first_name} {admin.last_name}
                  </div>
                  <div className="text-sm text-gray-500">{admin.email}</div>
                </td>
                <td className="text-red-600">
                  Are you sure you want to delete?
                  <div className="text-sm">This action cannot be undone.</div>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteClick(admin)}
                    className="btn btn-error btn-sm text-white"
                    disabled={deletingIds.includes(admin.gm_id)}
                  >
                    {deletingIds.includes(admin.gm_id) ? (
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
                No admins found{searchTerm ? " matching your search" : ""}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <DeleteConfirmationModal />

      <SuccessModal
        successMessage="Admin deleted successfully."
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
