import { useEffect, useState } from "react";
import api from "../../lib/api";

const PFContributionList = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/pf-contribution/").then(res => setRows(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold">PF Contribution List</h1>

      <div className="bg-white rounded-xl shadow-sm mt-4 overflow-x-auto">

        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">Employee</th>
              <th className="px-3 py-2">Employee PF</th>
              <th className="px-3 py-2">Employer PF</th>
              <th className="px-3 py-2">Total</th>
            </tr>
          </thead>

          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">{r.employee_name}</td>
                <td className="px-3 py-2">{r.employee_amount}</td>
                <td className="px-3 py-2">{r.employer_amount}</td>
                <td className="px-3 py-2">{r.total}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default PFContributionList;
