import { useState, useEffect } from "react";
import api from "../../lib/api";

const ManualAttendanceList = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedAttendances, setSelectedAttendances] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editCalculatedData, setEditCalculatedData] = useState({});

  useEffect(() => {
    loadEmployees();
    loadAttendances();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await api.get("/employees/");
      const employeeData = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      setEmployees(employeeData);
    } catch (err) {
      console.error("Error loading employees:", err);
    }
  };

  const loadAttendances = async (date = "", employeeId = "", status = "") => {
    setLoading(true);
    try {
      let url = "/attendance/?is_manual=true";
      if (date) {
        url += `&date=${date}`;
      }
      if (employeeId) {
        url += `&employee=${employeeId}`;
      }
      const res = await api.get(url);
      const attendanceData = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      // Filter for manual attendance only
      let manualAttendances = attendanceData.filter(
        (att) => att.is_manual === true,
      );

      // Apply status filter including below 8 hours as absent
      if (status) {
        if (status === "A") {
          // Absent includes: status = A or work_hours < 8
          manualAttendances = manualAttendances.filter(
            (att) => att.status === "A" || parseFloat(att.work_hours) < 8,
          );
        } else if (status === "P") {
          // Present: status = P AND work_hours >= 8
          manualAttendances = manualAttendances.filter(
            (att) => att.status === "P" && parseFloat(att.work_hours) >= 8,
          );
        } else {
          // Other statuses: W, H, L - check only status
          manualAttendances = manualAttendances.filter(
            (att) => att.status === status,
          );
        }
      }

      // Sort by date (newest first)
      manualAttendances.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAttendances(manualAttendances);
    } catch (err) {
      console.error("Error loading attendances:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (date, employeeId, status) => {
    setDateFilter(date);
    setEmployeeFilter(employeeId);
    setStatusFilter(status);
    loadAttendances(date, employeeId, status);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this attendance record?")
    ) {
      return;
    }
    try {
      await api.delete(`/attendance/${id}/`);
      loadAttendances(dateFilter, employeeFilter, statusFilter);
      alert("Attendance record deleted successfully");
    } catch (err) {
      console.error("Error deleting attendance:", err);
      alert("Failed to delete attendance record");
    }
  };

  const handleEditStart = (attendance) => {
    setEditingId(attendance.id);
    setEditForm({
      in_time: attendance.in_time || "",
      out_time: attendance.out_time || "",
      status: attendance.status,
    });
    setEditCalculatedData({
      work_hours: attendance.work_hours,
      ot_hours: attendance.ot_hours,
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
    setEditCalculatedData({});
  };

  useEffect(() => {
    if (editForm.in_time && editForm.out_time) {
      const inTime = new Date(`2024-01-01 ${editForm.in_time}`);
      const outTime = new Date(`2024-01-01 ${editForm.out_time}`);

      if (outTime < inTime) {
        outTime.setDate(outTime.getDate() + 1);
      }

      const diffMs = outTime - inTime;
      const diffHours = diffMs / (1000 * 60 * 60);
      const workHours = Math.round(diffHours * 4) / 4;
      const otHours = workHours > 8 ? Math.round((workHours - 8) * 4) / 4 : 0;
      const status = workHours >= 8 ? "P" : editForm.status;

      setEditCalculatedData({
        work_hours: workHours.toFixed(2),
        ot_hours: otHours.toFixed(2),
        status: status,
      });
    }
  }, [editForm.in_time, editForm.out_time]);

  const handleEditSave = async (id) => {
    try {
      await api.patch(`/attendance/${id}/`, {
        in_time: editForm.in_time || null,
        out_time: editForm.out_time || null,
        work_hours: parseFloat(editCalculatedData.work_hours) || 0,
        ot_hours: parseFloat(editCalculatedData.ot_hours) || 0,
        status: editCalculatedData.status || editForm.status,
      });
      setEditingId(null);
      loadAttendances(dateFilter, employeeFilter, statusFilter);
      alert("Attendance record updated successfully");
    } catch (err) {
      console.error("Error updating attendance:", err);
      alert("Failed to update attendance record");
    }
  };

  const handleSelectAttendance = (id) => {
    setSelectedAttendances((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedAttendances.length === attendances.length) {
      setSelectedAttendances([]);
    } else {
      setSelectedAttendances(attendances.map((att) => att.id));
    }
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find((e) => e.id === employeeId);
    return employee ? `${employee.code} - ${employee.first_name}` : "Unknown";
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      P: { label: "Present", color: "bg-green-100 text-green-800" },
      A: { label: "Absent", color: "bg-red-100 text-red-800" },
      W: { label: "Weekend", color: "bg-gray-100 text-gray-800" },
      H: { label: "Holiday", color: "bg-blue-100 text-blue-800" },
      L: { label: "Leave", color: "bg-yellow-100 text-yellow-800" },
    };
    const statusInfo = statusMap[status] || {
      label: status,
      color: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.color}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Manual Attendance List</h2>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Filter by Date
            </label>
            <input
              type="date"
              className="border border-gray-300 p-2 rounded w-full"
              value={dateFilter}
              onChange={(e) =>
                handleFilterChange(e.target.value, employeeFilter, statusFilter)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Filter by Employee
            </label>
            <select
              className="border border-gray-300 p-2 rounded w-full"
              value={employeeFilter}
              onChange={(e) =>
                handleFilterChange(dateFilter, e.target.value, statusFilter)
              }
            >
              <option value="">All Employees</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.code} - {e.first_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Filter by Status
            </label>
            <select
              className="border border-gray-300 p-2 rounded w-full"
              value={statusFilter}
              onChange={(e) =>
                handleFilterChange(dateFilter, employeeFilter, e.target.value)
              }
            >
              <option value="">All Status</option>
              <option value="P">Present</option>
              <option value="A">Absent (including &lt; 8 hours)</option>
              <option value="W">Weekend</option>
              <option value="H">Holiday</option>
              <option value="L">Leave</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => handleFilterChange("", "", "")}
          className="mt-4 px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : attendances.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No manual attendance records found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold w-8">
                    <input
                      type="checkbox"
                      checked={
                        selectedAttendances.length === attendances.length &&
                        attendances.length > 0
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Employee
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    In Time
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Out Time
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Work Hours
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    OT Hours
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendances.map((attendance) => {
                  const isEditing = editingId === attendance.id;
                  const workHours = parseFloat(attendance.work_hours) || 0;
                  const isAbsentDueToHours = workHours < 8;
                  const displayStatus =
                    isAbsentDueToHours && attendance.status !== "A"
                      ? "A"
                      : attendance.status;

                  return (
                    <tr
                      key={attendance.id}
                      className={`border-b hover:bg-gray-50 ${
                        isAbsentDueToHours ? "bg-red-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3 text-sm w-8">
                        <input
                          type="checkbox"
                          checked={selectedAttendances.includes(attendance.id)}
                          onChange={() => handleSelectAttendance(attendance.id)}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(attendance.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {getEmployeeName(attendance.employee)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {isEditing ? (
                          <input
                            type="time"
                            value={editForm.in_time}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                in_time: e.target.value,
                              })
                            }
                            className="border border-gray-300 p-1 rounded w-full"
                          />
                        ) : (
                          attendance.in_time || "-"
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {isEditing ? (
                          <input
                            type="time"
                            value={editForm.out_time}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                out_time: e.target.value,
                              })
                            }
                            className="border border-gray-300 p-1 rounded w-full"
                          />
                        ) : (
                          attendance.out_time || "-"
                        )}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm font-semibold ${
                          isAbsentDueToHours ? "bg-red-100 text-red-800" : ""
                        }`}
                      >
                        {isEditing
                          ? editCalculatedData.work_hours ||
                            attendance.work_hours ||
                            0
                          : attendance.work_hours || 0}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {isEditing
                          ? editCalculatedData.ot_hours ||
                            attendance.ot_hours ||
                            0
                          : attendance.ot_hours || 0}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {isEditing ? (
                          <select
                            value={editForm.status}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                status: e.target.value,
                              })
                            }
                            className={`border p-1 rounded text-xs ${
                              isAbsentDueToHours
                                ? "border-red-300 bg-red-50"
                                : "border-gray-300"
                            }`}
                          >
                            <option value="P">Present</option>
                            <option value="A">Absent</option>
                            <option value="W">Weekend</option>
                            <option value="H">Holiday</option>
                            <option value="L">Leave</option>
                          </select>
                        ) : (
                          getStatusBadge(displayStatus)
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm space-x-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleEditSave(attendance.id)}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditStart(attendance)}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(attendance.id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualAttendanceList;
