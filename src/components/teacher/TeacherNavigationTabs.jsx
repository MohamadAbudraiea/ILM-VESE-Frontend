import { useNavigate, useLocation } from "react-router-dom";

function TeacherNavigationTabs() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const courseID = pathSegments[1];

  const navigate = useNavigate();
  const basePath = `/teacher-course-content/${courseID}`;

  const isTabActive = (tabPath) =>
    location.pathname.startsWith(`${basePath}/${tabPath}`);

  return (
    <div className="tabs tabs-boxed items-center bg-base-100 mb-6 shadow-md overflow-x-auto">
      <button
        onClick={() => navigate(`${basePath}/teacher-course-students`)}
        className={`w-full h-14 text-lg tab ${
          isTabActive("teacher-course-students")
            ? "bg-accent text-primary"
            : "text-gray-600"
        }`}
      >
        Students
      </button>
      <button
        onClick={() => navigate(`${basePath}/teacher-overview`)}
        className={`w-full h-14 text-lg tab ${
          isTabActive("teacher-overview")
            ? "bg-accent text-primary"
            : "text-gray-600"
        }`}
      >
        Overview
      </button>
      <button
        onClick={() => navigate(`${basePath}/teacher-unit-content`)}
        disabled={!isTabActive("teacher-unit-content")}
        className={`w-full h-14 text-lg tab ${
          isTabActive("teacher-unit-content")
            ? "bg-accent text-primary"
            : "text-gray-600"
        }`}
      >
        Content
      </button>
      <button
        onClick={() => navigate(`${basePath}/teacher-assignments`)}
        className={`w-full h-14 text-lg tab ${
          isTabActive("teacher-assignments") || isTabActive("assignment-detail")
            ? "bg-accent text-primary"
            : "text-gray-600"
        }`}
      >
        {isTabActive("assignment-detail") ? "Assignment Detail" : "Assignments"}
      </button>
      <button
        onClick={() => navigate(`${basePath}/teacher-quizzes`)}
        className={`w-full h-14 text-lg tab ${
          isTabActive("teacher-quizzes") || isTabActive("quiz-submit-status")
            ? "bg-accent text-primary"
            : "text-gray-600"
        }`}
      >
        {isTabActive("quiz-submit-status") ? "Quiz Submit Status" : "Quizzes"}
      </button>
    </div>
  );
}

export default TeacherNavigationTabs;
