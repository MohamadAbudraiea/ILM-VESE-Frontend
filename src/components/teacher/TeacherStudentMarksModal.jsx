import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useTeacherStore } from "../../store/TeacherStore";
import ErrorModal from "../../components/shared/ErrorModal";

function TeacherStudentMarksModal({ isOpen, onClose, student }) {
  const { course_id } = useParams();
  const { getCourseByID } = useTeacherStore();


  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [course, setCourse] = useState([]);
  const [activeTerm, setActiveTerm] = useState("Term 1");
  const [marks, setMarks] = useState({
    "Term 1": [],
    "Term 2": [],
    "Term 3": [],
    Final: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState({
    "Term 1": false,
    "Term 2": false,
    "Term 3": false,
    Final: false,
  });

  const { addMark, getMark } = useTeacherStore();

  const loadMarks = useCallback(async () => {
    setIsLoading(true);
    const markType = {
      "Term 1": "MT-001",
      "Term 2": "MT-002",
      "Term 3": "MT-003",
      Final: "MT-004",
    }[activeTerm];

    const maxMark = {
      "Term 1": 20,
      "Term 2": 20,
      "Term 3": 20,
      Final: 40,
    }[activeTerm];

    try {
      const existingMark = await getMark(
        course.course_id,
        student.id,
        markType
      );

      if (existingMark !== "No mark found") {
        setMarks((prev) => ({
          ...prev,
          [activeTerm]: [
            {
              type: markType,
              max: maxMark,
              obtained: existingMark,
            },
          ],
        }));
        setIsSaved((prev) => ({ ...prev, [activeTerm]: true }));
      } else {
        // No mark found → create default input field
        setMarks((prev) => ({
          ...prev,
          [activeTerm]: [
            {
              type: markType,
              max: maxMark,
              obtained: "",
            },
          ],
        }));
        setIsSaved((prev) => ({ ...prev, [activeTerm]: false }));
      }
    } catch (error) {
      console.error("Error loading marks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTerm, course.course_id, getMark, student.id]);

  useEffect(() => {
    const fetchCourseContent = async () => {
      const courseData = await getCourseByID(course_id);
      setCourse(courseData);
    };

    fetchCourseContent();
  }, [course_id, getCourseByID]);

  useEffect(() => {
    if (isOpen) {
      loadMarks();
    }
  }, [isOpen, activeTerm, loadMarks]);

  const handleMarkChange = (index, value) => {
    const updated = [...marks[activeTerm]];
    updated[index].obtained = value;
    setMarks((prev) => ({ ...prev, [activeTerm]: updated }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      for (let item of marks[activeTerm]) {
        await addMark(course.course_id, {
          student_id: student.id,
          mark_type: item.type,
          mark_value: item.obtained,
        });
      }
      setIsSaved((prev) => ({ ...prev, [activeTerm]: true }));
    } catch (error) {
      console.error("Error saving mark:", error);
      setModalMessage(
        "Failed to save mark: " + (error.response?.data?.error || error.message)
      );
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-3xl p-6">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Enter Marks: {student.name} - {course.subject_name}
        </h2>

        <div className="flex flex-1 items-center gap-2 mb-6 bg-gray-100 p-4 rounded-lg">
          {Object.keys(marks).map((term) => (
            <button
              key={term}
              className={`px-4 py-2 rounded-md flex flex-auto ${
                activeTerm === term
                  ? "bg-primary text-base-100"
                  : "bg-base-100 text-gray-700"
              }`}
              onClick={() => setActiveTerm(term)}
            >
              {term}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-center">Max Marks</th>
                <th className="text-center">Obtained Marks</th>
              </tr>
            </thead>
            <tbody>
              {marks[activeTerm].map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="text-center">{item.max}</td>
                  <td className="text-center">
                    {isSaved[activeTerm] ? (
                      <div className="bg-gray-200 text-center p-2 rounded w-full max-w-xs mx-auto">
                        {item.obtained}
                      </div>
                    ) : (
                      <input
                        type="number"
                        className="input input-bordered w-full max-w-xs"
                        value={item.obtained}
                        onChange={(e) =>
                          handleMarkChange(index, e.target.value)
                        }
                        min="0"
                        max={item.max}
                        disabled={isLoading}
                        placeholder="0"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          {!isSaved[activeTerm] && (
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          )}
        </div>
      </div>
       <ErrorModal
        showErrorModal={showErrorModal}
        setShowErrorModal={setShowErrorModal}
        errorMessage={modalMessage}
      />
    </div>
  );
}

export default TeacherStudentMarksModal;
