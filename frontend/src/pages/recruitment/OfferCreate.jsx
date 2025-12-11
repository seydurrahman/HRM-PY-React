import { useEffect, useState } from "react";
import api from "../../lib/api";

const OfferCreate = () => {
  const [candidates, setCandidates] = useState([]);
  const [form, setForm] = useState({ candidate: "", offered_ctc: "", joining_date: "" });

  useEffect(()=> api.get("/candidates/?status=IV").then(r=>setCandidates(r.data)), []);

  const submit = async () => {
    await api.post("/offers/", form);
    alert("Offer created");
  };

  return (
    <div>
      <h1 className="text-xl font-semibold">Create Offer</h1>
      <div className="bg-white p-4 mt-4 rounded-xl shadow-sm space-y-3">
        <select onChange={e=>setForm({...form, candidate:e.target.value})} className="border p-2 w-full">
          <option>Select Candidate</option>
          {candidates.map(c=> <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
        </select>
        <input className="border p-2 w-full" placeholder="Offered CTC" onChange={e=>setForm({...form, offered_ctc:e.target.value})}/>
        <input type="date" className="border p-2 w-full" onChange={e=>setForm({...form, joining_date:e.target.value})}/>
        <button className="bg-slate-900 text-white px-4 py-2 rounded" onClick={submit}>Issue Offer</button>
      </div>
    </div>
  );
};

export default OfferCreate;
