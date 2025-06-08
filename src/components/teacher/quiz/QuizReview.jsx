import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useTeacherStore } from "../../../store/TeacherStore";
import TeacherNavbar from "../TeacherNavbar";
import { Loader2 } from "lucide-react";

export default function QuizReview() {
  const { getStudentQuizMark } = useTeacherStore();

  const { course_id, quiz_id, student_id } = useParams();
  const location = useLocation();


  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentSubmission, setStudentSubmission] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch quiz data from location state
  useEffect(() => {
    if (location.state?.quiz) {
      setQuiz(location.state.quiz);
    }
  }, [location.state]);

  // Fetch student submission data
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const submission = await getStudentQuizMark(
          course_id,
          quiz_id,
          student_id
        );
        if (submission) {
          setStudentSubmission(submission);
        }
      } catch (err) {
        console.error("Error fetching quiz data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [course_id, quiz_id, student_id, getStudentQuizMark]);

  // Handlers for navigating through the next question
  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // Handler for going to the previous question
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Handler for navigating to a specific question
  const handleNavigateTo = (index) => {
    setCurrentQuestionIndex(index);
  };

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
  const currentSubmission = studentSubmission.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-base-200 flex flex-col justify-start pb-5">
      <TeacherNavbar />

      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">{quiz.title}</h1>
            <p className="text-gray-600">
              Reviewing submission for: {student_id}
            </p>
          </div>
          <div className="bg-base-100 p-3 rounded-lg shadow-sm">
            <p className="font-bold">
              Final Mark: {studentSubmission.mark} / {quiz.total_points}
            </p>
          </div>
        </div>

        {/* Student Info */}
        <div className="bg-base-100 rounded-lg p-4 shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-2">Student Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-medium">Student ID:</p>
              <p>{student_id}</p>
            </div>

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
                onClick={() => handleNavigateTo(index)}
                className={`w-10 h-10 rounded-full font-bold ${
                  currentQuestionIndex === index
                    ? "bg-primary text-base-100"
                    : "bg-gray-300 text-black"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="btn btn-secondary"
              disabled={currentQuestionIndex <= 0}
            >
              Prev
            </button>
            <button
              onClick={handleNext}
              className="btn btn-secondary"
              disabled={currentQuestionIndex >= totalQuestions - 1}
            >
              Next
            </button>
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-base-100 p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center gap-4 mb-4">
            <p className="text-lg font-semibold">
              {currentSubmission?.question_text}
            </p>
            <span className="badge badge-primary">
              {currentQuestion.points} points
            </span>
          </div>

          {/* Redesigned Answer Options */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">All Options:</h3>
            <div className="grid grid-cols-1 gap-4">
              {currentSubmission.choices.map((choice, idx) => {
                const isStudentAnswer =
                  choice.option_text === currentSubmission.choosed_answer;
                const isCorrectAnswer =
                  choice.option_text === currentSubmission.correct_answer;

                let borderColor = "border-gray-300";
                let bgColor = "bg-base-100";
                let label = null;

                if (isStudentAnswer && isCorrectAnswer) {
                  borderColor = "border-green-500";
                  bgColor = "bg-green-50";
                  label = "Student's Answer (Correct)";
                } else if (isStudentAnswer && !isCorrectAnswer) {
                  borderColor = "border-red-500";
                  bgColor = "bg-red-50";
                  label = "Student's Answer (Incorrect)";
                } else if (!isStudentAnswer && isCorrectAnswer) {
                  borderColor = "border-green-500";
                  bgColor = "bg-green-100";
                  label = "Correct Answer";
                }

                return (
                  <div
                    key={idx}
                    className={`p-4 border-2 ${borderColor} ${bgColor} rounded-lg shadow-sm`}
                  >
                    <p className="text-sm font-medium">{choice.option_text}</p>
                    {label && (
                      <p className="text-xs mt-1 italic text-gray-600">
                        {label}
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
                {currentSubmission.choosed_answer ===
                currentSubmission.correct_answer
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
