import { useState } from "react";
import TeacherNavbar from "../../components/teacher/TeacherNavbar";
import { useEffect } from "react";
import { useAuthStore } from "../../store/AuthStore";
import { Loader2 } from "lucide-react";
import { useTeacherStore } from "../../store/TeacherStore";

function TakeAbsence() {
  const { checkAuth, isCheckingAuth, authTeacher } = useAuthStore();
  const {
    getStudentsInSection,
    studentsInSection,
    getAbsenceForTeacher,
    updateAbsenceForTeacher,
  } = useTeacherStore();

  const [selectedDate, setSelectedDate] = useState("");
  const [absentStudents, setAbsentStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (selectedDate) {
      const fetchStudents = async () => {
        try {
          await getStudentsInSection(authTeacher.section_id);
        } catch {
          setMessage({ text: "Failed to load students", type: "error" });
        }
      };
      fetchStudents();
    }
  }, [authTeacher.section_id, getStudentsInSection, selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      const fetchAbsenceData = async () => {
        setIsLoading(true);
        try {
          const response = await getAbsenceForTeacher(selectedDate);
          if (response) {
            const absentIds = response
              .filter((student) => student.isAbsence)
              .map((student) => student.student_id);
            setAbsentStudents(absentIds);
          }
        } catch (error) {
          console.error("Error fetching absence data:", error);
          // Don't show error if it's just that no record exists yet
          if (error.response?.status !== 404) {
            setMessage({ text: "Failed to load absence data", type: "error" });
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchAbsenceData();
    }
  }, [selectedDate, getAbsenceForTeacher]);

  const toggleAbsence = (student_id) => {
    setAbsentStudents((prev) =>
      prev.includes(student_id)
        ? prev.filter((id) => id !== student_id)
        : [...prev, student_id]
    );
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      setMessage({ text: "Please select all fields", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const students = studentsInSection.map((student) => ({
        student_id: student.student_id,
        isAbsence: absentStudents.includes(student.student_id),
      }));

      await updateAbsenceForTeacher(students, selectedDate);

      setMessage({ text: "Absence recorded successfully!", type: "success" });
    } catch (error) {
      console.error("Error submitting absence:", error);
      setMessage({ text: "Failed to record absence", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <TeacherNavbar />

      <div className="p-8 max-w-4xl mx-auto felx flex-col items-start">
        <h1 className="text-3xl font-bold mb-6 text-primary">Take Absence</h1>

        {message.text && message.type == "success" && (
          <div className={`alert alert-success mb-4`}>{message.text}</div>
        )}

        {message.text && message.type == "error" && (
          <div className={`alert alert-error mb-4`}>{message.text}</div>
        )}

        <div className="mb-6">
          <label className="font-medium mb-1 block">Select Date</label>
          <input
            type="date"
            className="input input-bordered w-full md:w-1/2"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {selectedDate && (
          <div className="bg-base-100 p-4 rounded-md shadow">
            <h2 className="text-xl font-semibold mb-4">Mark Absence</h2>
            {isLoading && !studentsInSection.length ? (
              <div className="flex justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <ul className="space-y-2">
                {studentsInSection.map((student) => (
                  <li
                    key={student.student_id}
                    className="flex items-center gap-4"
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={absentStudents.includes(student.student_id)}
                      onChange={() => toggleAbsence(student.student_id)}
                      disabled={isLoading}
                    />
                    <span>
                      {student.first_name} {student.last_name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <button
          className="btn btn-primary mt-6 w-full md:w-1/2"
          onClick={handleSubmit}
          disabled={!selectedDate}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner"></span>
              Submitting...
            </>
          ) : (
            "Submit Absence"
          )}
        </button>
      </div>
    </div>
  );
}

export default TakeAbsence;
