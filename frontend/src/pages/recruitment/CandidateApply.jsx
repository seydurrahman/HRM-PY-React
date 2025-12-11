import { useState } from "react";
import api from "../../lib/api";

const CandidateApply = () => {
  const [form, setForm] = useState({ requisition: "", first_name:"", last_name:"", email:"", phone:"", cover_letter:""});
  const [resume, setResume] = useState(null);

  const submit = async () => {
    const fd = new FormData();
    Object.keys(form).forEach(k => fd.append(k, form[k]));
    if(resume) fd.append("resume", resume);

    await api.post("/candidates/", fd, { headers: { "Content-Type": "multipart/form-data" }});
    alert("Applied!");
  };

  return (
    <div>
      <h1 className="text-xl font-semibold">Apply for Job</h1>
      <div className="bg-white p-4 mt-4 rounded-xl shadow-sm space-y-3">
        <input className="border p-2 w-full" placeholder="Requisition ID (optional)" onChange={e=>setForm({...form, requisition:e.target.value})} />
        <input className="border p-2 w-full" placeholder="First name" onChange={e=>setForm({...form, first_name:e.target.value})} />
        <input className="border p-2 w-full" placeholder="Last name" onChange={e=>setForm({...form, last_name:e.target.value})} />
        <input className="border p-2 w-full" placeholder="Email" onChange={e=>setForm({...form, email:e.target.value})} />
        <input className="border p-2 w-full" placeholder="Phone" onChange={e=>setForm({...form, phone:e.target.value})} />
        <textarea className="border p-2 w-full" placeholder="Cover letter" onChange={e=>setForm({...form, cover_letter:e.target.value})} />
        <input type="file" onChange={e=>setResume(e.target.files[0])} />
        <button className="bg-slate-900 text-white px-4 py-2 rounded" onClick={submit}>Apply</button>
      </div>
    </div>
  );
};

export default CandidateApply;
