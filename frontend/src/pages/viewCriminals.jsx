import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../store/authStore.js";
import { FaEdit, FaTrash, FaPrint, FaTimes } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";

export default function ViewCriminals() {
  const user = useAuthStore((state) => state.user);
  const currentUserName = user?.name || "Unknown User";
  const currentUserRole = user?.role || "guest";

  const [criminals, setCriminals] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingCriminal, setEditingCriminal] = useState(null);
  const [detailCriminal, setDetailCriminal] = useState(null); // For detail modal

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Ref for printing content
  const printRef = useRef();

  useEffect(() => {
    async function fetchCriminals() {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/api/criminals");
        if (!response.ok) throw new Error("Failed to fetch criminals");
        const data = await response.json();
        setCriminals(data.data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchCriminals();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this criminal?")) return;

    try {
      setDeletingId(id);
      const res = await fetch(`http://localhost:8000/api/criminals/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setCriminals(criminals.filter((c) => c._id !== id));
      alert("Deleted successfully");
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCriminals = criminals.filter((c) => {
    return (
      c.name.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === "all" || c.custodyStatus === statusFilter)
    );
  });

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentCriminals = filteredCriminals.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCriminals.length / recordsPerPage);

  const handleEdit = (criminal) => setEditingCriminal(criminal);
  const closeEditModal = () => setEditingCriminal(null);

  const handleUpdate = (e) => {
    e.preventDefault();
    alert("Update logic goes here");
    closeEditModal();
  };

  const canEdit = ["admin", "sub-admin", "police"].includes(currentUserRole);
  const canDelete = currentUserRole === "admin";

  // Detail Modal controls
  const openDetailModal = (criminal) => setDetailCriminal(criminal);
  const closeDetailModal = () => setDetailCriminal(null);

  // Print functionality
const handlePrint = () => {
  if (!printRef.current) return;

  const printContent = printRef.current.innerHTML;

  const disclaimerHTML = `
    <div style="
      border: 2px solid #ef4444;
      background-color: #fff5f5;
      color: #b91c1c;
      padding: 15px;
      margin-bottom: 30px;
      font-weight: bold;
      font-size: 1rem;
      border-radius: 8px;
    ">
      <p>
        <strong>Important Notice:</strong> This information is intended solely for verifying the identity of individuals
        for legitimate hiring purposes. Any misuse of this data for unlawful or deceptive activities will result in
        legal action. Anyone found engaging in such conduct will be subject to prosecution in a court of law.
      </p>
    </div>
  `;

  const printWindow = window.open("", "_blank", "width=600,height=700");

  printWindow.document.write(`
    <html>
      <head>
        <title>Print Criminal Details</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          img { max-width: 200px; height: auto; border-radius: 8px; margin-bottom: 20px; display: block; }
          h2 { margin-bottom: 10px; color: #dd6b20; } /* Tailwind orange-600 */
          p { margin: 5px 0; }
          .custodyStatus-captured { background-color: #16a34a; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; }
          .custodyStatus-at-large { background-color: #ef4444; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; }
        </style>
      </head>
      <body>
        ${disclaimerHTML}
        ${printContent}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  // Wait for images to load before printing
  const images = printWindow.document.images;
  let loadedCount = 0;
  const totalImages = images.length;

  if (totalImages === 0) {
    printWindow.print();
    printWindow.close();
  } else {
    for (let img of images) {
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          printWindow.print();
          printWindow.close();
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          printWindow.print();
          printWindow.close();
        }
      };
    }
  }
};


  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-red-600 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
        Criminal Records
      </h1>

      {/* Welcome */}
      <div className="mb-8 text-center text-gray-700 text-lg">
        Welcome, <span className="font-semibold">{currentUserName}</span>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name"
          className="px-4 py-3 border rounded-lg shadow-sm w-full md:w-1/2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
          aria-label="Search criminals by name"
        />
        <div className="flex items-center gap-3">
          <MdOutlineFilterList className="text-2xl text-gray-600" aria-hidden="true" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="captured">Captured</option>
            <option value="at large">At Large</option>
          </select>
        </div>
      </div>

      {/* Loading/Error/Empty States */}
      {loading ? (
        <p className="text-center text-gray-600">Loading criminals...</p>
      ) : error ? (
        <p className="text-center text-red-600 font-semibold">{error}</p>
      ) : filteredCriminals.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No criminals found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="overflow-x-auto rounded-lg shadow hidden md:block border border-gray-200">
            <table className="w-full border-collapse bg-white">
              <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Crime</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Mugshot</th>
                  {(canEdit || canDelete) && <th className="p-4 text-left">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {currentCriminals.map((c) => (
                  <tr
                    key={c._id}
                    className="border-t hover:bg-orange-50 cursor-pointer transition-colors"
                    onClick={() => openDetailModal(c)}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && openDetailModal(c)}
                    aria-label={`View details of ${c.name}`}
                  >
                    <td className="p-4 font-medium">{c.name}</td>
                    <td className="p-4">{c.crimeCommitted}</td>
                    <td className="p-4">{new Date(c.dateOfCrime).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm ${
                          c.custodyStatus === "captured" ? "bg-green-600" : "bg-red-500"
                        }`}
                      >
                        {c.custodyStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      {c.mugshotUrl ? (
                        <img
                          src={`http://localhost:8000/${c.mugshotUrl}`}
                          alt={`Mugshot of ${c.name}`}
                          className="w-16 h-16 rounded object-cover border"
                        />
                      ) : (
                        <span className="italic text-gray-400">No Image</span>
                      )}
                    </td>
                    {(canEdit || canDelete) && (
                      <td
                        className="p-4 space-x-3"
                        onClick={(e) => e.stopPropagation()}
                        // Prevent modal open on buttons click
                      >
                        {canEdit && (
                          <button
                            onClick={() => handleEdit(c)}
                            className="text-blue-600 hover:text-blue-800"
                            aria-label={`Edit ${c.name}`}
                          >
                            <FaEdit size={18} />

                            



                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(c._id)}
                            disabled={deletingId === c._id}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                            aria-label={`Delete ${c.name}`}
                          >
                            <FaTrash size={18} />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-6">
            {currentCriminals.map((c) => (
              <div
                key={c._id}
                onClick={() => openDetailModal(c)}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && openDetailModal(c)}
                className="border rounded-lg p-4 shadow-sm bg-white cursor-pointer transition hover:shadow-md"
                aria-label={`View details of ${c.name}`}
              >
                <div className="flex items-center space-x-4 mb-2">
                  {c.mugshotUrl ? (
                    <img
                      src={`http://localhost:8000/${c.mugshotUrl}`}
                      alt={`Mugshot of ${c.name}`}
                      className="w-16 h-16 rounded object-cover border"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded italic text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold">{c.name}</h2>
                    <p className="text-gray-600">{c.crimeCommitted}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(c.dateOfCrime).toLocaleDateString()}
                    </p>
                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-white text-xs ${
                        c.custodyStatus === "captured" ? "bg-green-600" : "bg-red-500"
                      }`}
                    >
                      {c.custodyStatus}
                    </span>
                  </div>
                </div>
                {(canEdit || canDelete) && (
                  <div
                    className="flex space-x-4 mt-2 justify-end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {canEdit && (
                      <button
                        onClick={() => handleEdit(c)}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label={`Edit ${c.name}`}
                      >
                        <FaEdit size={20} />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(c._id)}
                        disabled={deletingId === c._id}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        aria-label={`Delete ${c.name}`}
                      >
                        <FaTrash size={20} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-md border font-semibold transition ${
                  currentPage === i + 1
                    ? "bg-orange-600 text-white"
                    : "bg-white text-gray-700 hover:bg-orange-100"
                }`}
                aria-current={currentPage === i + 1 ? "page" : undefined}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Detail Modal */}
      {detailCriminal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detailModalTitle"
        >
          <div
            ref={printRef}
            className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative animate-fadeIn"
          >
            <button
              onClick={closeDetailModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Close details modal"
            >
              <FaTimes size={24} />
            </button>

            <h2
              id="detailModalTitle"
              className="text-2xl font-bold mb-4 text-orange-600"
            >
              {detailCriminal.name}
            </h2>

            {detailCriminal.mugshotUrl ? (
              <img
                src={`http://localhost:8000/${detailCriminal.mugshotUrl}`}
                alt={`Mugshot of ${detailCriminal.name}`}
                className="w-full max-h-64 object-cover rounded mb-6 border"
              />
            ) : (
              <div className="w-full max-h-64 flex items-center justify-center bg-gray-100 rounded italic text-gray-400 mb-6 text-center py-10">
                No Mugshot Available
              </div>
            )}

            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Crime Committed:</span>{" "}
                {detailCriminal.crimeCommitted}
              </p>
              <p>
                <span className="font-semibold">Date of Crime:</span>{" "}
                {new Date(detailCriminal.dateOfCrime).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-white ${
                    detailCriminal.custodyStatus === "captured"
                      ? "bg-green-600"
                      : "bg-red-500"
                  }`}
                >
                  {detailCriminal.custodyStatus}
                </span>
              </p>
              <p>
                <span className="font-semibold">Last Known Location:</span>{" "}
                {detailCriminal.lastKnownLocation || "Unknown"}
              </p>
              <p>
                <span className="font-semibold">Description:</span>{" "}
                {detailCriminal.description || "No description available."}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={handlePrint}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="Print criminal details"
              >
                <FaPrint className="inline mr-2" /> Print
              </button>
              <button
                onClick={closeDetailModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal (simplified) */}
      {editingCriminal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="editModalTitle"
        >
          <form
            onSubmit={handleUpdate}
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
          >
            <h2
              id="editModalTitle"
              className="text-2xl font-semibold mb-6 text-orange-600"
            >
              Edit Criminal - {editingCriminal.name}
            </h2>

            {/* Form Fields */}
            <label className="block mb-3">
              <span className="text-gray-700 font-semibold">Name</span>
              <input
                type="text"
                defaultValue={editingCriminal.name}
                className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </label>

            <label className="block mb-3">
              <span className="text-gray-700 font-semibold">Crime Committed</span>
              <input
                type="text"
                defaultValue={editingCriminal.crimeCommitted}
                className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </label>

            <label className="block mb-3">
              <span className="text-gray-700 font-semibold">Status</span>
              <select
                defaultValue={editingCriminal.custodyStatus}
                className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              >
                <option value="captured">Captured</option>
                <option value="at large">At Large</option>
              </select>
            </label>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="submit"
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Save
              </button>
              <button
                type="button"
                onClick={closeEditModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {opacity: 0;}
          to {opacity: 1;}
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
}
