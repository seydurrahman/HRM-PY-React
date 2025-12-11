import { useState, useEffect } from "react";
import api from "../../lib/api";

const LoanType = () => {
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({
    name: "",
    max_amount: "",
    interest_rate: ""
  });

  const save = async () => {
    await api.post("/loan-types/", form);
    alert("Loan Type Added");
  };

  useEffect(() => {
    api.get("/loan-types/").then(res => setTypes(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold">Loan Types</h1>

      <div className="bg-white p-4 mt-4 shadow-sm rounded-xl space-y-3">

        <input className="border p-2 w-full" placeholder="Name"
          onChange={e=>setForm({...form, name:e.target.value})}
        />

        <input className="border p-2 w-full" placeholder="Max Amount"
          onChange={e=>setForm({...form, max_amount:e.target.value})}
        />

        <input className="border p-2 w-full" placeholder="Interest %"
          onChange={e=>setForm({...form, interest_rate:e.target.value})}
        />

        <button className="bg-slate-900 text-white px-4 py-2 rounded" onClick={save}>
          Add
        </button>

      </div>

      <h2 className="mt-6 font-semibold">Existing Types</h2>
      <pre>{JSON.stringify(types, null, 2)}</pre>
    </div>
  );
};

export default LoanType;
