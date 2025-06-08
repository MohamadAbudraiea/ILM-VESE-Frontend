import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTeacherStore } from "../../../store/TeacherStore";
import { Loader2 } from "lucide-react";

export default function QuizSubmitStatus() {
  const { getStudentsInCourse } = useTeacherStore();

  const navigate = useNavigate();
  const { course_id } = useParams();

  const location = useLocation();
  const quiz = location.state?.quiz;
  const submissions = quiz?.Submissions || [];

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch students in the course
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const studentList = await getStudentsInCourse(course_id);
        setStudents(studentList);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [course_id, getStudentsInCourse]);

  // Create a map of submissions by student_id for quick lookup
  // This allows us to easily check if a student has submitted and get their marks
  const submissionsMap = submissions.reduce((acc, submission) => {
    acc[submission.student_id] = submission;
    return acc;
  }, {});

  // Calculate submission statistics
  const totalStudents = students.length;
  const submittedCount = submissions.length;
  const submissionRate =
    totalStudents > 0 ? Math.round((submittedCount / totalStudents) * 100) : 0;

  // Compile student data with submission status and marks
  const compiledStudentData = students.map((student) => {
    const submission = submissionsMap[student.student_id];
    const hasSubmitted = !!submission;

    return {
      student_id: student.student_id,
      student_name: `${student.first_name} ${student.last_name}`,
      status: hasSubmitted ? "Submitted" : "Not Submitted",
      mark: hasSubmitted ? submission.mark : null,
      submitted_at: hasSubmitted ? submission.submited_at : null,
    };
  });

  // Handle review button click
  const handleReview = (student_id) => {
    const submission = submissionsMap[student_id];
    navigate(`/course/${course_id}/quizes/${quiz._id}/review/${student_id}`, {
      state: { quiz, submission },
    });
  };

  if (!quiz) {
    return (
      <div className="p-4 text-center text-red-500 font-semibold">
        No quiz data provided.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md">
      <div className="mb-8">
      {/* Header */}
        <h1 className="text-3xl font-bold text-primary mb-2">{quiz.title}</h1>
        <p className="text-lg mb-2">{quiz.description}</p>

        {/* Quiz details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Quiz date */}
          <div className="bg-base-100 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-700">Quiz Date</h3>
            <p>{`${quiz.start_date} at ${quiz.start_time}`}</p>
          </div>

          {/* Quiz duration */}
          <div className="bg-base-100 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-700">Duration</h3>
            <p>{quiz.duration} minutes</p>
          </div>

          {/* Total points */}
          <div className="bg-base-100 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-700">Total Points</h3>
            <p>{quiz.total_points}</p>
          </div>
        </div>

        {/* Submission status and quiz visibility */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Submission Status */}
          <div className="bg-base-100 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-700">Submission Status</h3>
            <div className="flex items-center mt-2">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-600 h-4 rounded-full"
                  style={{ width: `${submissionRate}%` }}
                ></div>
              </div>
              <span className="ml-2 font-medium">
                {submittedCount}/{totalStudents} ({submissionRate}%)
              </span>
            </div>
          </div>

          {/* Quiz Visibility */}
          <div className="bg-base-100 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-700">Quiz Visibility</h3>
            <p
              className={quiz.able_to_view ? "text-green-600" : "text-red-600"}
            >
              {quiz.able_to_view
                ? "Visible to students"
                : "Not visible to students"}
            </p>
          </div>
        </div>
      </div>

      {/* Student Submissions Table */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Student Submissions
      </h2>
      <div className="overflow-x-auto rounded-lg">
        <table className="table table-zebra shadow-sm text-center">
          <thead className="bg-primary text-base-100">
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Status</th>
              <th>Marks</th>
              <th>Submitted At</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
            {compiledStudentData.map((student) => (
              <tr key={student.student_id} className="hover:bg-gray-50">
                <td>{student.student_id}</td>
                <td>{student.student_name}</td>
                <td>
                  <span
                    className={
                      student.status === "Submitted"
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {student.status}
                  </span>
                </td>
                <td>
                  {student.mark !== null
                    ? `${student.mark} / ${quiz.total_points}`
                    : "—"}
                </td>
                <td>{student.submitted_at ? student.submitted_at : "—"}</td>
                <td>
                  {student.status === "Submitted" ? (
                    <button
                      onClick={() => handleReview(student.student_id)}
                      className="btn btn-primary btn-sm"
                    >
                      Review
                    </button>
                  ) : (
                    <span className="text-gray-600">Not Submitted</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
