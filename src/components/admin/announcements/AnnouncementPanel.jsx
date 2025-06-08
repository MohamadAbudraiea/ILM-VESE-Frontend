import { useEffect, useState } from "react";
import { X, Send, List } from "lucide-react";
import { useAdminStore } from "../../../store/AdminStore";
import { useCallback } from "react";

import SendAnnouncement from "./SendAnnouncement";
import ViewAnnouncements from "./ViewAnnouncements";

function AnnouncementPanel({ isOpen, onClose }) {
  const { getAllDepartments, getAnnoucments } = useAdminStore();

  const [depts, setDepts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [activeTab, setActiveTab] = useState("send");
  const [selectedGroup, setSelectedGroup] = useState("general");
  const [isLoading, setIsLoading] = useState(false);

  // fetch all departments and add "General" department
  useEffect(() => {
    const fetchDepts = async () => {
      const allDepts = await getAllDepartments();
      const departmentsWithGeneral = [
        { department_id: "general", name: "General" },
        ...allDepts.data,
      ];
      setDepts(departmentsWithGeneral);
    };
    fetchDepts();
  }, [getAllDepartments]);

  // Fetch announcements when the panel is opened or when the selected group changes
  const fetchAnnouncements = useCallback(async () => {
    setIsLoading(true);
    try {
      const deptId = selectedGroup || "general";
      const data = await getAnnoucments(deptId);

      const mapped = data.map((a) => ({
        id: a.announcmentid,
        text: a.content,
        group: a.department_id ?? "general",
        department_id: a.department_id,
        sender: a.admin?.full_name ?? "Unknown",
        date: a.announcmentdate,
        time: a.sentat,
      }));

      setAnnouncements(mapped);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedGroup, getAnnoucments]);

  // Fetch announcements when the panels active tab is"view"
  useEffect(() => {
    if (isOpen && activeTab === "view") {
      fetchAnnouncements();
    }
  }, [isOpen, activeTab, selectedGroup, fetchAnnouncements]);

  // Handle sending a new announcement
  const handleSend = async (newAnnouncement) => {
    try {
      setIsLoading(true);
      setAnnouncements((prev) => [...prev, newAnnouncement]);
      setActiveTab("view");
      setSelectedGroup(newAnnouncement.group);
    } catch (error) {
      console.error("Error sending announcement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 md:left-auto md:right-0 w-full md:w-1/2 md:border-base-200 h-full bg-base-100 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center bg-primary text-base-100 px-6 py-4">
        <h2 className="text-xl font-bold">
          {activeTab === "send" ? "New Announcement" : "Announcements"}
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-primary/80 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-3 font-medium flex items-center justify-center gap-2 ${
            activeTab === "send"
              ? "text-primary border-b-2"
              : "text-neutral hover:text-primary"
          }`}
          onClick={() => setActiveTab("send")}
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
        <button
          className={`flex-1 py-3 font-medium flex items-center justify-center gap-2 ${
            activeTab === "view"
              ? "text-primary border-b-2"
              : "text-neutral hover:text-primary"
          }`}
          onClick={() => setActiveTab("view")}
        >
          <List className="w-4 h-4" />
          <span>View</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : activeTab === "send" ? (
          <SendAnnouncement
            depts={depts}
            onSend={handleSend}
            isLoading={isLoading}
          />
        ) : (
          <ViewAnnouncements
            announcements={announcements}
            depts={depts}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            setActiveTab={setActiveTab}
            fetchAnnouncements={fetchAnnouncements}
          />
        )}
      </div>
    </div>
  );
}

export default AnnouncementPanel;
