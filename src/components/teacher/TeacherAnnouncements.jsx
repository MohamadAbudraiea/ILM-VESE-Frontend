import { useEffect, useState } from "react";
import { X, Filter } from "lucide-react";
import { useTeacherStore } from "../../store/TeacherStore";

function TeacherAnnouncements({ isOpen, onClose }) {
  const { getTeacherDepartment, getAnnoucments } = useTeacherStore();

  const [announcements, setAnnouncements] = useState([]);
  const [teacherDept, setTeacherDept] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("general");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const dept = await getTeacherDepartment();
        setTeacherDept(dept);

        const targetGroup = selectedGroup || "general";
        const data = await getAnnoucments(targetGroup);

        const formatted = data
          .map((a) => ({
            id: a.announcmentid,
            text: a.content,
            group: a.department_id ?? "general",
            department_id: a.department_id,
            sender: a.admin?.full_name ?? "Unknown",
            date: a.announcmentdate,
            time: a.sentat,
            timestamp: new Date(`${a.announcmentdate}T${a.sentat}`).getTime(),
          }))
          .sort((a, b) => b.timestamp - a.timestamp);

        setAnnouncements(formatted);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getTeacherDepartment, getAnnoucments, selectedGroup]);

  if (!isOpen) return null;

  const depts = [
    { department_id: "general", name: "General" },
    ...(teacherDept ? [teacherDept] : []),
  ];

  const filtered =
    selectedGroup === "" || selectedGroup === "general"
      ? announcements
      : announcements.filter((a) => a.group === selectedGroup);

  return (
    <div className="fixed inset-0 md:left-auto md:right-0 w-full md:w-1/2 md:border-base-200 h-full bg-base-100 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center bg-primary text-base-100 px-6 py-4">
        <h2 className="text-xl font-bold">Announcements</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-primary/80 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Filter */}
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

        {/* Announcements */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : filtered.length > 0 ? (
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
                  {a.sender && (
                    <div className="mb-1 text-xs text-neutral/60">
                      Sent by: {a.sender}
                    </div>
                  )}
                  <p className="text-neutral">{a.text}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-secondary text-primary rounded-full">
                        {depts.find((d) => d.department_id === a.group)?.name ||
                          "General"}
                      </span>
                      {a.group === "general" && a.department_id && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-accent text-primary rounded-full">
                          {depts.find(
                            (d) => d.department_id === a.department_id
                          )?.name || a.department_id}
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
            <div className="text-center py-8 text-neutral/50">
              No announcements found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherAnnouncements;
