import { useState } from "react";
import AdminNavbar from "../../components/admin/adminNavbar";
import StudentDeleteTable from "../../components/admin/deletition/StudentDeleteTable";
import TeacherDeleteTable from "../../components/admin/deletition/TeacherDeleteTable";
import ParentDeleteTable from "../../components/admin/deletition/ParentDeleteTable";
import AdminDeleteTable from "../../components/admin/deletition/adminDeleteTable";
import TabNavigation from "../../components/admin/TabNavigation";

function DeleteUser() {
  const [activeTab, setActiveTab] = useState("students");
  const [searchTerm, setSearchTerm] = useState("");

  // to render a table based on the activeTab
  const renderTable = () => {
    switch (activeTab) {
      case "teachers":
        return <TeacherDeleteTable searchTerm={searchTerm} />;
      case "parents":
        return <ParentDeleteTable searchTerm={searchTerm} />;
      case "admins":
        return <AdminDeleteTable searchTerm={searchTerm} />;
      default:
        return <StudentDeleteTable searchTerm={searchTerm} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Administrator</h1>
        <h2 className="text-2xl font-semibold mb-6">Delete User</h2>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder={`Search for ${activeTab}...`}
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">{renderTable()}</div>
        </div>
      </div>
    </div>
  );
}

export default DeleteUser;
