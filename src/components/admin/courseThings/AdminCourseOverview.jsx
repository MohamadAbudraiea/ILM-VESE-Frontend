import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminNavbar from "../adminNavbar";
import { useCourseStore } from "../../../store/CourseStore";
import { AlertCircle, ArrowLeft, Plus, FileText } from "lucide-react";
import ShowCourseStudents from "../ShowCourseStudents";
import ErrorModal from "../../shared/ErrorModal";
import SuccessModal from "../../shared/SuccessModal";
import ConfirmModal from "../../shared/ConfirmModal";

function AdminCourseOverview() {
  const { getCourseUnits, addCourseUnit, deleteUnit } = useCourseStore();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const location = useLocation();
  const course = location.state?.course;

  const [courseUnits, setCourseUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUnit, setNewUnit] = useState({
    unit_name: "",
    unit_description: "",
  });
  const [showStudentsModal, setShowStudentsModal] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [unitToDelete, setUnitToDelete] = useState(null);

  // fetch course units
  useEffect(() => {
    const fetchCourseData = async () => {
      setIsLoading(true);
      try {
        const units = await getCourseUnits(courseId);
        setCourseUnits(units);
      } catch (error) {
        console.error("Error fetching course units:", error);
        setModalMessage("Failed to load course units");
        setShowErrorModal(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId, getCourseUnits]);

  // handle adding a new unit
  const handleAddUnit = async () => {
    if (!newUnit.unit_name.trim()) {
      setModalMessage("Unit name is required");
      setShowErrorModal(true);
      return;
    }

    try {
      setIsAdding(true);
      await addCourseUnit(courseId, newUnit);
      const units = await getCourseUnits(courseId);
      setCourseUnits(units);
      setModalMessage("Unit added successfully!");
      setShowSuccessModal(true);
      setShowAddModal(false);
      setNewUnit({ unit_name: "", unit_description: "" });
    } catch (error) {
      console.log("Error adding unit:", error);
      setModalMessage(error.response?.data?.message || "Failed to add unit");
      setShowErrorModal(true);
    } finally {
      setIsAdding(false);
    }
  };

  // handle open the delete confirmation modal
  const handleDeleteClick = (unit) => {
    setUnitToDelete(unit);
    setModalMessage(
      `Are you sure you want to delete the unit "${unit.unit_name}"?`
    );
    setShowConfirmModal(true);
  };

  // handle delete unit
  const confirmDeleteUnit = async () => {
    if (!unitToDelete) return;

    try {
      setIsDeleting(true);
      await deleteUnit(courseId, unitToDelete.unit_id);
      const units = await getCourseUnits(courseId);
      setCourseUnits(units);
      setModalMessage("Unit deleted successfully!");
      setShowSuccessModal(true);
    } catch (error) {
      console.log("Error deleting unit:", error);
      setModalMessage(error.response?.data?.message || "Failed to delete unit");
      setShowErrorModal(true);
    } finally {
      setIsDeleting(false);
      setUnitToDelete(null);
      setShowConfirmModal(false);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col">
        <AdminNavbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="card bg-base-100 shadow-xl p-8 max-w-md text-center">
            <div className="text-error mb-4">
              <AlertCircle className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
            <p className="mb-6">
              No course data available for ID: <strong>{courseId}</strong>
            </p>
            <button
              className="btn btn-primary w-full"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <AdminNavbar />
      <div className="flex-1 p-6 max-w-6xl w-full mx-auto">
        {/* Course Header */}
        <div className="bg-base-100 rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">
                {course.course_name}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Course ID: {courseId}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowStudentsModal(true)}
              >
                Show Students
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="h-4 w-4" />
                Add New Unit
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <>
            {/* Units List */}
            <h2 className="text-xl font-semibold mb-4 px-2 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Course Units
            </h2>
            <div className="space-y-4">
              {courseUnits.length > 0 ? (
                courseUnits.map((unit, index) => (
                  <div
                    key={unit.unit_id}
                    className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="card-body">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">
                              {unit.unit_name}
                            </h3>
                            <p className="text-gray-600 mt-2">
                              {unit.unit_description}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          <button
                            onClick={() => handleDeleteClick(unit)}
                            className="btn btn-outline"
                            disabled={isDeleting}
                          >
                            {isDeleting &&
                            unitToDelete?.unit_id === unit.unit_id ? (
                              <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                              "Delete unit"
                            )}
                          </button>

                          <button
                            className="btn btn-primary"
                            onClick={() =>
                              navigate(`/admin-unit-content/${courseId}`, {
                                state: { unit },
                              })
                            }
                          >
                            View Content
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body text-center py-12">
                    <h3 className="text-lg font-medium mt-4">
                      No Units Available
                    </h3>
                    <p className="text-gray-500 mb-4">
                      This course doesn't have any units yet.
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowAddModal(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Create First Unit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
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
                required
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
                required
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

      {/* Show students Modal */}
      {showStudentsModal && (
        <ShowCourseStudents
          courseId={courseId}
          course={course}
          onClose={() => setShowStudentsModal(false)}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        message={modalMessage}
        onConfirm={confirmDeleteUnit}
      />

      {/* Success Modal */}
      <SuccessModal
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
        successMessage={modalMessage}
      />

      {/* Error Modal */}
      <ErrorModal
        showErrorModal={showErrorModal}
        setShowErrorModal={setShowErrorModal}
        errorMessage={modalMessage}
      />
    </div>
  );
}

export default AdminCourseOverview;
