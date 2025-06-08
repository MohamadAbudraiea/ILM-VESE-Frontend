import Carousel from "../shared/Carousel";

export default function EventList({
  events,
  currentYear,
  isManager,
  handleDeleteEvent,
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {events[currentYear]?.length > 0 ? (
        events[currentYear].map((event) => (
          <div
            key={event.id}
            id={event.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              {/* Manager Delete Option */}
              {isManager && handleDeleteEvent && (
                <div className="mb-3 text-right">
                  <button
                    onClick={() => handleDeleteEvent(currentYear, event.id)}
                    className="btn btn-sm btn-outline btn-error"
                  >
                    Delete
                  </button>
                </div>
              )}

              {/* Event Description */}
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold">{event.title}</h2>
                <span className="text-gray-500">{event.eventdate}</span>
              </div>
              <div className="mb-4">
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {event.location}
                </p>
              </div>
              <div className="space-y-3">{event.description}</div>
            </div>

            {/* Event Media Carousel */}
            <Carousel
              customSlides={event.media.map((img, idx) => (
                <div key={img._id} className="flex-[0_0_100%] h-64 p-2 md:h-80">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/media/events/${
                      img.filename
                    }`}
                    alt={`${event.title}-${idx + 1}`}
                    className="w-full h-full object-fill rounded-lg shadow-md"
                  />
                </div>
              ))}
            />
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">
          No events for {currentYear}.
        </p>
      )}
    </div>
  );
}
