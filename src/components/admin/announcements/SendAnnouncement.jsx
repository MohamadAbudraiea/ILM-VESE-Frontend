import { useState } from "react";
import { useAdminStore } from "../../../store/AdminStore";

function SendAnnouncement({ depts, onSend }) {
  const { addAnnoucments } = useAdminStore();

  const [announcementText, setAnnouncementText] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await addAnnoucments(selectedGroup, announcementText);
      const newAnnouncement = {
        id: response.announcmentid,
        text: response.content,
        group: response.department_id ?? "general",
        date: response.announcmentdate,
        time: response.sentat,
        sender: "You",
      };

      onSend(newAnnouncement);
      setAnnouncementText("");
      setSelectedGroup("");
    } catch (err) {
      console.error("Failed to send announcement", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral mb-1">
          Announcement Message
        </label>
        <textarea
          placeholder="Type your announcement here..."
          value={announcementText}
          onChange={(e) => setAnnouncementText(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg"
          rows={5}
          required
        />
      </div>

      <div>
        <h3 className="text-sm font-medium text-neutral mb-2">Target Group</h3>
        <div className="grid grid-cols-2 gap-2">
          {depts.map((department) => (
            <button
              key={department.department_id}
              type="button"
              onClick={() => setSelectedGroup(department.department_id)}
              className={`px-3 py-2 text-sm rounded-md border ${
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

      <button
        type="submit"
        disabled={!announcementText || !selectedGroup || isLoading}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          !announcementText || !selectedGroup || isLoading
            ? "bg-gray-500 text-base-300 cursor-not-allowed"
            : "bg-primary text-base-100 hover:bg-primary/90"
        }`}
      >
        {isLoading ? "Sending..." : "Send Announcement"}
      </button>
    </form>
  );
}

export default SendAnnouncement;
