import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { useAdminStore } from "../../store/AdminStore";

function SearchParent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allParents, setAllParents] = useState([]);
  const [filteredParents, setFilteredParents] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const { isFetchingParents, getAllParents } = useAdminStore();

  // fetch all parents
  useEffect(() => {
    const fetchParents = async () => {
      try {
        const response = await getAllParents();
        if (response?.data) {
          setAllParents(response.data);
          setFilteredParents(response.data);
        }
      } catch (error) {
        console.error("Error fetching parents:", error);
      }
    };
    fetchParents();
  }, [getAllParents]);

  // search for a parent eiher by his name or his ID
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1);

    const results = allParents.filter(
      (parent) =>
        `${parent.first_name} ${parent.last_name}`
          .toLowerCase()
          .includes(term.toLowerCase()) ||
        parent.parent_id.toString().includes(term)
    );
    setFilteredParents(term.length > 0 ? results : allParents);
  };

  const parentsPerPage = 5;
  const totalPages = Math.ceil(filteredParents.length / parentsPerPage);
  const indexOfLastParent = currentPage * parentsPerPage;
  const indexOfFirstParent = indexOfLastParent - parentsPerPage;
  const currentParents = filteredParents.slice(
    indexOfFirstParent,
    indexOfLastParent
  );

  if (isFetchingParents) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search by parent name or ID"
          className="input input-bordered w-full pl-10"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Search
          className="absolute left-3 top-[0.9rem] text-gray-500"
          size={20}
        />
      </div>

      {filteredParents.length > 0 ? (
        <div className="p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Parent Search Results</h2>
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="table w-full text-center">
              <thead>
                <tr className="bg-primary text-white">
                  <th>Parent ID</th>
                  <th>Parent Name</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {currentParents.map((parent) => (
                  <tr key={parent.parent_id} className="hover">
                    <td>{parent.parent_id}</td>
                    <td>
                      {parent.first_name} {parent.last_name}
                    </td>
                  <td><a href={`tel:${parent.phone}`}>{parent.phone}</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => {
                if (currentPage > 1) setCurrentPage((prev) => prev - 1);
              }}
              className="btn btn-sm"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => {
                if (currentPage < totalPages)
                  setCurrentPage((prev) => prev + 1);
              }}
              className="btn btn-sm"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        searchTerm && (
          <div className="text-center py-8 text-gray-500">
            No parents found matching your search
          </div>
        )
      )}
    </div>
  );
}

export default SearchParent;
