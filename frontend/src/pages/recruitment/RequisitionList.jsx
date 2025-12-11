import { useEffect, useState } from "react";
import api from "../../lib/api";

const RequisitionList = () => {
  const [rows, setRows] = useState([]);

  useEffect(()=> {
    api.get("/requisitions/").then(res => setRows(res.data));
  },[]);

  return (
    <div>
      <h1 className="text-xl font-semibold">Job Requisitions</h1>
      <div className="bg-white rounded-xl shadow-sm mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">Code</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Dept</th>
              <th className="px-3 py-2">Vacancies</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">{r.code}</td>
                <td className="px-3 py-2">{r.title}</td>
                <td className="px-3 py-2">{r.department}</td>
                <td className="px-3 py-2">{r.vacancies}</td>
                <td className="px-3 py-2">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequisitionList;
