import AdminNavbar from "../../components/admin/adminNavbar";
import { useEffect, useState } from "react";
import { useAdminStore } from "../../store/AdminStore";
import AdminForm from "../../components/admin/addition/adminForm";
import StudentForm from "../../components/admin/addition/StudentForm";
import TeacherForm from "../../components/admin/addition/TeacherForm";
import ParentForm from "../../components/admin/addition/ParentForm";
import TabNavigation from "../../components/admin/TabNavigation";

function AddUser() {
  const [activeTab, setActiveTab] = useState("students");
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState({ message: "", type: "" });
  const { addAdmin, addStudent, addParent, addTeacher } = useAdminStore();

  // to reset the form whenever a different tab is rendered
  useEffect(() => {
    setFormData({});
    setStatus({ message: "", type: "" });
  }, [activeTab]);

  // to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "", type: "" });

    try {
      switch (activeTab) {
        case "admins":
          await addAdmin(formData);
          setStatus({
            message: "Admin added successfully!",
            type: "success",
          });
          break;
        case "teachers":
          await addTeacher(formData);
          setStatus({
            message: "Teacher added successfully!",
            type: "success",
          });
          break;
        case "students":
          await addStudent(formData);
          setStatus({
            message: "Student added successfully!",
            type: "success",
          });
          break;
        case "parents":
          await addParent(formData);
          setStatus({
            message: "Parent added successfully!",
            type: "success",
          });
          break;

        default:
          setFormData({});
          break;
      }

      setFormData({});
      setTimeout(() => {
        setStatus({ message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.log("Error submitting add form:", error);
      setStatus({
        message: error.response?.data?.error || "Something went wrong!",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-primary font-bold mb-2">
            Administrator
          </h1>
          <h2 className="text-xl font-semibold">Add New {activeTab}</h2>
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <form
          onSubmit={handleSubmit}
          className="bg-base-100 p-6 rounded-lg shadow-md space-y-6"
        >
          {activeTab === "students" && (
            <StudentForm formData={formData} handleChange={handleChange} />
          )}

          {activeTab === "parents" && (
            <ParentForm formData={formData} handleChange={handleChange} />
          )}

          {activeTab === "teachers" && (
            <TeacherForm formData={formData} handleChange={handleChange} />
          )}

          {activeTab === "admins" && (
            <AdminForm formData={formData} handleChange={handleChange} />
          )}

          <div className="flex justify-between items-center pt-4">
            {status.message && (
              <div
                className={`text-sm ${
                  status.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {status.message}
              </div>
            )}
            <button type="submit" className="btn btn-primary ml-auto">
              Add {activeTab.slice(0, -1)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
