import { Link } from "react-router-dom";

function CourseCard({ to, title, section = "section", grade = "grade" }) {
  return (
    <div className="flex flex-col sm:flex-row items-center bg-base-100 p-4 rounded-lg shadow-sm w-full">
      <div className="w-full sm:w-32 h-32 flex items-center justify-center mb-4 sm:mb-0 sm:mr-4">
        <img
          src="/Logo.png"
          alt="course name"
          className="w-full h-full rounded-lg"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <h2 className="text-lg font-semibold text-base-content mb-1">
          {title ? title : "title"}
        </h2>
        <p>Grade: {grade}</p>
        <p>Section: {section}</p>
        <Link
          to={to}
          className="btn btn-sm bg-primary text-accent hover:bg-base-content rounded-md"
        >
          view course
        </Link>
      </div>
    </div>
  );
}

export default CourseCard;
