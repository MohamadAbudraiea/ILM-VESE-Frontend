export default function Post({ post, isManageer, onEdit, onDelete }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4">{post.content}</p>
      { isManageer &&
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEdit(post.id)}
            className="btn btn-sm btn-outline btn-primary"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="btn btn-sm btn-outline btn-error"
          >
            Delete
          </button>
        </div>
      }
    </div>
  );
}
