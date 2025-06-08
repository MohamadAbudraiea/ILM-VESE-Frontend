import { useEffect, useState } from "react";
import AdminNavbar from "../../components/admin/adminNavbar";
import { useAdminStore } from "../../store/AdminStore";
import { useCourseStore } from "../../store/CourseStore";

function TakeAbsence() {
  const { getAllGrades, allGrades, getAllSections, allSectionsInGrade } =
    useAdminStore();
  const { getStudentsInSection, studentsInSection, getAbsence, updateAbsence } =
    useCourseStore();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [absentStudents, setAbsentStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Fetch the grades on mount
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        await getAllGrades();
      } catch {
        setMessage({ text: "Failed to load grades", type: "error" });
      }
    };
    fetchGrades();
  }, [getAllGrades]);

  // Fetch sections when grade is selected
  useEffect(() => {
    if (selectedGrade) {
      const fetchSections = async () => {
        try {
          await getAllSections(selectedGrade.grade_id);
        } catch {
          setMessage({ text: "Failed to load sections", type: "error" });
        }
      };
      fetchSections();
    }
  }, [selectedGrade, getAllSections]);

  // Fetch students when grade and section are selected
  useEffect(() => {
    if (selectedGrade && selectedSection) {
      const fetchStudents = async () => {
        try {
          await getStudentsInSection(selectedSection.section_id);
        } catch {
          setMessage({ text: "Failed to load students", type: "error" });
        }
      };
      fetchStudents();
    }
  }, [getStudentsInSection, selectedGrade, selectedSection]);

  // Fetch absence data when section or date changes
  useEffect(() => {
    if (selectedSection?.section_id && selectedDate) {
      const fetchAbsenceData = async () => {
        setIsLoading(true);
        try {
          const response = await getAbsence(
            selectedSection.section_id,
            selectedDate
          );
          if (response) {
            const absentIds = response
              .filter((student) => student.isAbsence)
              .map((student) => student.student_id);
            setAbsentStudents(absentIds);
          }
        } catch (error) {
          if (error.response?.status !== 404) {
            setMessage({ text: "Failed to load absence data", type: "error" });
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchAbsenceData();
    }
  }, [selectedSection, selectedDate, getAbsence]);

  const handleGradeChange = (e) => {
    const gradeId = e.target.value;
    const grade = allGrades.find((g) => g.grade_id === gradeId) || null;
    setSelectedGrade(grade);
    setSelectedSection(null);
    setAbsentStudents([]);
    setMessage({ text: "", type: "" });
  };

  const handleSectionChange = (e) => {
    const sectionId = e.target.value;
    const section =
      allSectionsInGrade.find((s) => s.section_id === sectionId) || null;
    setSelectedSection(section);
    setAbsentStudents([]);
    setMessage({ text: "", type: "" });
  };

  const toggleAbsence = (studentId) => {
    setAbsentStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedGrade || !selectedSection) {
      setMessage({ text: "Please select all fields", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const students = studentsInSection.map((student) => ({
        student_id: student.student_id,
        isAbsence: absentStudents.includes(student.student_id),
      }));

      await updateAbsence(students, selectedSection.section_id, selectedDate);

      setMessage({ text: "Absence recorded successfully!", type: "success" });
    } catch (error) {
      console.error("Error submitting absence:", error);
      setMessage({
        text: error.response.data.error || "Failed to record absence",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-primary">Take Absence</h1>

        {message.text && message.type == "success" && (
          <div className={`alert alert-success mb-4`}>{message.text}</div>
        )}

        {message.text && message.type == "error" && (
          <div className={`alert alert-error mb-4`}>{message.text}</div>
        )}

        {/* Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="font-medium mb-1 block">Select Date</label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div>
            <label className="font-medium mb-1 block">Select Grade</label>
            <select
              className="select select-bordered w-full"
              value={selectedGrade?.grade_id || ""}
              onChange={handleGradeChange}
              disabled={isLoading}
            >
              <option value="">-- Choose Grade --</option>
              {allGrades.map((grade) => (
                <option key={grade.grade_id} value={grade.grade_id}>
                  {grade.grade_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium mb-1 block">Select Section</label>
            <select
              className="select select-bordered w-full"
              value={selectedSection?.section_id || ""}
              onChange={handleSectionChange}
              disabled={!selectedGrade || isLoading}
            >
              <option value="">-- Choose Section --</option>
              {allSectionsInGrade.map((section) => (
                <option key={section.section_id} value={section.section_id}>
                  {section.section_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Students */}
        {selectedGrade && selectedSection && selectedDate && (
          <div className="bg-base-100 p-4 rounded-md shadow">
            <h2 className="text-xl font-semibold mb-4">Mark Absence</h2>
            {isLoading ? (
              <div className="flex justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <ul className="space-y-2">
                {studentsInSection.length > 0 ? (
                  studentsInSection.map((student) => (
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
                  ))
                ) : (
                  <div>there is no students in this section!</div>
                )}
              </ul>
            )}
          </div>
        )}

        <button
          className="btn btn-primary mt-6 w-full md:w-1/2"
          onClick={handleSubmit}
          disabled={
            !selectedDate || !selectedGrade || !selectedSection || isLoading
          }
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
