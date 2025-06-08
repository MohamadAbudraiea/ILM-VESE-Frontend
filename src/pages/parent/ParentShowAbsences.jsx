import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ParentNavBar from "../../components/parent/ParentNavBar";
import useParentsStore from "../../store/ParentStore";
import { AlertCircle, XCircle } from "lucide-react";

function ParentShowAbsences() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const student_id = searchParams.get("student_id");
  const section_id = searchParams.get("section_id");

  const { fetchShowAbsences, absence, loading, error } = useParentsStore();

  useEffect(() => {
    if (student_id && section_id) {
      fetchShowAbsences(student_id, section_id);
    }
  }, [student_id, section_id, fetchShowAbsences]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDayOfWeek = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: "long",
    });
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center pb-5">
      <ParentNavBar />

      <div className="p-6 space-y-6 w-full max-w-5xl bg-base-100 rounded-lg shadow-md mt-5">
        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-bold text-primary">Student Absences</h2>
          <button onClick={() => navigate(-1)} className="btn btn-ghost">
            ← Back to Dashboard
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error shadow-lg">
            <div>
              <XCircle className="stroke-current flex-shrink-0 h-6 w-6" />

              <span>Error: {error}</span>
            </div>
            <button
              className="btn btn-sm"
              onClick={() => fetchShowAbsences(student_id, section_id)}
            >
              Retry
            </button>
          </div>
        ) : absence?.count > 0 ? (
          <>
            <div className="stats bg-base-300 text-base-content shadow">
              <div className="stat">
                <div className="stat-title text-base-content font-semibold">
                  Total Absences
                </div>
                <div className="stat-value text-4xl font-bold">
                  {absence.count}
                </div>
                <div className="stat-desc text-sm">Current Academic Year</div>
              </div>
            </div>

            <div className="overflow-x-auto bg-base-200 rounded-lg shadow">
              <table className="table w-full">
                <thead>
                  <tr className="bg-primary text-primary-content">
                    <th>#</th>
                    <th>Date</th>
                    <th>Day</th>
                  </tr>
                </thead>
                <tbody>
                  {absence.dates.map((date, index) => (
                    <tr key={index} className="hover:bg-base-300">
                      <th>{index + 1}</th>
                      <td>{formatDate(date)}</td>
                      <td>{getDayOfWeek(date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="alert alert-info shadow-lg flex justify-center">
            <AlertCircle className="stroke-current flex-shrink-0 h-6 w-6" />
            <span>No absence records found for this student.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ParentShowAbsences;
