import { useState } from "react";
import AdminNavbar from "../../components/admin/adminNavbar";
import SearchStudent from "../../components/admin/SearchStudent";
import SearchParent from "../../components/admin/SearchParent";
import QuickActions from "../../components/admin/QuickActions";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("students");

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="p-8 max-w-6xl mx-auto">
        {/* Tab Navigation */}
        <div className="tabs tabs-boxed bg-gray-100 p-1 mb-8">
          <button
            className={`tab ${
              activeTab === "students" ? "tab-active bg-primary text-base-100" : ""
            }`}
            onClick={() => setActiveTab("students")}
          >
            Students
          </button>
          <button
            className={`tab ${
              activeTab === "parents" ? "tab-active bg-primary text-base-100" : ""
            }`}
            onClick={() => setActiveTab("parents")}
          >
            Parents
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "students" ? <SearchStudent /> : <SearchParent />}

        {/* Quick Actions Component */}
        <QuickActions />
      </div>
    </div>
  );
}

export default AdminDashboard;
