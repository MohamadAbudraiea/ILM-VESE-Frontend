import React, { useCallback, useEffect, useState } from "react";
import StudentNavbar from "../../components/student/StudentNavbar";
import TeacherNavbar from "../../components/teacher/TeacherNavbar";
import ParentNavBar from "../../components/parent/ParentNavBar";
import HomeNav from "../../components/shared/HomeNav";
import EventList from "../../components/shared/EventList";
import { useAuthStore } from "../../store/AuthStore";
import { useSharedStore } from "../../store/SharedStore";
import { Loader2 } from "lucide-react";

function SharedEvents() {
  const [events, setEvents] = useState({});
  const [currentYear, setCurrentYear] = useState("2025");

  const { authStudent, authTeacher, authParent } = useAuthStore();

  const { isFetchingEvents, getAllEvents } = useSharedStore();

  // Fetch events from the store and group by year
  const fetchEvents = useCallback(async () => {
    try {
      const data = await getAllEvents();
      if (data) {
        const grouped = data.data.reduce((acc, event) => {
          const year = new Date(event.eventdate).getFullYear().toString();
          if (!acc[year]) acc[year] = [];
          acc[year].push(event);
          return acc;
        }, {});
        setEvents(grouped);

        if (!grouped[currentYear]) {
          const latestYear = Object.keys(grouped).sort().reverse()[0];
          setCurrentYear(latestYear);
        }
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  }, [getAllEvents, currentYear]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Header/Navigation */}
      {authStudent && <StudentNavbar />}
      {authTeacher && <TeacherNavbar />}
      {authParent && <ParentNavBar />}
      {!authStudent && !authTeacher && !authParent && <HomeNav />}

      {/* Main Content */}
      <div className="flex-grow p-4 md:p-8">
        <h1 className="text-3xl font-bold text-center mb-8">School Events</h1>

        {/* Year Filter */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
          {Object.keys(events).map((year) => (
            <button
              key={year}
              onClick={() => setCurrentYear(year)}
              className={`px-4 py-2 rounded transition-colors ${
                currentYear === year
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {isFetchingEvents && (
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="animate-spin" size={50} />
          </div>
        )}

        {/* Events List */}
        <EventList events={events} currentYear={currentYear} />
      </div>
    </div>
  );
}

export default SharedEvents;
