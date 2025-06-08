import { useEffect, useState } from "react";
import { useAdminStore } from "../../../store/AdminStore";

export default function TeacherForm({ formData, handleChange }) {
  const { getAllDepartments, getGradesInDepartment, getAllSections } =
    useAdminStore();

  const [departments, setDepartments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const deptData = await getAllDepartments();

      setDepartments(Array.isArray(deptData.data) ? deptData.data : []);
    };
    fetchData();
  }, [getAllDepartments]);

  useEffect(() => {
    const fetchData = async () => {
      const gradeData = await getGradesInDepartment(formData.dept_id);

      setGrades(Array.isArray(gradeData.data) ? gradeData.data : []);
    };
    fetchData();
  }, [getAllDepartments, formData.dept_id, getGradesInDepartment]);

  useEffect(() => {
    const fetchSections = async () => {
      if (formData.grade_id) {
        const sectionData = await getAllSections(formData.grade_id);
        setSections(sectionData.data);
      } else {
        setSections([]);
      }
    };
    fetchSections();
  }, [getGradesInDepartment, formData.grade_id, getAllSections]);

  return (
    <>
      <h3 className="text-xl font-bold mb-4">Add New Teacher</h3>
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Teacher ID</label>
          <div className="bg-gray-100 p-2 rounded">Auto-generated</div>
        </div>

        <div>
          <label className="block font-medium mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter first name"
            autoComplete="off"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter last name"
            autoComplete="off"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter email"
            autoComplete="off"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password || ""}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter password"
            autoComplete="new-password"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Department</label>
          <select
            name="dept_id"
            value={formData.dept_id || ""}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.department_id} value={dept.department_id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Grade</label>
          <select
            name="grade_id"
            value={formData.grade_id || ""}
            onChange={handleChange}
            className="select select-bordered w-full"
            disabled={!formData.dept_id}
            required
          >
            <option value="">
              {formData.dept_id ? "Select Grade" : "Select Department First"}
            </option>
            {grades.map((grade) => (
              <option key={grade.grade_id} value={grade.grade_id}>
                {grade.grade_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Section</label>
          <select
            name="section_id"
            value={formData.section_id || ""}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
            disabled={!formData.grade_id || !formData.dept_id}
          >
            <option value="">
              {formData.grade_id ? "Select Section" : "Select Grade First"}
            </option>
            {sections.map((section) => (
              <option key={section.section_id} value={section.section_id}>
                {section.section_name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
