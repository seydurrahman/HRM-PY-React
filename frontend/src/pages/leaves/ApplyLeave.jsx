import { useEffect, useState } from "react";
import api from "../../lib/api";

const ApplyLeave = () => {
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({
    employee: "",
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: ""
  });

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    api.get("/leave-types/").then(res => setTypes(res.data));
    api.get("/employees/").then(res => setEmployees(res.data));
  }, []);

  const applyLeave = async () => {
    const start = new Date(form.start_date);
    const end = new Date(form.end_date);
    const diff = (end - start) / (1000 * 3600 * 24) + 1;

    await api.post("/leave-apply/", {
      ...form,
      total_days: diff,
    });

    alert("Leave Applied");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Apply Leave</h1>

      <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">

        <select
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, employee: e.target.value })}
        >
          <option>Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>{emp.code}</option>
          ))}
        </select>

        <select
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
        >
          <option>Select Leave Type</option>
          {types.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <input
          type="date"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
        />

        <input
          type="date"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
        />

        <textarea
          className="border p-2 w-full"
          placeholder="Reason"
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />

        <button onClick={applyLeave} className="bg-slate-900 text-white px-4 py-2 rounded">
          Apply
        </button>
      </div>
    </div>
  );
};

export default ApplyLeave;
