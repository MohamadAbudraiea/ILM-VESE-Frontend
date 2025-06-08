import AdminNavbar from "../../components/admin/adminNavbar";
import { Eye, EyeOff, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAdminStore } from "../../store/AdminStore";
import ErrorModal from "../../components/shared/ErrorModal";
import SuccessModal from "../../components/shared/SuccessModal";

function ResetUserPassword() {
  const {
    isChangingPassword,
    changeUserPassword,
    getAllStudents,
    getAllParents,
    getAllTeachers,
  } = useAdminStore();

  const [allUsers, setAllUsers] = useState([]);
  const [userType, setUserType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);

  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [students, teachers, parents] = await Promise.all([
          getAllStudents(),
          getAllTeachers(),
          getAllParents(),
        ]);

        // Normalize data to a common structure
        const studentUsers = students.data.map((student) => ({
          id: student.student_id,
          name: student.first_name + " " + student.last_name,
          identifier: student.student_id,
          type: "Student",
        }));

        const teacherUsers = teachers.data.map((teacher) => ({
          id: teacher.teacher_id,
          name: teacher.first_name + " " + teacher.last_name,
          identifier: teacher.teacher_id,
          type: "Teacher",
        }));

        const parentUsers = parents.data.map((parent) => ({
          id: parent.parent_id,
          name: parent.first_name + " " + parent.last_name,
          identifier: parent.parent_id,
          type: "Parent",
        }));

        setAllUsers([...studentUsers, ...teacherUsers, ...parentUsers]);
      } catch (error) {
        setModalMessage(error.response?.data?.message || "Failed to get users");
        setShowErrorModal(true);
      }
    };

    fetchUsers();
  }, [getAllStudents, getAllTeachers, getAllParents]);

  // filter users either by name, user type, or both
  const filteredUsers = allUsers.filter(
    (user) =>
      (userType === "" || user.type === userType) &&
      (searchQuery === "" ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // handle reset password
  const handleReset = async () => {
    if (!newPassword || newPassword !== confirmPassword) return;

    try {
      await changeUserPassword({
        userType: selectedUser.type,
        identifier: selectedUser.identifier,
        newPassword,
      });
      setModalMessage("Password reset successfully!");
      setShowSuccessModal(true);

      // Reset form
      setSelectedUser(null);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setModalMessage(
        "Failed to reset password: " +
          (error.response?.data?.error || error.message)
      );
      setShowErrorModal(true);
    }
  };

  // pagination logic
  const UsersPerPage = 5;
  const totalPages = Math.ceil(filteredUsers.length / UsersPerPage);
  const indexOfLastUser = currentPage * UsersPerPage;
  const indexOfFirstUser = indexOfLastUser - UsersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Administrator Dashboard
          </h1>
          <h2 className="text-2xl font-semibold text-gray-600 mt-2">
            Password Management
          </h2>
        </div>

        {/* User Selection Section */}
        <div className="bg-base-100 rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Select User
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Select user type */}
            <div>
              <label className="block font-medium mb-2 text-gray-700">
                Filter by User Type
              </label>
              <select
                className="select select-bordered w-full bg-gray-50"
                value={userType}
                onChange={(e) => {
                  setCurrentPage(1);
                  setUserType(e.target.value);
                }}
              >
                <option value="">All User Types</option>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Parent">Parent</option>
              </select>
            </div>

            {/* Search for a user */}
            <div>
              <label className="block font-medium mb-2 text-gray-700">
                Search Users
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="input input-bordered w-full bg-gray-50 pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="border rounded-lg overflow-hidden shadow-sm text-center overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Identifier</th>
                  <th className="p-3 font-medium">Role</th>
                  <th className="p-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <tr
                      key={index}
                      className={`border-b ${
                        selectedUser?.id === user.id
                          ? "bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="p-3 font-medium text-gray-800">
                        {user.name}
                      </td>
                      <td className="p-3 text-gray-600">{user.identifier}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary text-base-100">
                          {user.type}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setUserType(user.type);
                            setSearchQuery(user.name);
                            setCurrentPage(1);
                          }}
                          className={`btn btn-sm ${
                            selectedUser?.id === user.id
                              ? "btn-disabled bg-gray-200 text-gray-600"
                              : "btn-primary"
                          }`}
                          disabled={selectedUser?.id === user.id}
                        >
                          {selectedUser?.id === user.id ? "Selected" : "Select"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">
                      No users found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => {
                if (currentPage > 1) setCurrentPage((prev) => prev - 1);
              }}
              className="btn btn-sm"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => {
                if (currentPage < totalPages)
                  setCurrentPage((prev) => prev + 1);
              }}
              className="btn btn-sm"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>

        {/* Password Reset Form */}
        {selectedUser && (
          <div className="bg-base-100 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-700">
                Reset Password for{" "}
                <span className="text-primary font-bold">
                  {selectedUser.name}
                </span>
              </h3>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setNewPassword("");
                  setConfirmPassword("");
                  setUserType("");
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="btn btn-ghost btn-sm"
              >
                Change User
              </button>
            </div>

            <div className="space-y-4 max-w-lg mx-auto">
              <div>
                <label className="block font-medium mb-1 text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="input input-bordered w-full pr-10"
                    placeholder="Enter new password"
                    value={newPassword}
                    autoComplete="new-password"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="input input-bordered w-full pr-10"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    autoComplete="new-password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setSelectedUser(null);
                    setNewPassword("");
                    setConfirmPassword("");
                    setUserType("");
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleReset}
                  disabled={
                    isChangingPassword ||
                    !newPassword ||
                    newPassword !== confirmPassword
                  }
                >
                  {isChangingPassword ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      <SuccessModal
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
        successMessage={modalMessage}
      />

      {/* Error Modal */}
      <ErrorModal
        showErrorModal={showErrorModal}
        setShowErrorModal={setShowErrorModal}
        errorMessage={modalMessage}
      />
    </div>
  );
}

export default ResetUserPassword;
