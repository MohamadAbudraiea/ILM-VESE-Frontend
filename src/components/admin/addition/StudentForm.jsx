import { useEffect, useState } from "react";
import { useAdminStore } from "../../../store/AdminStore";

export default function StudentForm({ formData, handleChange }) {
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [parents, setParents] = useState([]);

  const { getAllGrades, getAllSections, getAllParents } = useAdminStore();

  useEffect(() => {
    const fetchData = async () => {
      const gradeData = await getAllGrades();
      const parentData = await getAllParents();

      setGrades(Array.isArray(gradeData.data) ? gradeData.data : []);
      setParents(Array.isArray(parentData.data) ? parentData.data : []);
    };
    fetchData();
  }, [getAllGrades, getAllParents]);

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
  }, [formData.grade_id, getAllSections]);

  return (
    <>
      <h3 className="text-xl font-bold mb-4">Add New Student</h3>
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Student ID</label>
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
          <label className="block font-medium mb-1">Parent</label>
          <select
            name="parent_id"
            value={formData.parent_id || ""}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option disabled value="">
              Select Parent
            </option>
            {parents.map((parent) => (
              <option key={parent.parent_id} value={parent.parent_id}>
                {parent.first_name} {parent.last_name}
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
            required
          >
            <option disabled value="">
              Select Grade
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
            disabled={!formData.grade_id}
          >
            <option disabled value="">
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
