import { useEffect, useState } from "react";
import api from "../../lib/api";

const LeaveHistory = () => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    api.get("/leave-apply/").then((res) => setList(res.data));
  }, []);

  const filteredList = list.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      item.employee_id?.toString().includes(searchLower) ||
      item.employee_name?.toLowerCase().includes(searchLower);

    const matchesDate = !searchDate || item.applied_at?.includes(searchDate);

    return matchesSearch && matchesDate;
  });

  return (
    <div>
      <h1 className="text-xl font-semibold">Leave History</h1>

      <div className="mt-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Search by ID or Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          placeholder="Search by Applied Date..."
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2">ID No</th>
              <th className="px-3 py-2">Employee</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">From</th>
              <th className="px-3 py-2">To</th>
              <th className="px-3 py-2">Days</th>
              <th className="px-3 py-2">Applied Date</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredList.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-3 py-2">{item.employee_id}</td>
                <td className="px-3 py-2">{item.employee_name}</td>
                <td className="px-3 py-2">{item.leave_type_name}</td>
                <td className="px-3 py-2">{item.start_date}</td>
                <td className="px-3 py-2">{item.end_date}</td>
                <td className="px-3 py-2">{item.total_days}</td>
                <td className="px-3 py-2">
                  {new Date(item.applied_at).toLocaleDateString()}
                </td>
                <td className="px-3 py-2">
                  {item.status === "P"
                    ? "Pending"
                    : item.status === "A"
                      ? "Approved"
                      : "Rejected"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveHistory;
