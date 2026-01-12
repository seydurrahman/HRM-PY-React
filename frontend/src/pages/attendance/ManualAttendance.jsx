import { useState, useEffect } from "react";
import api from "../../lib/api";

const ManualAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee: "",
    date: "",
    in_time: "",
    out_time: "",
  });

  useEffect(() => {
    api.get("/employees/").then((res) => setEmployees(res.data));
  }, []);

  const handleSubmit = async () => {
    await api.post("/attendance/", form);
    alert("Attendance saved");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Manual Attendance</h1>

      <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
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

        <input
          type="date"
          className="border border-gray-300 p-2 rounded w-full"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <input
          type="time"
          className="border border-gray-300 p-2 rounded w-full"
          value={form.in_time}
          onChange={(e) => setForm({ ...form, in_time: e.target.value })}
        />

        <input
          type="time"
          className="border border-gray-300 p-2 rounded w-full"
          value={form.out_time}
          onChange={(e) => setForm({ ...form, out_time: e.target.value })}
        />

        <button
          onClick={handleSubmit}
          className="bg-slate-900 text-white px-4 py-2 rounded"
        >
          Save Attendance
        </button>
      </div>
    </div>
  );
};

export default ManualAttendance;
