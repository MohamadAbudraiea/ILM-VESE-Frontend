export default function AdminForm({ formData, handleChange }) {
  return (
    <>
      <h3 className="text-xl font-bold mb-4">Add New Admin</h3>
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Admin ID</label>
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
            minLength={2}
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
            minLength={2}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter email"
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
            minLength={8}
          />
        </div>
      </div>
    </>
  );
}
