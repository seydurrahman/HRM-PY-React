import { useEffect, useState } from "react";
import api from "../../lib/api";

const LeaveBalances = () => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/leave-balances/")
      .then((res) => {
        console.log("API Response:", res.data);
        setList(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredList = list.filter((row) => {
    if (!searchTerm) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      row.employee_id?.toString().toLowerCase().includes(searchLower) ||
      row.employee_name?.toLowerCase().includes(searchLower)
    );
  });

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold">Leave Balances</h1>

      <div className="mt-4 mb-4">
        <input
          type="text"
          placeholder="Search by ID or Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchTerm && (
          <p className="text-xs text-gray-500 mt-1">
            Found: {filteredList.length} records
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">ID No</th>
              <th className="px-3 py-2">Employee</th>
              <th className="px-3 py-2">Leave Type</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Used</th>
              <th className="px-3 py-2">Remaining</th>
            </tr>
          </thead>

          <tbody>
            {filteredList.length > 0 ? (
              filteredList.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="px-3 py-2">{row.employee_id}</td>
                  <td className="px-3 py-2">{row.employee_name}</td>
                  <td className="px-3 py-2">{row.leave_type_name}</td>
                  <td className="px-3 py-2">{row.total}</td>
                  <td className="px-3 py-2">{row.used}</td>
                  <td className="px-3 py-2">{row.remaining}</td>
                </tr>
              ))
            ) : searchTerm ? (
              <tr>
                <td colSpan="6" className="px-3 py-2 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveBalances;
