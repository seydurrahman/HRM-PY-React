import { useState, useEffect } from "react";
import api from "../../lib/api";

export default function DesignationEntry() {
  const [designations, setDesignations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [employeeCategory, setEmployeeCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Load designations and employee categories
  const loadDesignations = async (categoriesData = null) => {
    try {
      const res = await api.get("/settings/designations/");
      console.log("Designations fetched:", res.data);

      // Handle both array and paginated responses
      const designationData = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];

      // Use provided categories data or fall back to current state
      const catData = categoriesData || categories;

      // Enrich designations with category names if needed
      const enrichedData = designationData.map((d) => ({
        ...d,
        employee_category_name:
          d.employee_category_name ||
          catData.find((c) => c.id === d.employee_category)?.name ||
          "N/A",
      }));

      setDesignations(enrichedData);
    } catch (error) {
      console.error("Error loading designations:", error);
      alert("Failed to load designations");
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get("/settings/employee-categories/");
      console.log("Categories fetched:", res.data);

      // Handle both array and paginated responses
      const categoryData = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      setCategories(categoryData);
    } catch (error) {
      console.error("Error loading categories:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      // Load categories first
      try {
        const res = await api.get("/settings/employee-categories/");
        console.log("Categories fetched:", res.data);
        const categoryData = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];
        setCategories(categoryData);

        // Then load designations with the categories
        const designRes = await api.get("/settings/designations/");
        const designationData = Array.isArray(designRes.data)
          ? designRes.data
          : designRes.data.results || [];

        const enrichedData = designationData.map((d) => ({
          ...d,
          employee_category_name:
            d.employee_category_name ||
            categoryData.find((c) => c.id === d.employee_category)?.name ||
            "N/A",
        }));

        setDesignations(enrichedData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadInitialData();
  }, []);

  // Save new designation or update existing
  const saveDesignation = async () => {
    if (!name.trim()) return alert("Enter designation name");
    if (!employeeCategory) return alert("Select employee category");

    setLoading(true);
    try {
      if (editingId) {
        // Update existing designation
        await api.put(`/settings/designations/${editingId}/`, {
          name: name.trim(),
          employee_category: employeeCategory,
        });
      } else {
        // Create new designation
        await api.post("/settings/designations/", {
          name: name.trim(),
          employee_category: employeeCategory,
        });
      }
      setName("");
      setEmployeeCategory("");
      setEditingId(null);
      // Reload both categories and designations
      const catRes = await api.get("/settings/employee-categories/");
      const categoryData = Array.isArray(catRes.data)
        ? catRes.data
        : catRes.data.results || [];
      setCategories(categoryData);
      await loadDesignations(categoryData);
    } catch (error) {
      console.error("Error saving designation:", error);
      alert("Failed to save designation");
    } finally {
      setLoading(false);
    }
  };

  // Load designation for editing
  const editDesignation = (designation) => {
    setName(designation.name);
    setEmployeeCategory(designation.employee_category);
    setEditingId(designation.id);
    window.scrollTo(0, 0);
  };

  // Cancel editing
  const cancelEdit = () => {
    setName("");
    setEmployeeCategory("");
    setEditingId(null);
  };

  // Delete designation
  const deleteDesignation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this designation?"))
      return;

    try {
      await api.delete(`/settings/designations/${id}/`);
      await loadDesignations();
    } catch (error) {
      console.error("Error deleting designation:", error);
      alert("Failed to delete designation");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Designation Entry</h1>

      {/* Form Section */}
      <div className="bg-white border rounded-lg p-4 space-y-4 shadow-sm">
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit Designation" : "Add New Designation"}
        </h2>

        <div className="space-y-2">
          <label className="block text-sm font-semibold">
            Designation Name
          </label>
          <input
            className="border p-2 w-full rounded"
            placeholder="Enter designation name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold">
            Employee Category
          </label>
          <select
            className="border p-2 w-full rounded"
            value={employeeCategory}
            onChange={(e) => setEmployeeCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            onClick={saveDesignation}
            disabled={loading}
          >
            {loading ? "Saving..." : editingId ? "Update" : "Save"}
          </button>
          {editingId && (
            <button
              className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* List Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Designation List</h2>
        {designations.length === 0 ? (
          <p className="text-gray-500">No designations found</p>
        ) : (
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left font-semibold">
                    Designation Name
                  </th>
                  <th className="p-3 text-left font-semibold">Category</th>
                  <th className="p-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {designations.map((d) => (
                  <tr key={d.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{d.name}</td>
                    <td className="p-3">{d.employee_category_name || "N/A"}</td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        onClick={() => editDesignation(d)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                        onClick={() => deleteDesignation(d.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
