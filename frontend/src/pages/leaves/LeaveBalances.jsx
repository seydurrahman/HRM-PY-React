import { useEffect, useState } from "react";
import api from "../../lib/api";

const LeaveBalances = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    api.get("/leave-balances/").then((res) => setList(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold">Leave Balances</h1>

      <div className="bg-white rounded-xl shadow-sm mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">Employee</th>
              <th className="px-3 py-2">Leave Type</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Used</th>
              <th className="px-3 py-2">Remaining</th>
            </tr>
          </thead>

          <tbody>
            {list.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-3 py-2">{row.employee_name}</td>
                <td className="px-3 py-2">{row.leave_type_name}</td>
                <td className="px-3 py-2">{row.total}</td>
                <td className="px-3 py-2">{row.used}</td>
                <td className="px-3 py-2">{row.remaining}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default LeaveBalances;
