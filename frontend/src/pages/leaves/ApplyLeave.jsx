import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

const ApplyLeave = () => {
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee: "",
    leave_type: "",
    application_for: "",
    start_date: "",
    end_date: "",
    rejoin_date: "",
    reason: "",
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [leaveSettings, setLeaveSettings] = useState([]);
  const [employeeLeaveBalance, setEmployeeLeaveBalance] = useState(null);
  const [appliedLeaves, setAppliedLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dropdown Leaves Types
  const leaveTypes = [
    { id: 1, name: "Casual Leave" },
    { id: 2, name: "Sick Leave" },
    { id: 3, name: "Earned Leave" },
    { id: 4, name: "Maternity Leave" },
    { id: 5, name: "Paternity Leave" },
    { id: 6, name: "Funeral Leave" },
    { id: 7, name: "Compensatory Leave" },
    { id: 8, name: "Unpaid Leave" },
  ];

  useEffect(() => {
    api.get("/leave-types/").then((res) => setTypes(res.data));
    api.get("/employees/").then((res) => {
      const empData = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      setEmployees(empData);
    });
    api.get("/settings/leave-settings/").then((res) => {
      const settingsData = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      setLeaveSettings(settingsData);
    });
  }, []);

  const handleEmployeeChange = async (e) => {
    const empId = e.target.value;
    setForm({ ...form, employee: empId });

    if (!empId) {
      setSelectedEmployee(null);
      setEmployeeLeaveBalance(null);
      return;
    }

    try {
      // Fetch employee details
      const empRes = await api.get(`/employees/${empId}/`);
      const emp = empRes.data;
      setSelectedEmployee(emp);

      // Fetch applied leaves for this employee
      try {
        const leavesRes = await api.get(`/leave-apply/?employee=${empId}`);
        const appliedData = Array.isArray(leavesRes.data)
          ? leavesRes.data
          : leavesRes.data.results || [];
        setAppliedLeaves(appliedData);
      } catch (err) {
        console.warn("Could not fetch applied leaves:", err);
        setAppliedLeaves([]);
      }

      // TODO: Fetch leave balance when endpoint is available
      // const balRes = await api.get(`/leave-balance/?employee=${empId}`);
      // const balData = Array.isArray(balRes.data)
      //   ? balRes.data
      //   : balRes.data.results || [];
      // setEmployeeLeaveBalance(balData);
    } catch (err) {
      console.error("Error fetching employee details:", err);
    }
  };

  const calculateTotalDays = () => {
    if (form.start_date && form.end_date) {
      const start = new Date(form.start_date);
      const end = new Date(form.end_date);
      const diff = (end - start) / (1000 * 3600 * 24) + 1;
      return diff > 0 ? diff : 0;
    }
    return 0;
  };

  const handleEndDateChange = (e) => {
    const endDate = e.target.value;
    setForm({ ...form, end_date: endDate });
    // Auto-set rejoin date to day after end date
    if (endDate) {
      const rejoinDate = new Date(endDate);
      rejoinDate.setDate(rejoinDate.getDate() + 1);
      setForm((prev) => ({
        ...prev,
        end_date: endDate,
        rejoin_date: rejoinDate.toISOString().split("T")[0],
      }));
    }
  };

  const getAppliedAndBalance = (leaveTypeId, totalDays) => {
    // Sum total applied days for this leave type (only approved leaves)
    const appliedDays = appliedLeaves
      .filter(
        (app) =>
          Number(app.leave_type) === Number(leaveTypeId) && app.status === "A",
      )
      .reduce((sum, app) => sum + (Number(app.total_days) || 0), 0);

    const balance = totalDays - appliedDays;
    return { applied: appliedDays, balance: balance >= 0 ? balance : 0 };
  };

  const applyLeave = async () => {
    if (
      !form.employee ||
      !form.leave_type ||
      !form.start_date ||
      !form.end_date
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const totalDays = calculateTotalDays();
      const rejoinDate = new Date(form.end_date);
      rejoinDate.setDate(rejoinDate.getDate() + 1);

      const payload = {
        employee: parseInt(form.employee),
        leave_type: parseInt(form.leave_type),
        application_for: form.application_for,
        start_date: form.start_date,
        end_date: form.end_date,
        rejoin_after_leave: rejoinDate.toISOString().split("T")[0],
        total_days: parseFloat(totalDays).toFixed(2),
        reason: form.reason || "",
      };

      console.log("Sending payload:", payload);

      await api.post("/leave-apply/", payload);
      alert("Leave Applied Successfully");
      setForm({
        employee: "",
        leave_type: "",
        application_for: "",
        start_date: "",
        end_date: "",
        rejoin_date: "",
        reason: "",
      });
      setSelectedEmployee(null);
      setEmployeeLeaveBalance(null);
      setAppliedLeaves([]);

      // Navigate to Leave List page
      navigate("/leave/history");
    } catch (err) {
      console.error("Error applying leave:", err);
      console.error("Response data:", err.response?.data);
      const errorMessage =
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        err.message;
      alert("Failed to apply leave: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeLeaveSettings = () => {
    if (!selectedEmployee) return null;

    console.log("Selected Employee:", selectedEmployee);
    console.log("Leave Settings:", leaveSettings);

    // Employee has designation ID
    const empDesignationId = selectedEmployee.designation || 3;

    console.log("Filtering by Designation ID:", empDesignationId);

    if (!empDesignationId) {
      console.warn("Missing designation ID");
      return [];
    }

    // Filter leave settings by designation
    const filtered = leaveSettings.filter(
      (setting) => Number(setting.designation) === Number(empDesignationId),
    );

    console.log("Filtered Settings:", filtered);
    return filtered;
  };

  const totalDays = calculateTotalDays();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold mb-6">Apply Leave</h1>

      {/* Top Section - Application Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Leave Application</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Employee Selection */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Employee ID
            </label>
            <select
              className="border p-2 w-full rounded text-sm"
              value={form.employee}
              onChange={handleEmployeeChange}
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.code} - {emp.first_name}
                </option>
              ))}
            </select>
          </div>

          {/* Leave Type */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Leave Type
            </label>
            <select
              className="border p-2 w-full rounded text-sm"
              value={form.leave_type}
              onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
            >
              <option value="">Select Leave Type</option>
              {leaveTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Application For */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Application For
            </label>
            <select
              className="border p-2 w-full rounded text-sm"
              value={form.application_for}
              onChange={(e) =>
                setForm({ ...form, application_for: e.target.value })
              }
            >
              <option value="">Select</option>
              <option value="Advance Leave">Advance Leave</option>
              <option value="Absent Leave">Absent Leave</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Start Date
            </label>
            <input
              type="date"
              className="border p-2 w-full rounded text-sm"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-semibold mb-1">End Date</label>
            <input
              type="date"
              className="border p-2 w-full rounded text-sm"
              value={form.end_date}
              onChange={handleEndDateChange}
            />
          </div>

          {/* Rejoin Date */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Rejoin Date
            </label>
            <input
              type="date"
              className="border p-2 w-full rounded text-sm bg-gray-50"
              value={form.rejoin_date}
              readOnly
            />
          </div>

          {/* Total Days */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Total Days
            </label>
            <input
              type="number"
              className="border p-2 w-full rounded text-sm bg-gray-50"
              value={totalDays}
              readOnly
            />
          </div>
          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold mb-1">Reason</label>
            <textarea
              className="border p-2 w-full rounded text-sm"
              placeholder="Enter reason for leave"
              rows="1"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
          </div>
        </div>

        <button
          onClick={applyLeave}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Applying..." : "Apply Leave"}
        </button>
      </div>

      {/* Bottom Section - Employee Info & Leave Summary */}
      {selectedEmployee && (
        <div className="grid grid-cols-2 gap-6">
          {/* Employee Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Employee Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold">Name:</span>
                <span>
                  {selectedEmployee.first_name} {selectedEmployee.last_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Employee ID:</span>
                <span>{selectedEmployee.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Department:</span>
                <span>{selectedEmployee.department_name || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Section:</span>
                <span>{selectedEmployee.section_name || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Designation:</span>
                <span>{selectedEmployee.designation_name || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Leave Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Leave Summary</h2>
            {getEmployeeLeaveSettings().length > 0 ? (
              <div className="space-y-3">
                {getEmployeeLeaveSettings().map((setting, idx) => (
                  <div key={idx} className="border-b pb-3">
                    <div className="font-semibold text-blue-600 mb-2">
                      {setting.leave_year}
                    </div>
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-100 border-b">
                          <th className="text-left p-1 font-semibold">
                            Leave Type
                          </th>
                          <th className="text-center p-1 font-semibold">
                            Allotted
                          </th>
                          <th className="text-center p-1 font-semibold">
                            Applied
                          </th>
                          <th className="text-center p-1 font-semibold">
                            Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-1">Casual</td>
                          <td className="text-center p-1">
                            {setting.casual_leave_days}
                          </td>
                          <td className="text-center p-1">
                            {
                              getAppliedAndBalance(
                                types.find(
                                  (t) => t.name.toLowerCase() === "casual",
                                )?.id || 1,
                                setting.casual_leave_days,
                              ).applied
                            }
                          </td>
                          <td className="text-center p-1 font-semibold text-blue-600">
                            {
                              getAppliedAndBalance(
                                types.find(
                                  (t) => t.name.toLowerCase() === "casual",
                                )?.id || 1,
                                setting.casual_leave_days,
                              ).balance
                            }
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-1">Sick</td>
                          <td className="text-center p-1">
                            {setting.sick_leave_days}
                          </td>
                          <td className="text-center p-1">
                            {
                              getAppliedAndBalance(
                                types.find(
                                  (t) => t.name.toLowerCase() === "sick",
                                )?.id || 2,
                                setting.sick_leave_days,
                              ).applied
                            }
                          </td>
                          <td className="text-center p-1 font-semibold text-blue-600">
                            {
                              getAppliedAndBalance(
                                types.find(
                                  (t) => t.name.toLowerCase() === "sick",
                                )?.id || 2,
                                setting.sick_leave_days,
                              ).balance
                            }
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-1">Earned</td>
                          <td className="text-center p-1">
                            {setting.earned_leave_days}
                          </td>
                          <td className="text-center p-1">
                            {
                              getAppliedAndBalance(
                                types.find(
                                  (t) => t.name.toLowerCase() === "earned",
                                )?.id || 3,
                                setting.earned_leave_days,
                              ).applied
                            }
                          </td>
                          <td className="text-center p-1 font-semibold text-blue-600">
                            {
                              getAppliedAndBalance(
                                types.find(
                                  (t) => t.name.toLowerCase() === "earned",
                                )?.id || 3,
                                setting.earned_leave_days,
                              ).balance
                            }
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-1">Maternity</td>
                          <td className="text-center p-1">
                            {setting.maternity_leave_days}
                          </td>
                          <td className="text-center p-1">
                            {
                              getAppliedAndBalance(
                                types.find(
                                  (t) => t.name.toLowerCase() === "maternity",
                                )?.id || 4,
                                setting.maternity_leave_days,
                              ).applied
                            }
                          </td>
                          <td className="text-center p-1 font-semibold text-blue-600">
                            {
                              getAppliedAndBalance(
                                types.find(
                                  (t) => t.name.toLowerCase() === "maternity",
                                )?.id || 4,
                                setting.maternity_leave_days,
                              ).balance
                            }
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-1">Paternity</td>
                          <td className="text-center p-1">
                            {setting.paternity_leave_days}
                          </td>
                          <td className="text-center p-1">
                            {
                              getAppliedAndBalance(
                                types.find(
                                  (t) => t.name.toLowerCase() === "paternity",
                                )?.id || 5,
                                setting.paternity_leave_days,
                              ).applied
                            }
                          </td>
                          <td className="text-center p-1 font-semibold text-blue-600">
                            {
                              getAppliedAndBalance(
                                types.find(
                                  (t) => t.name.toLowerCase() === "paternity",
                                )?.id || 5,
                                setting.paternity_leave_days,
                              ).balance
                            }
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-1">Funeral</td>
                          <td className="text-center p-1">
                            {setting.funeral_leave_days}
                          </td>
                          <td className="text-center p-1">
                            {
                              getAppliedAndBalance(
                                types.find(
                                  (t) => t.name.toLowerCase() === "funeral",
                                )?.id || 6,
                                setting.funeral_leave_days,
                              ).applied
                            }
                          </td>
                          <td className="text-center p-1 font-semibold text-blue-600">
                            {
                              getAppliedAndBalance(
                                types.find(
                                  (t) => t.name.toLowerCase() === "funeral",
                                )?.id || 6,
                                setting.funeral_leave_days,
                              ).balance
                            }
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-1">Compensatory</td>
                          <td className="text-center p-1">
                            {setting.compensatory_leave_days}
                          </td>
                          <td className="text-center p-1">
                            {
                              getAppliedAndBalance(
                                types.find(
                                  (t) =>
                                    t.name.toLowerCase() === "compensatory",
                                )?.id || 7,
                                setting.compensatory_leave_days,
                              ).applied
                            }
                          </td>
                          <td className="text-center p-1 font-semibold text-blue-600">
                            {
                              getAppliedAndBalance(
                                types.find(
                                  (t) =>
                                    t.name.toLowerCase() === "compensatory",
                                )?.id || 7,
                                setting.compensatory_leave_days,
                              ).balance
                            }
                          </td>
                        </tr>
                        <tr>
                          <td className="p-1">Unpaid</td>
                          <td className="text-center p-1">
                            {setting.unpaid_leave_days}
                          </td>
                          <td className="text-center p-1">
                            {
                              getAppliedAndBalance(
                                types.find(
                                  (t) => t.name.toLowerCase() === "unpaid",
                                )?.id || 8,
                                setting.unpaid_leave_days,
                              ).applied
                            }
                          </td>
                          <td className="text-center p-1 font-semibold text-blue-600">
                            {
                              getAppliedAndBalance(
                                types.find(
                                  (t) => t.name.toLowerCase() === "unpaid",
                                )?.id || 8,
                                setting.unpaid_leave_days,
                              ).balance
                            }
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No leave settings configured for this employee.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyLeave;
