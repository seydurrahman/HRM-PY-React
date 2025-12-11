import { useEffect, useState } from "react";
import api from "../../lib/api";

const LeaveHistory = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    api.get("/leave-apply/").then((res) => setList(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold">Leave History</h1>

      <div className="bg-white rounded-xl shadow-sm mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2">Employee</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">From</th>
              <th className="px-3 py-2">To</th>
              <th className="px-3 py-2">Days</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {list.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-3 py-2">{item.employee_name}</td>
                <td className="px-3 py-2">{item.leave_type_name}</td>
                <td className="px-3 py-2">{item.start_date}</td>
                <td className="px-3 py-2">{item.end_date}</td>
                <td className="px-3 py-2">{item.total_days}</td>
                <td className="px-3 py-2">
                  {item.status === "P" ? "Pending"
                  : item.status === "A" ? "Approved"
                  : "Rejected"}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default LeaveHistory;
