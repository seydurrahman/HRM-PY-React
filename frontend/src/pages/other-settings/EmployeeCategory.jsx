import React, { useEffect, useState } from "react";
import api from "../../lib/api";

export default function EmployeeCategory() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/settings/employee-categories/");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const saveCategory = async () => {
    if (!name.trim()) {
      alert("Enter category name");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        // Update existing
        await api.put(`/settings/employee-categories/${editingId}/`, {
          name,
          description,
        });
        setEditingId(null);
      } else {
        // Create new
        await api.post("/settings/employee-categories/", {
          name,
          description,
        });
      }
      setName("");
      setDescription("");
      await fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Error saving category");
    } finally {
      setLoading(false);
    }
  };

  const editCategory = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description || "");
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await api.delete(`/settings/employee-categories/${id}/`);
      await fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error deleting category");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setDescription("");
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Employee Category Management</h1>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {editingId ? "Edit Category" : "Add New Category"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter description (optional)"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              onClick={saveCategory}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Category"
                  : "Save Category"}
            </button>
            {editingId && (
              <button
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Existing Categories
        </h2>
        {categories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No categories found. Create one to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
              >
                <h3 className="font-semibold text-gray-800 text-lg">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-gray-600 text-sm mt-2">
                    {cat.description}
                  </p>
                )}
                <div className="flex gap-2 mt-4">
                  <button
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-3 rounded text-sm transition duration-200"
                    onClick={() => editCategory(cat)}
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded text-sm transition duration-200"
                    onClick={() => deleteCategory(cat.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
