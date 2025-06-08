import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ParentNavBar from "../ParentNavBar";
import useParentsStore from "../../../store/ParentStore";

export default function ParentReviewQuiz() {
  const { course_id, quiz_id, student_id } = useParams();
  const { getStudentQuizMark } = useParentsStore();

  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentSubmission, setStudentSubmission] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      setLoading(true);
      try {
        const submission = await getStudentQuizMark(
          course_id,
          quiz_id,
          student_id
        );
        if (submission) {
          console.log(submission);
          setStudentSubmission(submission);

          setQuiz({
            title: submission.quiz_title,
            description: submission.quiz_description,
            total_points: submission.total_points,
            questions: submission.questions,
          });
        }
      } catch (err) {
        console.error("Error fetching quiz data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [course_id, quiz_id, getStudentQuizMark, student_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );
  }

  if (!quiz) return <div>No quiz data found</div>;
  if (!studentSubmission)
    return <div>No submission found for this student</div>;

  const totalQuestions = quiz.questions.length;
  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-base-200">
      <ParentNavBar />

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-primary">{quiz.title}</h1>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="font-bold">
              Final Mark: {studentSubmission.mark} / {quiz.total_points}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-2">Student Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-medium">Submitted At:</p>
              <p>{studentSubmission.submited_at}</p>
            </div>
            <div>
              <p className="font-medium">Final Grade:</p>
              <p>
                {studentSubmission.mark !== undefined
                  ? `${studentSubmission.mark} / ${quiz.total_points}`
                  : "Not graded"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-base-100 p-4 rounded-lg flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-full font-bold ${
                  currentQuestionIndex === index
                    ? "bg-primary text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
              }
              className="btn btn-secondary"
              disabled={currentQuestionIndex <= 0}
            >
              Prev
            </button>
            <button
              onClick={() =>
                setCurrentQuestionIndex((prev) =>
                  Math.min(prev + 1, totalQuestions - 1)
                )
              }
              className="btn btn-secondary"
              disabled={currentQuestionIndex >= totalQuestions - 1}
            >
              Next
            </button>
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center gap-4 mb-4">
            <p className="text-lg font-semibold">
              {currentQuestion?.question_text}
            </p>
            <span className="badge badge-primary">
              {currentQuestion.points} points
            </span>
          </div>

          {/* Redesigned Options */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">All Options:</h3>
            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.choices?.map((opt, idx) => {
                const isStudentAnswer =
                  opt.option_text === currentQuestion.choosed_answer;
                const isCorrect =
                  opt.option_text === currentQuestion.correct_answer;

                let borderColor = "border-gray-300";
                let bgColor = "bg-white";

                if (isStudentAnswer && isCorrect) {
                  borderColor = "border-green-500";
                  bgColor = "bg-green-50";
                } else if (isStudentAnswer && !isCorrect) {
                  borderColor = "border-red-500";
                  bgColor = "bg-red-50";
                } else if (!isStudentAnswer && isCorrect) {
                  borderColor = "border-green-500";
                  bgColor = "bg-green-100";
                }

                return (
                  <div
                    key={idx}
                    className={`p-4 border-2 ${borderColor} ${bgColor} rounded-lg shadow-sm`}
                  >
                    <p className="text-sm font-medium">{opt.option_text}</p>
                    {isStudentAnswer && (
                      <p className="text-xs mt-1 italic">
                        Student's Answer{" "}
                        {isCorrect ? "(Correct)" : "(Incorrect)"}
                      </p>
                    )}
                    {!isStudentAnswer && isCorrect && (
                      <p className="text-xs mt-1 italic text-green-700">
                        Correct Answer
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Points Earned */}
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-2">Points Earned:</h3>
            <div className="flex items-center gap-4">
              <p className="font-bold">
                {currentQuestion.choosed_answer ===
                currentQuestion.correct_answer
                  ? currentQuestion.points
                  : 0}{" "}
                / {currentQuestion.points}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
