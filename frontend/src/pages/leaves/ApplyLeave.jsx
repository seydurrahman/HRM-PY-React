import { useEffect, useState } from "react";
import api from "../../lib/api";

const ApplyLeave = () => {
  const [types, setTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee: "",
    leave_type: "",
    start_date: "",
    end_date: "",
    rejoin_date: "",
    reason: "",
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [leaveSettings, setLeaveSettings] = useState([]);
  const [employeeLeaveBalance, setEmployeeLeaveBalance] = useState(null);
  const [loading, setLoading] = useState(false);

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
      await api.post("/leave-apply/", {
        ...form,
        total_days: calculateTotalDays(),
      });
      alert("Leave Applied Successfully");
      setForm({
        employee: "",
        leave_type: "",
        start_date: "",
        end_date: "",
        rejoin_date: "",
        reason: "",
      });
      setSelectedEmployee(null);
      setEmployeeLeaveBalance(null);
    } catch (err) {
      console.error("Error applying leave:", err);
      alert("Failed to apply leave");
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
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
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
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">Reason</label>
            <textarea
              className="border p-2 w-full rounded text-sm"
              placeholder="Enter reason for leave"
              rows="3"
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
              <div className="space-y-3 text-sm">
                {getEmployeeLeaveSettings().map((setting, idx) => (
                  <div key={idx} className="border-b pb-3">
                    <div className="font-semibold text-blue-600 mb-2">
                      {setting.leave_year}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Casual: {setting.casual_leave_days}</div>
                      <div>Sick: {setting.sick_leave_days}</div>
                      <div>Earned: {setting.earned_leave_days}</div>
                      <div>Maternity: {setting.maternity_leave_days}</div>
                      <div>Paternity: {setting.paternity_leave_days}</div>
                      <div>Funeral: {setting.funeral_leave_days}</div>
                      <div>Compensatory: {setting.compensatory_leave_days}</div>
                      <div>Unpaid: {setting.unpaid_leave_days}</div>
                    </div>
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
