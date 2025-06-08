import { Plus, X } from "lucide-react";

function EventModal({
  setShowModal,
  newEvent,
  setNewEvent,
  handleAddEvent,
  formError,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
      <form
        onSubmit={handleAddEvent}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={() => setShowModal(false)}
          type="button"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-4">Add New Event</h2>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-1">Title</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Enter event title"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
        </div>

        {/* Date and Location */}
        <div className="mb-4 grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-medium mb-1">Date</label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent({ ...newEvent, date: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-1">Location</label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter location"
              value={newEvent.location}
              onChange={(e) =>
                setNewEvent({ ...newEvent, location: e.target.value })
              }
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-1">Description</label>
          <textarea
            className="textarea textarea-bordered w-full h-40"
            placeholder="Enter event description (use new lines for paragraphs)"
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
          ></textarea>
        </div>

        {/* Media Upload */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-1">
            Media (images)
          </label>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            multiple
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setNewEvent({
                  ...newEvent,
                  media: [...newEvent.media, ...Array.from(e.target.files)],
                });
              }
            }}
          />
        </div>

        {/* Media Previews */}
        {Array.isArray(newEvent.media) && newEvent.media.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {newEvent.media.map((file, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updatedMedia = [...newEvent.media];
                    updatedMedia.splice(idx, 1);
                    setNewEvent({ ...newEvent, media: updatedMedia });
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Error Message */}
        {formError && (
          <div className="text-red-600 font-medium mb-4">{formError}</div>
        )}

        <div className="divider my-8"></div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            Add a New Event
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventModal;
