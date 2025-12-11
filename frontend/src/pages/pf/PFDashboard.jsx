import { useEffect, useState } from "react";
import api from "../../lib/api";

const PFDashboard = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/pf-contribution/").then(res => setRows(res.data));
  }, []);

  const totalEmployeePF = rows.reduce((a, b) => a + parseFloat(b.employee_amount), 0);
  const totalEmployerPF = rows.reduce((a, b) => a + parseFloat(b.employer_amount), 0);

  return (
    <div>
      <h1 className="text-xl font-semibold">PF Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3>Total Employee PF</h3>
          <p className="text-xl font-bold">{totalEmployeePF}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3>Total Employer PF</h3>
          <p className="text-xl font-bold">{totalEmployerPF}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3>Total PF Fund</h3>
          <p className="text-xl font-bold">{totalEmployeePF + totalEmployerPF}</p>
        </div>

      </div>
    </div>
  );
};

export default PFDashboard;
