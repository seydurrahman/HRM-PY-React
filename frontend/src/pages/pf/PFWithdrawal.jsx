import { useEffect, useState } from "react";
import api from "../../lib/api";

const PFWithdrawal = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee: "",
    amount: "",
    withdrawal_date: "",
    reason: ""
  });

  useEffect(() => {
    api.get("/employees/").then(res => setEmployees(res.data));
  }, []);

  const submit = async () => {
    await api.post("/pf-withdrawal/", form);
    alert("Request submitted");
  };

  return (
    <div>
      <h1 className="text-xl font-semibold">PF Withdrawal Request</h1>

      <div className="bg-white mt-4 p-4 rounded-xl shadow-sm space-y-4">

        <select className="border p-2 w-full"
          onChange={e=>setForm({...form, employee:e.target.value})}
        >
          <option>Select Employee</option>
          {employees.map(e => (
            <option value={e.id} key={e.id}>{e.code}</option>
          ))}
        </select>

        <input className="border p-2 w-full" placeholder="Amount"
          onChange={e=>setForm({...form, amount:e.target.value})}
        />

        <input type="date" className="border p-2 w-full"
          onChange={e=>setForm({...form, withdrawal_date:e.target.value})}
        />

        <textarea className="border p-2 w-full" placeholder="Reason"
          onChange={e=>setForm({...form, reason:e.target.value})}
        />

        <button className="bg-slate-900 text-white px-4 py-2 rounded" onClick={submit}>
          Submit Request
        </button>

      </div>
    </div>
  );
};

export default PFWithdrawal;
