import { useState } from "react";
import api from "../../lib/api";

const Payslip = () => {
  const [data, setData] = useState(null);
  const [emp, setEmp] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const fetchPayslip = () => {
    api.get("/salary/", {
      params: { employee: emp, month, year }
    }).then(res => {
      if (res.data.length) setData(res.data[0]);
      else alert("Payslip not found");
    });
  };

  return (
    <div>
      <h1 className="text-xl font-semibold">Payslip</h1>

      <div className="bg-white p-4 mt-4 rounded-xl shadow-sm flex gap-3">
        <input className="border p-2" placeholder="Emp ID" onChange={e=>setEmp(e.target.value)} />
        <input className="border p-2" placeholder="Month" onChange={e=>setMonth(e.target.value)} />
        <input className="border p-2" placeholder="Year" onChange={e=>setYear(e.target.value)} />
        <button onClick={fetchPayslip} className="bg-slate-900 text-white px-4 py-2 rounded">Find</button>
      </div>

      {data && (
        <div className="bg-white p-4 mt-4 rounded-xl shadow-sm">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Payslip;
