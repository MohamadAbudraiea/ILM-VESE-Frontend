export default function ParentForm({ formData, handleChange }) {
  return (
    <>
      <h3 className="text-xl font-bold mb-4">Add New Parent</h3>
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Parent ID</label>
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
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter phone number"
            required
          />
        </div>
      </div>
    </>
  );
}
