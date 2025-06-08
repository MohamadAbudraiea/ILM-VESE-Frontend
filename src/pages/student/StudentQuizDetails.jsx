import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StudentNavbar from "../../components/student/StudentNavbar";
import useStudentStore from "../../store/studentStore";
import { Loader2 } from "lucide-react";

export default function QuizDetails() {
  const { course_id, quiz_id } = useParams();
  const navigate = useNavigate();

  const { getQuizToStart, loading, error, submitQuiz } = useStudentStore();

  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      const quizData = await getQuizToStart(course_id, quiz_id);
      if (
        Array.isArray(quizData) &&
        quizData.length > 0 &&
        quizData[0]?.questions
      ) {
        setQuiz(quizData[0]);
        setTimeRemaining(quizData[0].duration * 60);
      } else {
        console.error("Invalid quiz data:", quizData);
      }
    };
    fetchQuiz();
  }, [course_id, quiz_id, getQuizToStart]);

  const handleSubmit = useCallback(() => {
    const submitAnswers = async () => {
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, selectedOptionText]) => {
          const question = quiz.questions.find((q) => q._id === questionId);
          const selectedOption = question.options.find(
            (opt) => opt.option_text === selectedOptionText
          );

          return {
            _id: questionId,
            choosed_answer: {
              _id: selectedOption?._id,
              choosed_answer: selectedOptionText,
            },
            question_text: question.question_text,
          };
        }
      );

      await submitQuiz(course_id, quiz_id, { answers: formattedAnswers });
    };
    submitAnswers();
    setShouldSubmit(true);
  }, [answers, course_id, quiz?.questions, quiz_id, submitQuiz]);

  // Timer effect
  useEffect(() => {
    if (!quiz) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSubmit, quiz]);

  useEffect(() => {
    if (shouldSubmit) {
      navigate("/student-dashboard");
    }
  }, [shouldSubmit, navigate]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const isAnswered = (index) => {
    const questionId = quiz?.questions?.[index]?._id;
    return answers[questionId] !== undefined;
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNavigateTo = (index) => {
    setCurrentQuestionIndex(index);
  };

  const deleteAnswer = (questionId) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );
  }
  if (error) return <div>Error loading quiz: {error}</div>;
  if (!quiz || !quiz.questions || quiz.questions.length === 0)
    return <div>No quiz data found</div>;

  const totalQuestions = quiz.questions.length;
  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-base-200 flex flex-col justify-start pb-5">
      <StudentNavbar />

      <div className="container mx-auto p-6">
        <p className="text-xl font-bold text-primary">{quiz.title}</p>
        <p className="text-sm text-gray-600">{quiz.description}</p>

        <div className="bg-white rounded-lg p-6 mt-5 shadow-md mb-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-col font-bold gap-2">
            <p className="mt-2">Course: {course_id}</p>
            <p
              className={`${
                timeRemaining <= quiz.duration * 60 * 0.3
                  ? "text-red-600 font-bold"
                  : ""
              }`}
            >
              Time Remaining: {formatTime(timeRemaining)}
            </p>
          </div>
          <div className="flex flex-col font-bold gap-2">
            <p>Total Questions: {totalQuestions}</p>
            <p>Points: {quiz.total_points}</p>
          </div>
          <div className="">
            <button
              className="btn btn-secondary text-white"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="w-full bg-base-100 h-10 rounded-3xl overflow-hidden mb-6 relative">
          <div
            className="bg-green-600 h-full absolute top-0 left-0 transition-all duration-300"
            style={{
              width: `${(Object.keys(answers).length / totalQuestions) * 100}%`,
            }}
          ></div>

          <div className="relative z-10 h-full flex items-center justify-center text-sm font-medium text-base-300">
            {Object.keys(answers).length} of {totalQuestions} questions answered
          </div>
        </div>

        {/* MCQ Question */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center gap-4 mb-4">
            <p className="text-lg font-semibold">
              {currentQuestion.question_text}
            </p>
            <span className="badge badge-primary">
              {currentQuestion.points} points
            </span>
          </div>

          <div className="ml-14 space-y-3">
            {currentQuestion.options.map((option) => (
              <div key={option._id} className="flex items-center gap-3">
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  className="radio radio-primary"
                  value={option.option_text}
                  checked={answers[currentQuestion._id] === option.option_text}
                  onChange={() =>
                    handleOptionChange(currentQuestion._id, option.option_text)
                  }
                />
                <label className="text-base">{option.option_text}</label>
              </div>
            ))}

            {answers[currentQuestion._id] && (
              <button
                className="link-hover ml-4"
                onClick={() => deleteAnswer(currentQuestion._id)}
              >
                Delete Answer
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-base-100 p-4 rounded-lg flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-2 flex-wrap">
            {quiz.questions.map((q, index) => (
              <button
                key={q._id}
                onClick={() => handleNavigateTo(index)}
                className={`w-10 h-10 rounded-full font-bold ${
                  currentQuestionIndex === index
                    ? "bg-primary text-white"
                    : isAnswered(index)
                    ? "bg-secondary text-white"
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
      </div>
    </div>
  );
}
