import { useEffect, useState } from "react";
import api from "../../lib/api";

const LeaveApproval = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(""); // P, A, R
  const [searchEmployee, setSearchEmployee] = useState("");

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get("/leave-apply/");
      const leaveData = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      setLeaves(leaveData);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const approve = async (id) => {
    await api.post(`/leave-apply/${id}/approve/`, {
      approved_by: "HR Admin",
    });
    fetchLeaves();
  };

  const reject = async (id) => {
    await api.post(`/leave-apply/${id}/reject/`);
    fetchLeaves();
  };

  const filteredLeaves = leaves.filter((leave) => {
    const statusMatch = !filterStatus || leave.status === filterStatus;
    const searchMatch =
      !searchEmployee ||
      (leave.employee_name &&
        leave.employee_name
          .toLowerCase()
          .includes(searchEmployee.toLowerCase())) ||
      (leave.employee_code &&
        leave.employee_code
          .toLowerCase()
          .includes(searchEmployee.toLowerCase()));
    return statusMatch && searchMatch;
  });

  const getStatusBadge = (status) => {
    const statusMap = {
      P: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
      A: { label: "Approved", color: "bg-green-100 text-green-800" },
      R: { label: "Rejected", color: "bg-red-100 text-red-800" },
    };
    const config = statusMap[status] || {
      label: "Unknown",
      color: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div>
      <h1 className="text-xl font-semibold">Leave Approval</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
            >
              <option value="">All Status</option>
              <option value="P">Pending</option>
              <option value="A">Approved</option>
              <option value="R">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Search Employee
            </label>
            <input
              type="text"
              placeholder="Employee Name or Code"
              value={searchEmployee}
              onChange={(e) => setSearchEmployee(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchLeaves}
              className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 w-full"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Leave List Table */}
      <div className="bg-white mt-4 rounded-xl shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : filteredLeaves.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No leave applications found
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2">Employee</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Dates</th>
                <th className="px-3 py-2">Days</th>
                <th className="px-3 py-2">Reason</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeaves.map((item) => (
                <tr
                  key={item.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-3 py-2">
                    <div className="font-semibold">
                      {item.employee_name || "N/A"}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {item.employee_code}
                    </div>
                  </td>
                  <td className="px-3 py-2">{item.leave_type_name}</td>
                  <td className="px-3 py-2">
                    {item.start_date} → {item.end_date}
                  </td>
                  <td className="px-3 py-2">{item.total_days}</td>
                  <td className="px-3 py-2 text-gray-600 max-w-xs truncate">
                    {item.reason || "-"}
                  </td>
                  <td className="px-3 py-2">{getStatusBadge(item.status)}</td>
                  <td className="px-3 py-2">
                    {item.status === "P" ? (
                      <>
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                          onClick={() => approve(item.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded"
                          onClick={() => reject(item.id)}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-gray-800">
            {leaves.length}
          </div>
          <div className="text-gray-600 text-sm">Total Applications</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-yellow-600">
            {leaves.filter((l) => l.status === "P").length}
          </div>
          <div className="text-gray-600 text-sm">Pending</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-green-600">
            {leaves.filter((l) => l.status === "A").length}
          </div>
          <div className="text-gray-600 text-sm">Approved</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-red-600">
            {leaves.filter((l) => l.status === "R").length}
          </div>
          <div className="text-gray-600 text-sm">Rejected</div>
        </div>
      </div>
    </div>
  );
};

export default LeaveApproval;
