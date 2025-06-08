function QuizDetailsForm({ quizData, updateQuizDetails }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateQuizDetails(name, value);
  };

  return (
    <>
      {/* Quiz Title */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Quiz Title:
        </label>
        <input
          type="text"
          name="quizTitle"
          value={quizData.quizTitle}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
          placeholder="Enter quiz title"
        />
      </div>

      {/* Quiz description */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Description:
        </label>
        <textarea
          name="description"
          value={quizData.description}
          onChange={handleChange}
          className="textarea textarea-bordered w-full h-24"
          placeholder="Enter quiz description"
          required
        />
      </div>

      {/* Quiz details */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Start date */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Start Date:
          </label>
          <input
            type="date"
            name="startDate"
            placeholder="MM/DD/YYYY"
            value={quizData.startDate}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        {/* Start time */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Start Time:
          </label>
          <input
            type="time"
            name="startTime"
            placeholder="HH:MM"
            value={quizData.startTime}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        {/* Duration */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Duration:(minutes)
          </label>
          <input
            type="text"
            name="duration"
            placeholder="minutes"
            value={quizData.duration}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        {/* Total points */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Total Points:
          </label>
          <input
            type="number"
            name="totalPoints"
            value={quizData.totalPoints}
            onChange={handleChange}
            className="input input-bordered w-full"
            min="1"
            required
          />
        </div>
      </div>
    </>
  );
}

export default QuizDetailsForm;
