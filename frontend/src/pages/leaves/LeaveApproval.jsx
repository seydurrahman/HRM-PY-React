import { useEffect, useState } from "react";
import api from "../../lib/api";

const LeaveApproval = () => {
  const [list, setList] = useState([]);

  const load = () => {
    api.get("/leave-apply/?status=P").then((res) => setList(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    await api.post(`/leave-apply/${id}/approve/`, {
      approved_by: "HR Admin",
    });
    load();
  };

  const reject = async (id) => {
    await api.post(`/leave-apply/${id}/reject/`);
    load();
  };

  return (
    <div>
      <h1 className="text-xl font-semibold">Leave Approval</h1>

      <div className="bg-white mt-4 rounded-xl shadow-sm overflow-x-auto">

        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">Employee</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Dates</th>
              <th className="px-3 py-2">Days</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {list.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-3 py-2">{item.employee_name}</td>
                <td className="px-3 py-2">{item.leave_type_name}</td>
                <td className="px-3 py-2">{item.start_date} → {item.end_date}</td>
                <td className="px-3 py-2">{item.total_days}</td>
                <td className="px-3 py-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                    onClick={() => approve(item.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => reject(item.id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default LeaveApproval;
