import { useEffect, useState } from "react";
import api from "../../lib/api";

const SalarySheet = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/salary/").then(res => setRows(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold">Salary Sheet</h1>

      <div className="bg-white rounded-xl shadow-sm mt-4 overflow-x-auto">

        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">Employee</th>
              <th className="px-3 py-2">Basic</th>
              <th className="px-3 py-2">Earnings</th>
              <th className="px-3 py-2">Deductions</th>
              <th className="px-3 py-2">Net Salary</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">{r.employee_name}</td>
                <td className="px-3 py-2">{r.basic}</td>
                <td className="px-3 py-2">{r.total_earnings}</td>
                <td className="px-3 py-2">{r.total_deductions}</td>
                <td className="px-3 py-2 font-semibold">{r.net_salary}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
};

export default SalarySheet;
