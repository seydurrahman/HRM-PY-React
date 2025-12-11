import { useEffect, useState } from "react";
import api from "../../lib/api";

const LeaveEncash = () => {
  const [employees, setEmployees] = useState([]);
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({
    employee: "",
    leave_type: "",
    days_encashed: "",
    encash_date: ""
  });

  useEffect(() => {
    api.get("/employees/").then((res) => setEmployees(res.data));
    api.get("/leave-types/").then((res) => setTypes(res.data));
  }, []);

  const submit = async () => {
    await api.post("/leave-encash/", form);
    alert("Leave Encashed");
  };

  return (
    <div>
      <h1 className="text-xl font-semibold">Leave Encashment</h1>

      <div className="bg-white rounded-xl shadow-sm p-4 mt-4 space-y-4">

        <select
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, employee: e.target.value })}
        >
          <option>Select Employee</option>
          {employees.map((e) => (
            <option value={e.id} key={e.id}>{e.code}</option>
          ))}
        </select>

        <select
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
        >
          <option>Select Leave Type</option>
          {types.map((t) => (
            <option value={t.id} key={t.id}>{t.name}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Days"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, days_encashed: e.target.value })}
        />

        <input
          type="date"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, encash_date: e.target.value })}
        />

        <button onClick={submit} className="bg-slate-900 text-white px-4 py-2 rounded">
          Encash
        </button>

      </div>
    </div>
  );
};

export default LeaveEncash;
