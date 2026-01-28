import { useEffect, useState } from "react";
import api from "../../lib/api"; // your axios instance

const LeaveSettingsForm = () => {
  const [categories, setCategories] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [leaveSettings, setLeaveSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(10); // seconds
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    leave_year: new Date().getFullYear(),
    categoryType: "single", // 'single' or 'all'
    employee_category: "",
    designationType: "single", // 'single' or 'all'
    designation: "",
    casual_leave_days: 0,
    sick_leave_days: 0,
    earned_leave_days: 0,
    maternity_leave_days: 0,
    paternity_leave_days: 0,
    funeral_leave_days: 0,
    compensatory_leave_days: 0,
    unpaid_leave_days: 0,
    carry_forward: false,
    next_year_adjustment: false,
    sandwitch_leave: false,
  });

  useEffect(() => {
    fetchCategories();
    fetchDesignations();
    fetchLeaveSettings();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const iv = setInterval(
      () => {
        fetchLeaveSettings();
      },
      Math.max(1000, Number(refreshInterval) * 1000),
    );
    return () => clearInterval(iv);
  }, [autoRefresh, refreshInterval]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/settings/employee-categories/");
      const categoriesData = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleEdit = (setting) => {
    setEditingId(setting.id);
    setForm({
      leave_year: setting.leave_year,
      categoryType: "single",
      employee_category: String(setting.employee_category) || "",
      designationType: "single",
      designation: String(setting.designation) || "",
      casual_leave_days: setting.casual_leave_days ?? 0,
      sick_leave_days: setting.sick_leave_days ?? 0,
      earned_leave_days: setting.earned_leave_days ?? 0,
      maternity_leave_days: setting.maternity_leave_days ?? 0,
      paternity_leave_days: setting.paternity_leave_days ?? 0,
      funeral_leave_days: setting.funeral_leave_days ?? 0,
      compensatory_leave_days: setting.compensatory_leave_days ?? 0,
      unpaid_leave_days: setting.unpaid_leave_days ?? 0,
      carry_forward: !!setting.carry_forward,
      next_year_adjustment: !!setting.next_year_adjustment,
      sandwitch_leave: !!setting.sandwitch_leave,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      leave_year: new Date().getFullYear(),
      categoryType: "single",
      employee_category: "",
      designationType: "single",
      designation: "",
      casual_leave_days: 0,
      sick_leave_days: 0,
      earned_leave_days: 0,
      maternity_leave_days: 0,
      paternity_leave_days: 0,
      funeral_leave_days: 0,
      compensatory_leave_days: 0,
      unpaid_leave_days: 0,
      carry_forward: false,
      next_year_adjustment: false,
      sandwitch_leave: false,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this leave setting?")) {
      try {
        await api.delete(`/settings/leave-settings/${id}/`);
        alert("Leave setting deleted successfully");
        fetchLeaveSettings();
      } catch (err) {
        console.error("Error deleting leave setting:", err);
        alert("Failed to delete leave setting");
      }
    }
  };

  const handleDeleteInvalid = async () => {
    // Define valid category-designation pairs (normalized for comparison)
    const validPairs = [
      {
        category: "Management",
        designations: ["Asst. Manager", "Manager", "Deputy Manager"],
      },
      { category: "Staff", designations: ["Supervisor", "Supervior"] },
      { category: "Worker", designations: ["Operator"] },
    ];

    // Find all invalid settings
    const invalidSettings = leaveSettings.filter((setting) => {
      const catName = (setting.employee_category_name || "")
        .trim()
        .toLowerCase();
      const desName = (setting.designation_name || "").trim();

      const pair = validPairs.find((p) => p.category.toLowerCase() === catName);
      return (
        !pair ||
        !pair.designations.some(
          (d) => d.trim().toLowerCase() === desName.toLowerCase(),
        )
      );
    });

    if (invalidSettings.length === 0) {
      alert("No invalid entries found.");
      return;
    }

    if (
      window.confirm(
        `Delete ${invalidSettings.length} invalid entries?\n\nKeeping only:\n- Management: Asst. Manager, Manager, Deputy Manager\n- Staff: Supervisor\n- Worker: Operator`,
      )
    ) {
      try {
        for (const setting of invalidSettings) {
          await api.delete(`/settings/leave-settings/${setting.id}/`);
        }
        alert(`Deleted ${invalidSettings.length} invalid entries.`);
        fetchLeaveSettings();
      } catch (err) {
        console.error("Error deleting invalid settings:", err);
        alert("Failed to delete some entries.");
      }
    }
  };

  // Filter designations based on selected employee category when appropriate
  const filteredDesignations =
    form.categoryType === "single" && form.employee_category
      ? designations.filter((d) => {
          const cat = d.employee_category;
          const catId = typeof cat === "object" ? cat.id : cat;
          return Number(catId) === Number(form.employee_category);
        })
      : designations;

  const fetchDesignations = async () => {
    try {
      const res = await api.get("/settings/designations/");
      const designationsData = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      setDesignations(designationsData);
    } catch (err) {
      console.error("Error fetching designations:", err);
    }
  };

  const fetchLeaveSettings = async () => {
    try {
      console.log("Fetching leave settings...");
      const res = await api.get("/settings/leave-settings/");
      console.log("Full response:", res);
      console.log("Response data:", res.data);

      let settingsData = [];
      if (Array.isArray(res.data)) {
        settingsData = res.data;
        console.log("Data is array, length:", settingsData.length);
      } else if (res.data && res.data.results) {
        settingsData = res.data.results;
        console.log("Data is paginated, results length:", settingsData.length);
      } else if (res.data) {
        console.log("Data is object:", res.data);
      }

      console.log("Setting leave settings, count:", settingsData.length);
      setLeaveSettings(settingsData);
    } catch (err) {
      console.error("Error fetching leave settings:", err);
      if (err.response) {
        console.error(
          "Error response:",
          err.response.status,
          err.response.data,
        );
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // If editing a single setting, update it
      if (editingId) {
        const payload = {
          casual_leave_days: parseInt(form.casual_leave_days) || 0,
          sick_leave_days: parseInt(form.sick_leave_days) || 0,
          earned_leave_days: parseInt(form.earned_leave_days) || 0,
          maternity_leave_days: parseInt(form.maternity_leave_days) || 0,
          paternity_leave_days: parseInt(form.paternity_leave_days) || 0,
          funeral_leave_days: parseInt(form.funeral_leave_days) || 0,
          compensatory_leave_days: parseInt(form.compensatory_leave_days) || 0,
          unpaid_leave_days: parseInt(form.unpaid_leave_days) || 0,
          carry_forward: form.carry_forward === true,
          next_year_adjustment: form.next_year_adjustment === true,
          sandwitch_leave: form.sandwitch_leave === true,
          leave_year: parseInt(form.leave_year),
          employee_category: parseInt(form.employee_category),
          designation: parseInt(form.designation),
        };
        try {
          const res = await api.put(
            `/settings/leave-settings/${editingId}/`,
            payload,
          );
          alert("Leave setting updated successfully");
          setEditingId(null);
          fetchLeaveSettings();
        } catch (err) {
          console.error("Error updating leave setting:", err);
          alert("Failed to update leave setting");
        } finally {
          setLoading(false);
        }
        return;
      }
      // Determine which categories to use
      const categoriesToApply =
        form.categoryType === "all"
          ? categories.map((c) => c.id)
          : [parseInt(form.employee_category)];

      // If a single category is selected, limit designations to that category
      const availableDesignations =
        form.categoryType === "single" && form.employee_category
          ? designations.filter((d) => {
              const cat = d.employee_category;
              const catId = typeof cat === "object" ? cat.id : cat;
              return Number(catId) === Number(form.employee_category);
            })
          : designations;

      // Determine which designations to use
      const designationsToApply =
        form.designationType === "all"
          ? availableDesignations.map((d) => d.id)
          : [parseInt(form.designation)];

      // Validate selections
      if (form.categoryType === "single" && !form.employee_category) {
        alert("Please select an Employee Category");
        setLoading(false);
        return;
      }

      if (form.designationType === "single" && !form.designation) {
        alert("Please select a Designation");
        setLoading(false);
        return;
      }

      // Create leave settings for all combinations
      const leaveSettingsData = {
        casual_leave_days: parseInt(form.casual_leave_days) || 0,
        sick_leave_days: parseInt(form.sick_leave_days) || 0,
        earned_leave_days: parseInt(form.earned_leave_days) || 0,
        maternity_leave_days: parseInt(form.maternity_leave_days) || 0,
        paternity_leave_days: parseInt(form.paternity_leave_days) || 0,
        funeral_leave_days: parseInt(form.funeral_leave_days) || 0,
        compensatory_leave_days: parseInt(form.compensatory_leave_days) || 0,
        unpaid_leave_days: parseInt(form.unpaid_leave_days) || 0,
        carry_forward: form.carry_forward === true,
        next_year_adjustment: form.next_year_adjustment === true,
        sandwitch_leave: form.sandwitch_leave === true,
      };

      let successCount = 0;

      // Create leave settings for all combinations
      for (const categoryId of categoriesToApply) {
        for (const designationId of designationsToApply) {
          try {
            const payload = {
              ...leaveSettingsData,
              leave_year: parseInt(form.leave_year),
              employee_category: categoryId,
              designation: designationId,
            };
            console.log("Sending payload:", payload);
            await api.post("/settings/leave-settings/", payload);
            successCount++;
          } catch (err) {
            console.error(
              `Error creating leave settings for category ${categoryId} and designation ${designationId}:`,
              err,
            );
            console.error("Response data:", err.response?.data);
          }
        }
      }

      if (successCount > 0) {
        alert(
          `Leave settings saved successfully for ${successCount} combination(s)`,
        );
        // Reset form
        setForm({
          leave_year: new Date().getFullYear(),
          categoryType: "single",
          employee_category: "",
          designationType: "single",
          designation: "",
          casual_leave_days: 0,
          sick_leave_days: 0,
          earned_leave_days: 0,
          maternity_leave_days: 0,
          paternity_leave_days: 0,
          funeral_leave_days: 0,
          compensatory_leave_days: 0,
          unpaid_leave_days: 0,
          carry_forward: false,
          next_year_adjustment: false,
          sandwitch_leave: false,
        });
        // Refresh the list
        fetchLeaveSettings();
      } else {
        alert("Failed to save leave settings");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving leave settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold mb-6">Leave Settings</h2>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {/* Form Section */}
        <div>
          <div className="border rounded p-4 bg-gray-50">
            {/* Year, Category, Designation - Side by Side */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {/* Year */}
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    For the
                  </label>
                  <label className="block mb-1 font-semibold text-sm">
                    Year
                  </label>
                  <input
                    type="number"
                    name="leave_year"
                    value={form.leave_year}
                    onChange={handleChange}
                    className="border p-2 rounded w-full text-sm"
                  />
                </div>

                {/* Employee Category Section */}
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    Employee Category
                  </label>
                  <div className="flex gap-2 mb-2">
                    <label className="flex items-center text-xs">
                      <input
                        type="radio"
                        name="categoryType"
                        value="single"
                        checked={form.categoryType === "single"}
                        onChange={handleRadioChange}
                        className="mr-1"
                      />
                      Single
                    </label>
                    <label className="flex items-center text-xs">
                      <input
                        type="radio"
                        name="categoryType"
                        value="all"
                        checked={form.categoryType === "all"}
                        onChange={handleRadioChange}
                        className="mr-1"
                      />
                      All
                    </label>
                  </div>

                  {form.categoryType === "single" && (
                    <select
                      name="employee_category"
                      value={form.employee_category}
                      onChange={handleChange}
                      className="border p-2 rounded w-full text-xs"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {form.categoryType === "all" && (
                    <p className="text-xs text-gray-600">
                      All {categories.length} categories
                    </p>
                  )}
                </div>

                {/* Designation Section */}
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    Designation
                  </label>
                  <div className="flex gap-2 mb-2">
                    <label className="flex items-center text-xs">
                      <input
                        type="radio"
                        name="designationType"
                        value="single"
                        checked={form.designationType === "single"}
                        onChange={handleRadioChange}
                        className="mr-1"
                      />
                      Single
                    </label>
                    <label className="flex items-center text-xs">
                      <input
                        type="radio"
                        name="designationType"
                        value="all"
                        checked={form.designationType === "all"}
                        onChange={handleRadioChange}
                        className="mr-1"
                      />
                      All
                    </label>
                  </div>

                  {form.designationType === "single" && (
                    <select
                      name="designation"
                      value={form.designation}
                      onChange={handleChange}
                      className="border p-2 rounded w-full text-xs"
                    >
                      <option value="">Select Designation</option>
                      {filteredDesignations.map((des) => {
                        const cat = des.employee_category;
                        const catId = typeof cat === "object" ? cat.id : cat;
                        const catName =
                          (typeof cat === "object" && cat.name) ||
                          (
                            categories.find(
                              (c) => Number(c.id) === Number(catId),
                            ) || {}
                          ).name ||
                          catId;
                        return (
                          <option key={des.id} value={des.id}>
                            {des.name} {catName ? `— ${catName}` : ""}
                          </option>
                        );
                      })}
                    </select>
                  )}
                  {form.designationType === "all" && (
                    <p className="text-xs text-gray-600">
                      All {filteredDesignations.length} designations
                    </p>
                  )}
                </div>
              </div>

              {/* Leave Days - Side by Side */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Leave Days</h4>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    ["casual_leave_days", "Casual"],
                    ["sick_leave_days", "Sick"],
                    ["earned_leave_days", "Earned"],
                    ["maternity_leave_days", "Maternity"],
                    ["paternity_leave_days", "Paternity"],
                    ["funeral_leave_days", "Funeral"],
                    ["compensatory_leave_days", "Compensatory"],
                    ["unpaid_leave_days", "Unpaid"],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <label className="text-xs font-semibold block mb-1">
                        {label}
                      </label>
                      <input
                        type="number"
                        name={key}
                        value={form[key]}
                        onChange={handleChange}
                        min="0"
                        className="border p-2 rounded w-full text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Policies */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Policies</h4>
                <div className="grid grid-cols-3 gap-4">
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      name="carry_forward"
                      checked={form.carry_forward}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Carry Forward
                  </label>
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      name="next_year_adjustment"
                      checked={form.next_year_adjustment}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Next Year Adjustment
                  </label>
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      name="sandwitch_leave"
                      checked={form.sandwitch_leave}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Sandwich Leave
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {loading ? "Saving..." : editingId ? "Update" : "Save"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full mt-2 bg-gray-300 text-black px-4 py-2 rounded font-semibold hover:bg-gray-400 text-sm"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>
        </div>

        {/* List Section */}
        <div>
          <div className="flex justify-between items-center mb-4 mt-4">
            <h3 className="font-semibold">Leave Settings List</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteInvalid}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Delete Invalid
              </button>
              <button
                onClick={fetchLeaveSettings}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Refresh
              </button>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="mr-2"
                />
                Auto-refresh
              </label>
              <input
                type="number"
                min="1"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
                className="border rounded p-1 w-16 text-sm"
                title="Seconds"
              />
            </div>
          </div>
          {leaveSettings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Year</th>
                    <th className="border p-2 text-left">Category</th>
                    <th className="border p-2 text-left">Designation</th>
                    <th className="border p-2 text-center">CL</th>
                    <th className="border p-2 text-center">SL</th>
                    <th className="border p-2 text-center">EL</th>
                    <th className="border p-2 text-center">ML</th>
                    <th className="border p-2 text-center">PL</th>
                    <th className="border p-2 text-center">FL</th>
                    <th className="border p-2 text-center">COMP</th>
                    <th className="border p-2 text-center">UL</th>
                    <th className="border p-2 text-center">CF</th>
                    <th className="border p-2 text-center">NYA</th>
                    <th className="border p-2 text-center">SWL</th>
                    <th className="border p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveSettings.map((setting) => (
                    <tr key={setting.id} className="hover:bg-gray-50">
                      <td className="border p-2">{setting.leave_year}</td>
                      <td className="border p-2">
                        {setting.employee_category_name || "N/A"}
                      </td>
                      <td className="border p-2">
                        {setting.designation_name || "N/A"}
                      </td>
                      <td className="border p-2 text-center">
                        {setting.casual_leave_days}
                      </td>
                      <td className="border p-2 text-center">
                        {setting.sick_leave_days}
                      </td>
                      <td className="border p-2 text-center">
                        {setting.earned_leave_days}
                      </td>
                      <td className="border p-2 text-center">
                        {setting.maternity_leave_days}
                      </td>
                      <td className="border p-2 text-center">
                        {setting.paternity_leave_days}
                      </td>
                      <td className="border p-2 text-center">
                        {setting.funeral_leave_days}
                      </td>
                      <td className="border p-2 text-center">
                        {setting.compensatory_leave_days}
                      </td>
                      <td className="border p-2 text-center">
                        {setting.unpaid_leave_days}
                      </td>
                      <td className="border p-2 text-center">
                        {setting.carry_forward ? "✓" : "✗"}
                      </td>
                      <td className="border p-2 text-center">
                        {setting.next_year_adjustment ? "✓" : "✗"}
                      </td>
                      <td className="border p-2 text-center">
                        {setting.sandwitch_leave ? "✓" : "✗"}
                      </td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => handleEdit(setting)}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-xs mr-1 hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(setting.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No leave settings found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveSettingsForm;
