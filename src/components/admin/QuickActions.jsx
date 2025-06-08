import { Link } from "react-router-dom";

function QuickActions() {
  // Quick Actions and Marks groups
  const actionGroups = [
    {
      title: "Quick Actions",
      actions: [
        { id: 1, label: "Addition", path: "/addition" },
        { id: 2, label: "Deletion", path: "/deletion" },
        { id: 3, label: "Reset Password", path: "/reset-password" },
        { id: 4, label: "Take Absence", path: "/takeAbsence" },
      ],
    },
    {
      title: "Course Content Actions",
      actions: [
        { id: 5, label: "Add Course", path: "/addCourse" },
        { id: 6, label: "Courses", path: "/coursecontent" },
      ],
    },
  ];

  return (
    <div className="bg-base-100 p-6 rounded-lg shadow-md mt-6">
      {actionGroups.map((group, index) => (
        <div key={index} className="mb-8 last:mb-0">
          <h2 className="text-xl font-bold mb-4">{group.title}</h2>
          <div className="flex flex-wrap gap-3">
            {group.actions.map((action) => (
              <Link
                to={action.path}
                key={action.id}
                className="btn hover:btn-primary"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default QuickActions;
