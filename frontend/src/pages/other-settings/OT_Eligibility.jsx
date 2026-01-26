import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function OT_Eligibility() {
  const [settings, setSettings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    working_days: "",
    working_hours: "",
    ot_rate: "",
  });
  const [editRow, setEditRow] = useState(null);

  const getSetting = (catId, desId) => {
    return settings.find(
      (s) => s.employee_category === catId && s.designation === desId,
    );
  };

  const handleYes = (catId, desId) => {
    const existing = getSetting(catId, desId);
    setFormData({
      working_days: existing?.working_days || "",
      working_hours: existing?.working_hours || "",
      ot_rate: existing?.ot_rate || "",
    });
    setEditRow({ catId, desId });
  };

  const saveOTDetails = async (catId, desId) => {
    try {
      const existing = getSetting(catId, desId);
      const endpoint = existing
        ? `/settings/ot-eligibility-settings/${existing.id}/`
        : "/settings/ot-eligibility-settings/";
      const method = existing ? "put" : "post";

      await api[method](endpoint, {
        employee_category: catId,
        designation: desId,
        is_eligible: true,
        ...formData,
      });

      setEditRow(null);
      fetchData();
    } catch (err) {
      console.error("Error saving OT details:", err);
    }
  };

  const handleNo = async (catId, desId) => {
    const existing = getSetting(catId, desId);
    if (existing) {
      try {
        await api.delete(`/settings/ot-eligibility-settings/${existing.id}/`);
        fetchData();
      } catch (err) {
        console.error("Error deleting OT setting:", err);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [settingsRes, categoriesRes, designationsRes] = await Promise.all([
        api.get("/settings/ot-eligibility-settings/"),
        api.get("/settings/employee-categories/"),
        api.get("/settings/designations/"),
      ]);

      // Handle both array and paginated responses
      const settingsData = Array.isArray(settingsRes.data)
        ? settingsRes.data
        : settingsRes.data.results || [];
      const categoriesData = Array.isArray(categoriesRes.data)
        ? categoriesRes.data
        : categoriesRes.data.results || [];
      const designationsData = Array.isArray(designationsRes.data)
        ? designationsRes.data
        : designationsRes.data.results || [];

      setSettings(settingsData);
      setCategories(categoriesData);
      setDesignations(designationsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold mb-4">OT Eligibility Settings</h1>

      {loading && <p>Loading...</p>}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {!loading && (
          <div className="space-y-6">
            {categories.map((category) => {
              // Get designations that belong to this category
              const categoryDesignations = designations.filter(
                (d) => d.employee_category === category.id,
              );

              // If no designations in this category, skip
              if (categoryDesignations.length === 0) return null;

              return (
                <div
                  key={category.id}
                  className="border rounded-lg overflow-hidden"
                >
                  {/* Category Header */}
                  <div className="bg-blue-100 px-6 py-3 border-b">
                    <h3 className="text-lg font-semibold text-blue-900">
                      {category.name}
                    </h3>
                  </div>

                  {/* Designations Table */}
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border px-4 py-2 text-left">
                          Designation
                        </th>
                        <th className="border px-4 py-2 text-left">Eligible</th>
                        <th className="border px-4 py-2 text-left">
                          Working Days
                        </th>
                        <th className="border px-4 py-2 text-left">
                          Working Hours
                        </th>
                        <th className="border px-4 py-2 text-left">OT Rate</th>
                        <th className="border px-4 py-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryDesignations.map((des) => {
                        const setting = getSetting(category.id, des.id);
                        const isEditing =
                          editRow?.catId === category.id &&
                          editRow?.desId === des.id;

                        return (
                          <tr
                            key={`${des.id}-${category.id}`}
                            className={`hover:bg-gray-50 ${
                              isEditing ? "bg-yellow-50" : ""
                            }`}
                          >
                            <td className="border px-4 py-2 font-medium">
                              {des.name}
                            </td>

                            {/* YES / NO */}
                            <td className="border px-2 py-1">
                              <button
                                type="button"
                                onClick={() => handleYes(category.id, des.id)}
                                className={`px-2 py-0.5 mr-1 rounded text-xs font-medium transition ${
                                  setting
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                                }`}
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => handleNo(category.id, des.id)}
                                className={`px-2 py-0.5 rounded text-xs font-medium transition ${
                                  !setting
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                                }`}
                              >
                                No
                              </button>
                            </td>

                            {/* Working Days */}
                            <td className="border px-2 py-1">
                              {isEditing ? (
                                <input
                                  type="number"
                                  className="w-full border border-blue-500 px-2 py-1 rounded bg-white text-xs focus:outline-none focus:border-blue-700"
                                  value={formData.working_days}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      working_days: e.target.value,
                                    })
                                  }
                                  placeholder="Days"
                                />
                              ) : (
                                <span className="text-gray-700">
                                  {setting?.working_days || "-"}
                                </span>
                              )}
                            </td>

                            {/* Working Hours */}
                            <td className="border px-2 py-1">
                              {isEditing ? (
                                <input
                                  type="number"
                                  className="w-full border border-blue-500 px-2 py-1 rounded bg-white text-xs focus:outline-none focus:border-blue-700"
                                  value={formData.working_hours}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      working_hours: e.target.value,
                                    })
                                  }
                                  placeholder="Hours"
                                />
                              ) : (
                                <span className="text-gray-700">
                                  {setting?.working_hours || "-"}
                                </span>
                              )}
                            </td>

                            {/* OT Rate */}
                            <td className="border px-2 py-1">
                              {isEditing ? (
                                <input
                                  type="number"
                                  className="w-full border border-blue-500 px-2 py-1 rounded bg-white text-xs focus:outline-none focus:border-blue-700"
                                  step="0.01"
                                  value={formData.ot_rate}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      ot_rate: e.target.value,
                                    })
                                  }
                                  placeholder="Rate"
                                />
                              ) : (
                                <span className="text-gray-700">
                                  {setting?.ot_rate || "-"}
                                </span>
                              )}
                            </td>

                            {/* Save / Cancel */}
                            <td className="border px-2 py-1 text-center">
                              {isEditing ? (
                                <div className="flex gap-1 justify-center">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      saveOTDetails(category.id, des.id)
                                    }
                                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditRow(null)}
                                    className="px-2 py-1 bg-gray-400 text-white rounded text-xs font-medium hover:bg-gray-500 transition"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : null}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}

            {/* Message if no categories have designations */}
            {categories.filter((cat) =>
              designations.some((d) => d.employee_category === cat.id),
            ).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No designations assigned to employee categories yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
