import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function OT_Eligibility() {
  const [settings, setSettings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);

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
      setSettings(settingsRes.data);
      setCategories(categoriesRes.data);
      setDesignations(designationsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEligibility = async (categoryId, designationId) => {
    setLoading(true);
    try {
      const existingSetting = settings.find(
        (s) =>
          s.employee_category === categoryId && s.designation === designationId,
      );

      if (existingSetting) {
        await api.delete(
          `/settings/ot-eligibility-settings/${existingSetting.id}/`,
        );
      } else {
        await api.post("/settings/ot-eligibility-settings/", {
          employee_category: categoryId,
          designation: designationId,
        });
      }

      fetchData();
    } catch (error) {
      console.error("Error toggling eligibility:", error);
    } finally {
      setLoading(false);
    }
  };

  const isEligible = (categoryId, designationId) => {
    return settings.some(
      (s) =>
        s.employee_category === categoryId && s.designation === designationId,
    );
  };

  return (
    <form>
      <div className="p-6 space-y-4">
        <h1 className="text-xl font-bold mb-4">OT Eligibility Settings</h1>

        {loading && <p>Loading...</p>}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {!loading && (
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Employee Category \ Designation
                  </th>
                  {designations.map((des) => (
                    <th
                      key={des.id}
                      className="border border-gray-300 px-4 py-2 text-left"
                    >
                      {des.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td className="border border-gray-300 px-4 py-2">
                      {cat.name}
                    </td>
                    {designations.map((des) => (
                      <td
                        key={des.id}
                        className="border border-gray-300 px-4 py-2"
                      >
                        <button
                          type="button"
                          onClick={() => toggleEligibility(cat.id, des.id)}
                          disabled={loading}
                          className={`px-3 py-1 rounded ${
                            isEligible(cat.id, des.id)
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {isEligible(cat.id, des.id) ? "Yes" : "No"}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </form>
  );
}
