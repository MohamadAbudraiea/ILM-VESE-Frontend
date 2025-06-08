import { useState, useEffect, useCallback } from "react";
import { useCourseStore } from "../../store/CourseStore";
import ErrorModal from "../shared/ErrorModal";

function StudentMarksModal({ isOpen, onClose, student, course, studentId }) {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const { addMark, editMark, getMark } = useCourseStore();
  const [activeTerm, setActiveTerm] = useState("Term 1");
  const [marks, setMarks] = useState({
    "Term 1": [{ type: "MT-001", max: 20, obtained: 0 }],
    "Term 2": [{ type: "MT-002", max: 20, obtained: 0 }],
    "Term 3": [{ type: "MT-003", max: 20, obtained: 0 }],
    Final: [{ type: "MT-004", max: 40, obtained: 0 }],
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadMarks = useCallback(async () => {
    try {
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

      const markValue = await getMark(course.id, studentId, markType);

      setMarks((prev) => ({
        ...prev,
        [activeTerm]: [
          {
            type: markType,
            max: maxMark,
            obtained: markValue === "No mark found" ? 0 : markValue,
          },
        ],
      }));
    } catch (error) {
      console.error("Error loading marks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTerm, course.id, getMark, studentId]);

  // Load marks when modal opens or term changes
  useEffect(() => {
    if (isOpen) {
      loadMarks();
    }
  }, [isOpen, activeTerm, loadMarks]);

  const handleMarkChange = (index, value) => {
    const updatedMarks = { ...marks };
    const currentTermData = [...updatedMarks[activeTerm]];

    currentTermData[index] = {
      ...currentTermData[index],
      obtained: value,
    };

    updatedMarks[activeTerm] = currentTermData;
    setMarks(updatedMarks);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const termData = marks[activeTerm][0];

      // First try to edit existing mark
      try {
        await editMark(course.id, {
          student_id: studentId,
          mark_type: termData.type,
          mark_value: termData.obtained,
        });
      } catch (editError) {
        // If edit fails (mark doesn't exist), try to add new mark
        if (editError.response?.status === 404) {
          await addMark(course.id, {
            student_id: studentId,
            mark_type: termData.type,
            mark_value: termData.obtained,
          });
        } else {
          throw editError;
        }
      }

      onClose();
    } catch (error) {
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
          Enter Marks: {student} - {course.name}
        </h2>

        {/* Term selector */}
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

        {/* Marks table */}
        <div className="overflow-x-auto">
          <table className="table w-full mb-4">
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
                    <input
                      type="number"
                      className="input input-bordered w-full max-w-xs"
                      value={item.obtained}
                      onChange={(e) => handleMarkChange(index, e.target.value)}
                      min="0"
                      max={item.max}
                      disabled={isLoading}
                      placeholder="Enter marks"
                      pattern="\d*"
                      title={`Please enter a number between 0 and ${item.max}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
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
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal
        showErrorModal={showErrorModal}
        setShowErrorModal={setShowErrorModal}
        errorMessage={modalMessage}
      />
    </div>
  );
}

export default StudentMarksModal;
