import { useState, useEffect } from "react";
import api from "../../lib/api";

const LoanRequest = () => {
  const [types, setTypes] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    employee: "",
    loan_type: "",
    requested_amount: "",
    installment_months: "",
    reason: ""
  });

  const submit = async () => {
    await api.post("/loan-request/", form);
    alert("Loan Requested");
  };

  useEffect(() => {
    api.get("/loan-types/").then(res => setTypes(res.data));
    api.get("/employees/").then(res => setEmployees(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold">Loan Request</h1>

      <div className="bg-white p-4 mt-4 rounded-xl shadow-sm space-y-4">

        <select className="border p-2 w-full"
          onChange={e=>setForm({...form, employee:e.target.value})}
        >
          <option>Select Employee</option>
          {employees.map(e => (
            <option key={e.id} value={e.id}>{e.code}</option>
          ))}
        </select>

        <select className="border p-2 w-full"
          onChange={e=>setForm({...form, loan_type:e.target.value})}
        >
          <option>Select Loan Type</option>
          {types.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <input className="border p-2 w-full" placeholder="Requested Amount"
          onChange={e=>setForm({...form, requested_amount:e.target.value})}
        />

        <input className="border p-2 w-full" placeholder="Installment Months"
          onChange={e=>setForm({...form, installment_months:e.target.value})}
        />

        <textarea className="border p-2 w-full" placeholder="Reason"
          onChange={e=>setForm({...form, reason:e.target.value})}
        />

        <button className="bg-slate-900 text-white px-3 py-2 rounded" onClick={submit}>
          Submit Request
        </button>

      </div>
    </div>
  );
};

export default LoanRequest;
