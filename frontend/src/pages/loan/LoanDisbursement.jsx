import { useEffect, useState } from "react";
import api from "../../lib/api";

const LoanDisbursement = () => {
  const [approved, setApproved] = useState([]);
  const [form, setForm] = useState({
    loan_request: "",
    disbursed_amount: "",
    disbursement_date: ""
  });

  useEffect(() => {
    api.get("/loan-request/?status=A").then(res => setApproved(res.data));
  }, []);

  const submit = async () => {
    await api.post("/loan-disbursement/", form);
    alert("Loan Disbursed");
  };

  return (
    <div>
      <h1 className="text-xl font-semibold">Loan Disbursement</h1>

      <div className="bg-white p-4 mt-4 rounded-xl shadow-sm space-y-4">

        <select className="border p-2 w-full"
          onChange={e=>setForm({...form, loan_request:e.target.value})}
        >
          <option>Select Approved Loan</option>
          {approved.map((l) => (
            <option value={l.id} key={l.id}>
              {l.employee_name} - {l.loan_type_name}
            </option>
          ))}
        </select>

        <input className="border p-2 w-full" placeholder="Disbursed Amount"
          onChange={e=>setForm({...form, disbursed_amount:e.target.value})}
        />

        <input type="date" className="border p-2 w-full"
          onChange={e=>setForm({...form, disbursement_date:e.target.value})}
        />

        <button className="bg-slate-900 text-white px-4 py-2 rounded" onClick={submit}>
          Disburse Now
        </button>

      </div>
    </div>
  );
};

export default LoanDisbursement;
