import { useEffect, useState } from "react";
import api from "../../lib/api";

const LoanDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [disbursed, setDisbursed] = useState([]);

  useEffect(() => {
    api.get("/loan-request/").then(res => setRequests(res.data));
    api.get("/loan-disbursement/").then(res => setDisbursed(res.data));
  }, []);

  const totalRequest = requests.reduce((a,b)=>a+parseFloat(b.requested_amount),0);
  const totalDisbursed = disbursed.reduce((a,b)=>a+parseFloat(b.disbursed_amount),0);

  return (
    <div>
      <h1 className="text-xl font-semibold">Loan Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3>Total Loan Requests</h3>
          <p className="text-xl font-bold">{totalRequest}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3>Total Disbursed</h3>
          <p className="text-xl font-bold">{totalDisbursed}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3>Pending Approvals</h3>
          <p className="text-xl font-bold">
            {requests.filter(r=>r.status==="P").length}
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoanDashboard;
