import { useState, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import StudentNavigationTabs from "../../components/student/StudentNavigationTabs";
import useStudentStore from "../../store/studentStore";
import StudentNavbar from "../../components/student/StudentNavbar";
import { Loader2 } from "lucide-react";

function StudentCourseContent() {
  const { course_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { fetchCourseByID, course } = useStudentStore();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        await fetchCourseByID(course_id);
      } catch (error) {
        setError("Failed to load course data");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [course_id, fetchCourseByID]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );
  }

  if (error) return <div className="p-4 text-error">{error}</div>;
  if (!course) return <div className="p-4">No course data available</div>;

  return (
    <div className="min-h-screen bg-base-200 flex flex-col justify-start pb-5">
      <StudentNavbar />

      <div className="container mx-auto p-6 mt-16">
        {/* Course Header */}
        <div className="bg-primary flex flex-col items-center rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl text-accent font-bold mb-2">
            {course.subject_name || "Course Name Not Available"}
          </h1>
        </div>

        {/* NavigationTabs */}
        <StudentNavigationTabs courseId={course_id} />

        {/* Tab Content - Pass both course data and fetched content */}
        <Outlet
          context={{
            courseData: course,
            courseId: course_id,
          }}
        />
      </div>
    </div>
  );
}

export default StudentCourseContent;
