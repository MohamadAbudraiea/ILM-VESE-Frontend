import { useState } from "react";
import { Edit, Trash } from "lucide-react";
import QuestionEditForm from "./QuestionEditForm";

function QuestionItem({ question, index, updateQuestion, removeQuestion }) {
  const [isEditing, setIsEditing] = useState(false);

  // Function to handle starting the edit process
  const handleStartEdit = () => {
    setIsEditing(true);
  };

  // Functions to handle canceling edit question
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Function to handle saving the edited question
  const handleSaveEdit = (updatedQuestion) => {
    updateQuestion(updatedQuestion);
    setIsEditing(false);
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      {/* If editing, show the edit form; otherwise, show the question details */}
      {isEditing ? (
        <QuestionEditForm
          question={question}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      ) : (
        <>
          {/* Question details */}
          <div className="flex justify-between items-center mb-2">
            {/* Question number and Question text */}
            <h3 className="font-medium">
              Question {index + 1}: {question.question || "(No question text)"}
            </h3>

            <div className="flex items-center">
              {/* Total points */}
              <span className="mr-4">Points: {question.points}</span>
              {/* Correct Answer */}
              <span className="mr-4">
                Correct Answer:{" "}
                {question.choices[question.correctAnswerIndex] || "Not set"}
              </span>
              {/* Edit button */}
              <button
                type="button"
                className="btn btn-sm btn-ghost mr-2"
                onClick={handleStartEdit}
              >
                <Edit size={16} />
                Edit
              </button>
              {/* Remove button */}
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => removeQuestion(question.id)}
              >
                <Trash size={16} />
                Remove
              </button>
            </div>
          </div>

          {/* Choices */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {question.choices.map((choice, choiceIndex) => (
              <div key={choiceIndex} className="flex items-center">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  className="radio radio-primary mr-2"
                  checked={choiceIndex === question.correctAnswerIndex}
                  readOnly
                />
                <span
                  className={
                    choiceIndex === question.correctAnswerIndex
                      ? "font-bold text-green-600"
                      : ""
                  }
                >
                  {choice || `(Option ${choiceIndex + 1})`}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default QuestionItem;
