import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useParentsStore from "../../store/ParentStore";
import ParentNavBar from "../../components/parent/ParentNavBar";
import NavigationTabs from "../../components/parent/ParentNavigationTabs";
import { Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";

function ParentCourseContent() {
  const { course_id } = useParams();
  const { course, loading, error, fetchCourseByID } = useParentsStore();

  useEffect(() => {
    const fetchData = async () => {
      if (course_id) {
        await fetchCourseByID(course_id);
      } else {
        console.error("Course ID is missing.");
      }
    };
    fetchData();
  }, [course_id, fetchCourseByID]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-error">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col justify-start pb-5">
      <ParentNavBar />

      <div className="container mx-auto p-6 mt-16">
        {/* Course Header */}
        <div className="bg-primary flex flex-col items-center rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl text-accent font-bold mb-2">
            {course.subject_name || "Course"}
          </h1>
        </div>

        {/* NavigationTabs */}
        <NavigationTabs />

        {/* Tab Content */}
        <Outlet context={{ currentCourse: course }} />
      </div>
    </div>
  );
}

export default ParentCourseContent;
