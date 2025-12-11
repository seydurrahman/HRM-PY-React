import { useEffect, useState } from "react";
import api from "../../lib/api";

const CandidateList = () => {
  const [rows, setRows] = useState([]);

  useEffect(()=> api.get("/candidates/").then(r=>setRows(r.data)),[]);

  const advance = async (id, status) => {
    await api.post(`/candidates/${id}/advance_status/`, { status });
    setRows(rows.map(r => r.id===id ? {...r, status} : r));
  };

  return (
    <div>
      <h1 className="text-xl font-semibold">Candidates</h1>
      <div className="bg-white rounded-xl mt-4 shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Requisition</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r=>(
              <tr className="border-t" key={r.id}>
                <td className="px-3 py-2">{r.first_name} {r.last_name}</td>
                <td className="px-3 py-2">{r.email}</td>
                <td className="px-3 py-2">{r.requisition_title}</td>
                <td className="px-3 py-2">{r.status}</td>
                <td className="px-3 py-2">
                  <button className="px-2 py-1 mr-2 bg-blue-600 text-white rounded" onClick={()=>advance(r.id,"SC")}>Screen</button>
                  <button className="px-2 py-1 mr-2 bg-green-600 text-white rounded" onClick={()=>advance(r.id,"SH")}>Shortlist</button>
                  <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={()=>advance(r.id,"RJ")}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateList;
