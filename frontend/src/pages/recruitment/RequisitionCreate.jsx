import { useState } from "react";
import api from "../../lib/api";

const RequisitionCreate = () => {
  const [form, setForm] = useState({
    code: "", title: "", department: "", vacancies: 1, description: ""
  });

  const submit = async () => {
    await api.post("/requisitions/", form);
    alert("Created");
  };

  return (
    <div>
      <h1 className="text-xl font-semibold">Create Requisition</h1>
      <div className="bg-white p-4 mt-4 rounded-xl shadow-sm space-y-3">
        <input className="border p-2 w-full" placeholder="Code" onChange={e=>setForm({...form, code:e.target.value})} />
        <input className="border p-2 w-full" placeholder="Title" onChange={e=>setForm({...form, title:e.target.value})} />
        <input className="border p-2 w-full" placeholder="Department" onChange={e=>setForm({...form, department:e.target.value})} />
        <input type="number" className="border p-2 w-full" placeholder="Vacancies" onChange={e=>setForm({...form, vacancies:e.target.value})} />
        <textarea className="border p-2 w-full" placeholder="Description" onChange={e=>setForm({...form, description:e.target.value})} />
        <button className="bg-slate-900 text-white px-4 py-2 rounded" onClick={submit}>Save</button>
      </div>
    </div>
  );
};

export default RequisitionCreate;
