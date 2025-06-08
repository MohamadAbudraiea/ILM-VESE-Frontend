import { useNavigate, useParams } from "react-router-dom";
import { useTeacherStore } from "../../../store/TeacherStore";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import SuccessModal from "../../../components/shared/SuccessModal";
import ErrorModal from "../../../components/shared/ErrorModal";

function TeacherOverviewTab() {
  const { course_id } = useParams();
  const navigate = useNavigate();
  const { getCourseUnits, units, addCourseUnit, deleteUnit } =
    useTeacherStore();

  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUnit, setNewUnit] = useState({
    unit_name: "",
    unit_description: "",
  });

  const [unitToDelete, setUnitToDelete] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // fetch course units
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true);
        await getCourseUnits(course_id);
      } catch (error) {
        console.error("Failed to load unit content:", error);
        setErrorMessage("Failed to fetch units");
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, [course_id, getCourseUnits]);

  // handle add unit
  const handleAddUnit = async () => {
    try {
      setIsAdding(true);
      await addCourseUnit(course_id, newUnit);
      await getCourseUnits(course_id);
      setShowAddModal(false);
      setNewUnit({ unit_name: "", unit_description: "" });
    } catch (error) {
      console.error("Error adding unit:", error);
      setErrorMessage("Failed to add unit");
      setShowErrorModal(true);
    } finally {
      setIsAdding(false);
    }
  };

  // confirm delete unit
  const confirmDeleteUnit = async () => {
    if (!unitToDelete) return;
    try {
      setShowConfirmModal(false);
      await deleteUnit(course_id, unitToDelete.unit_id);
      await getCourseUnits(course_id);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error deleting unit:", error);
      setErrorMessage("Failed to delete unit");
      setShowErrorModal(true);
    } finally {
      setUnitToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl text-primary font-bold">Course Units</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-outline btn-primary"
        >
          + Add New Unit
        </button>
      </div>

      {units.length === 0 && (
        <div className="text-center text-gray-500">
          <p className="text-lg">No units available for this course.</p>
          <p className="text-sm">Click the button above to add a new unit.</p>
        </div>
      )}

      <div className="space-y-4">
        {units.map((unit) => (
          <div key={unit.unit_id} className="card bg-base-200 shadow-md">
            <div className="card-body">
              <div className="flex justify-between items-center sm:flex-row flex-col">
                <div className="flex-1 mb-4 sm:mb-0">
                  <h3 className="card-title text-xl">{unit.unit_name}</h3>
                  <p>{unit.unit_description}</p>
                </div>
                <div className="flex flex-1 justify-end items-center">
                  <button
                    className="btn btn-primary text-lg btn-md"
                    onClick={() =>
                      navigate(
                        `/teacher-course-content/${course_id}/teacher-unit-content/${unit.unit_id}`,
                        { state: { unit } }
                      )
                    }
                  >
                    View Unit
                  </button>
                  <button
                    className="btn btn-error text-lg btn-md ml-2"
                    onClick={() => {
                      setUnitToDelete(unit);
                      setShowConfirmModal(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Unit Modal */}
      <div className={`modal ${showAddModal ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Unit</h3>
          <div className="py-4 space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Unit Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter unit name"
                className="input input-bordered w-full"
                value={newUnit.unit_name}
                onChange={(e) =>
                  setNewUnit({ ...newUnit, unit_name: e.target.value })
                }
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Unit Description</span>
              </label>
              <textarea
                placeholder="Enter unit description"
                className="textarea textarea-bordered w-full"
                rows={3}
                value={newUnit.unit_description}
                onChange={(e) =>
                  setNewUnit({ ...newUnit, unit_description: e.target.value })
                }
              ></textarea>
            </div>
          </div>
          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={() => {
                setShowAddModal(false);
                setNewUnit({ unit_name: "", unit_description: "" });
              }}
              disabled={isAdding}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleAddUnit}
              disabled={!newUnit.unit_name.trim() || isAdding}
            >
              {isAdding ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Adding...
                </>
              ) : (
                "Add Unit"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete unit{" "}
              <strong>{unitToDelete?.unit_name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUnit}
                className="btn btn-error text-base-100"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <SuccessModal
        successMessage="Unit deleted successfully."
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
      />
      <ErrorModal
        errorMessage={errorMessage}
        showErrorModal={showErrorModal}
        setShowErrorModal={setShowErrorModal}
      />
    </div>
  );
}

export default TeacherOverviewTab;
