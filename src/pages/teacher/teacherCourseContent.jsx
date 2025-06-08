import { Outlet, useParams } from "react-router-dom";
import TeacherNavbar from "../../components/teacher/TeacherNavbar";
import TeacherNavigationTabs from "../../components/teacher/TeacherNavigationTabs";
import { useEffect } from "react";
import { useTeacherStore } from "../../store/TeacherStore";
import { useState } from "react";
import { Loader2, XCircle } from "lucide-react";

function TeacherCourseContent() {
  const { course_id } = useParams();
  const { getCourseByID } = useTeacherStore();

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch course content
  useEffect(() => {
    const fetchCourseContent = async () => {
      setIsLoading(true);
      try {
        const courseData = await getCourseByID(course_id);
        setCourse(courseData);
        setError(null);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseContent();
  }, [course_id, getCourseByID]);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col justify-start pb-5">
      <TeacherNavbar />
      <div className="container mx-auto p-6 mt-16">
        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : error ? (
          <div className="alert alert-error shadow-lg">
            <div>
              <XCircle className="h-6 w-6 text-red-500" />
              <span>{error}</span>
            </div>
          </div>
        ) : (
          <>
            {/* Course Header */}
            <div className="bg-primary flex flex-col items-center rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-3xl text-accent font-bold mb-2">
                {course?.subject_name || "Untitled Course"}
              </h1>
            </div>

            {/* NavigationTabs */}
            <TeacherNavigationTabs to="teacher-course-content" />

            {/* Tab Content */}
            <Outlet />
          </>
        )}
      </div>
    </div>
  );
}

export default TeacherCourseContent;
