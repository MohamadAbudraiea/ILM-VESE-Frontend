import TeacherNavbar from "../../components/teacher/TeacherNavbar";
import CourseCard from "../../components/shared/CourseCard";
import { useTeacherStore } from "../../store/TeacherStore";
import { useEffect } from "react";

function TeacherDashboard() {
  const { coursesForTeacher, getCoursesForTeacher } = useTeacherStore();

  // Fetch courses for the teacher
  useEffect(() => {
    const fetchCourses = async () => {
      await getCoursesForTeacher();
    };
    fetchCourses();
  }, [getCoursesForTeacher]);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center pb-5">
      <TeacherNavbar />

      <div className="flex flex-col items-start justify-center mt-10 px-4 md:px-8">
        <div className="flex w-full items-center justify-between">
          <div>
            <h1 className="text-6xl font-bold text-primary">My Courses</h1>
            <p className="mt-2 text-3xl text-primary">Course overview</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 w-full">
          {coursesForTeacher.map((course) => (
            <CourseCard
              key={course.course_id}
              to={`/teacher-course-content/${course.course_id}`}
              title={course.subject_name}
              section={course.section?.section_name}
              grade={course.section.grade.grade_name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
