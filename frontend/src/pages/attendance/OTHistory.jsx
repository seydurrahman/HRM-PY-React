import { useEffect, useState } from "react";
import api from "../../lib/api";

const OTHistory = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    api.get("/ot/").then((res) => setList(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold">OT History</h1>

      <div className="bg-white rounded-xl shadow-sm mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2">Employee</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">OT Hours</th>
              <th className="px-3 py-2">Approved</th>
            </tr>
          </thead>

          <tbody>
            {list.map((item) => (
              <tr className="border-t" key={item.id}>
                <td className="px-3 py-2">{item.employee_name}</td>
                <td className="px-3 py-2">{item.date}</td>
                <td className="px-3 py-2">{item.ot_hours}</td>
                <td className="px-3 py-2">
                  {item.approved ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default OTHistory;
