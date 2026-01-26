import { useState, useEffect } from "react";
import api from "../../lib/api";

const ManualAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee: "",
    date: "",
    in_time: "",
    out_time: "",
    work_hours: "",
    ot_hours: "",
    status: "P",
    is_manual: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
    loadEmployees();
  }, []);

  const handleSubmit = async () => {
    if (!form.employee || !form.date) {
      alert("Please select employee and date");
      return;
    }

    setLoading(true);
    try {
      await api.post("/attendance/", {
        employee: form.employee,
        date: form.date,
        in_time: form.in_time || null,
        out_time: form.out_time || null,
        work_hours: parseFloat(form.work_hours) || 0,
        ot_hours: parseFloat(form.ot_hours) || 0,
        status: form.status,
        is_manual: true,
      });
      alert("Attendance saved successfully");
      setForm({
        employee: "",
        date: "",
        in_time: "",
        out_time: "",
        work_hours: "",
        ot_hours: "",
        status: "P",
        is_manual: true,
      });
    } catch (err) {
      console.error("Error saving attendance:", err);
      alert("Failed to save attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Manual Attendance</h1>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Employee</label>
          <select
            className="border border-gray-300 p-2 rounded w-full"
            value={form.employee}
            onChange={(e) => setForm({ ...form, employee: e.target.value })}
          >
            <option value="">Select Employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.code} - {e.first_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Date</label>
          <input
            type="date"
            className="border border-gray-300 p-2 rounded w-full"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">In Time</label>
            <input
              type="time"
              className="border border-gray-300 p-2 rounded w-full"
              value={form.in_time}
              onChange={(e) => setForm({ ...form, in_time: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Out Time</label>
            <input
              type="time"
              className="border border-gray-300 p-2 rounded w-full"
              value={form.out_time}
              onChange={(e) => setForm({ ...form, out_time: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Work Hours
            </label>
            <input
              type="number"
              step="0.25"
              className="border border-gray-300 p-2 rounded w-full"
              value={form.work_hours}
              onChange={(e) => setForm({ ...form, work_hours: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">OT Hours</label>
            <input
              type="number"
              step="0.25"
              className="border border-gray-300 p-2 rounded w-full"
              value={form.ot_hours}
              onChange={(e) => setForm({ ...form, ot_hours: e.target.value })}
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Status</label>
          <select
            className="border border-gray-300 p-2 rounded w-full"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="P">Present</option>
            <option value="A">Absent</option>
            <option value="W">Weekend</option>
            <option value="H">Holiday</option>
            <option value="L">Leave</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded">
          <input
            type="checkbox"
            id="is_manual"
            checked={form.is_manual}
            disabled
            className="w-4 h-4"
          />
          <label htmlFor="is_manual" className="text-sm font-medium">
            Manual Entry (Auto-checked)
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-slate-900 text-white px-4 py-2 rounded font-medium hover:bg-slate-800 disabled:bg-gray-400"
        >
          {loading ? "Saving..." : "Save Attendance"}
        </button>
      </div>
    </div>
  );
};

export default ManualAttendance;
