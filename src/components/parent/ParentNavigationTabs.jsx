import { useNavigate, useLocation, useParams } from "react-router-dom";

function ParentNavigationTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { course_id, student_id } = useParams();

  const pathSegments = location.pathname.split("/").filter(Boolean);

  const isUnitsTabActive = pathSegments.includes("content");

  const basePath = `/parent-course-content/${course_id}/${student_id}`;

  const isTabActive = (tabPath) =>
    location.pathname.startsWith(`${basePath}/${tabPath}`);

  return (
    <div className="tabs tabs-boxed items-center bg-base-100 mb-6 shadow-md overflow-x-auto">
      <button
        onClick={() =>
          navigate(`/parent-course-content/${course_id}/${student_id}/parent-overview`, {
            state: { unit: location.state?.unit },
          })
        }
        className={`w-full h-14 text-lg tab ${
          isTabActive("parent-overview")
            ? "bg-accent text-primary"
            : "text-gray-600"
        }`}
      >
        Overview
      </button>

      <button
        disabled={!isUnitsTabActive}
        className={`w-full h-14 text-lg tab ${
          isUnitsTabActive
            ? "bg-accent text-primary border-yellow-500"
            : "text-gray-600 border-transparent"
        }`}
      >
        Content
      </button>

      <button
        onClick={() =>
          navigate(
            `/parent-course-content/${course_id}/${student_id}/parent-assignments`,
            {
              state: { unit: location.state?.unit },
            }
          )
        }
        className={`w-full h-14 text-lg tab ${
          isTabActive("parent-assignments")
            ? "bg-accent text-primary"
            : "text-gray-600"
        }`}
      >
        Assignments
      </button>

      <button
        onClick={() =>
          navigate(`/parent-course-content/${course_id}/${student_id}/parent-quizzes`, {
            state: { unit: location.state?.unit },
          })
        }
        className={`w-full h-14 text-lg tab ${
          isTabActive("parent-quizzes")
            ? "bg-accent text-primary"
            : "text-gray-600"
        }`}
      >
        Quizzes
      </button>
    </div>
  );
}

export default ParentNavigationTabs;
