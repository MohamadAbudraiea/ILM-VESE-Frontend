import { useEffect } from "react";
import StudentNavbar from "../../components/student/StudentNavbar";
import useStudentStore from "../../store/studentStore";
import { Loader2 } from "lucide-react";

function StudentViewGrades() {
  const { grades, loading, error, fetchShowGrades } = useStudentStore();

  useEffect(() => {
    fetchShowGrades();
  }, [fetchShowGrades]);

  useEffect(() => {
    console.log("Grades data:", grades); // For debugging structure
  }, [grades]);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center pb-5">
      <StudentNavbar />
      <h1 className="text-4xl font-bold text-primary self-start mt-10 ml-5">
        My Grades
      </h1>

      <div className="p-6 space-y-8 w-full max-w-4xl bg-base-100 rounded-lg shadow-md mt-5">
        {loading && (
          <div className="flex justify-center text-primary">
            <Loader2 className="animate-spin" size={32} />
          </div>
        )}

        {error && <p className="mt-6 text-red-500">{error}</p>}

        {!loading && grades.length === 0 && (
          <p className="text-center text-gray-500">No grades available.</p>
        )}

        {/* Grades Table */}
        {!loading && grades.length > 0 && (
          <div className="overflow-x-auto rounded-md shadow-md bg-base-300">
            <table className="table w-full text-center">
              <thead className="bg-primary text-base-100 text-base">
                <tr>
                  <th>Course</th>
                  <th>Teacher</th>
                  <th>Term 1</th>
                  <th>Term 2</th>
                  <th>Term 3</th>
                  <th>Final</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((course, index) => (
                  <tr key={index}>
                    <td>{course.subject_name || "Unknown"}</td>
                    <td>{course.teacher || "Unknown"}</td>
                    {["First", "Second", "Third", "Final"].map((type) => {
                      const markObj = course.marks?.find(
                        (m) => m.type === type
                      );
                      return (
                        <td key={type}>
                          {markObj?.mark_value || "Not Marked"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentViewGrades;
