import { useEffect, useState } from "react";
import api from "../../lib/api";

const LoanApproval = () => {
  const [list, setList] = useState([]);

  const load = () => {
    api.get("/loan-request/?status=P").then(res => setList(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    await api.post(`/loan-request/${id}/approve/`);
    load();
  };

  const reject = async (id) => {
    await api.post(`/loan-request/${id}/reject/`);
    load();
  };

  return (
    <div>
      <h1 className="text-xl font-semibold">Loan Approval</h1>

      <div className="bg-white mt-4 shadow-sm rounded-xl overflow-x-auto">

        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2">Employee</th>
              <th className="px-3 py-2">Loan Type</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Months</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {list.map(item => (
              <tr key={item.id} className="border-t">
                <td className="px-3 py-2">{item.employee_name}</td>
                <td className="px-3 py-2">{item.loan_type_name}</td>
                <td className="px-3 py-2">{item.requested_amount}</td>
                <td className="px-3 py-2">{item.installment_months}</td>
                <td className="px-3 py-2">
                  <button onClick={()=>approve(item.id)} className="bg-green-600 text-white px-3 py-1 rounded mr-2">
                    Approve
                  </button>
                  <button onClick={()=>reject(item.id)} className="bg-red-600 text-white px-3 py-1 rounded">
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

export default LoanApproval;
