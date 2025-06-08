import { useState } from "react";
import AdminNavbar from "../../components/admin/adminNavbar";
import { useAdminStore } from "../../store/AdminStore";
import ErrorModal from "../../components/shared/ErrorModal";
import SuccessModal from "../../components/shared/SuccessModal";

function Settings() {
  // States for changing password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // States for updating name
  const [profileOldPassword, setProfileOldPassword] = useState("");
  const [profileFirstName, setProfileFirstName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const { changeAdminPassword, isChangingPassword, changeAdminName } =
    useAdminStore();

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setModalMessage("New password and confirm password do not match.");
      setShowErrorModal(true);
      return;
    }

    try {
      await changeAdminPassword(oldPassword, newPassword);
      setModalMessage("Password changed successfully.");
      setShowSuccessModal(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      setModalMessage(
        "Error changing password: " +
          (error?.response?.data?.error || error.message)
      );
      setShowErrorModal(true);
    }
  };

  // Handle profile name update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!profileFirstName || !profileLastName || !profileOldPassword) {
      setModalMessage("Please fill in all profile fields.");
      setShowErrorModal(true);
      return;
    }

    try {
      await changeAdminName(
        profileFirstName,
        profileLastName,
        profileOldPassword
      );
      setModalMessage("Name updated successfully.");
      setShowSuccessModal(true);
      setProfileFirstName("");
      setProfileLastName("");
      setProfileOldPassword("");
    } catch (error) {
      setModalMessage(
        "Error updating name: " +
          (error?.response?.data?.error || error.message)
      );
      setShowErrorModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Administrator</h1>
          <h2 className="text-2xl font-semibold">Settings</h2>
        </div>

        <div className="space-y-8">
          {/* Change Password Form */}
          <form
            onSubmit={handlePasswordChange}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h3 className="text-xl font-bold mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">New Password</label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="Confirm new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </form>

          {/* Profile Info Form */}
          <form
            onSubmit={handleProfileUpdate}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h3 className="text-xl font-bold mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">First Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Enter First Name"
                  value={profileFirstName}
                  autoComplete="off"
                  onChange={(e) => setProfileFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Enter Last Name"
                  value={profileLastName}
                  autoComplete="off"
                  onChange={(e) => setProfileLastName(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Password</label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="Enter your current password"
                  value={profileOldPassword}
                  autoComplete="new-password"
                  onChange={(e) => setProfileOldPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                 type="submit" className="btn btn-primary">
                  Update Profile
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Modals */}
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
    </div>
  );
}

export default Settings;
