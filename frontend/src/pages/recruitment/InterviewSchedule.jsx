import { useEffect, useState } from "react";
import api from "../../lib/api";

const InterviewSchedule = () => {
  const [candidates, setCandidates] = useState([]);
  const [form, setForm] = useState({ candidate: "", scheduled_at: "", mode: "Onsite", panel: "" });

  useEffect(()=> api.get("/candidates/?status=SH").then(r=>setCandidates(r.data)), []);

  const submit = async () => {
    const payload = { ...form };
    // panel can be comma-separated employee ids
    if(form.panel) payload.panel = form.panel.split(",").map(x=>x.trim());
    await api.post("/interviews/", payload);
    alert("Interview scheduled");
  };

  return (
    <div>
      <h1 className="text-xl font-semibold">Schedule Interview</h1>
      <div className="bg-white p-4 mt-4 rounded-xl shadow-sm space-y-3">
        <select onChange={e=>setForm({...form, candidate:e.target.value})} className="border p-2 w-full">
          <option value="">Select Candidate</option>
          {candidates.map(c=> <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
        </select>

        <input type="datetime-local" className="border p-2 w-full" onChange={e=>setForm({...form, scheduled_at:e.target.value})} />
        <input className="border p-2 w-full" placeholder="Mode (Onsite/Zoom)" onChange={e=>setForm({...form, mode:e.target.value})} />
        <input className="border p-2 w-full" placeholder="Panel employee IDs (comma separated)" onChange={e=>setForm({...form, panel:e.target.value})} />
        <button className="bg-slate-900 text-white px-4 py-2 rounded" onClick={submit}>Schedule</button>
      </div>
    </div>
  );
};

export default InterviewSchedule;
