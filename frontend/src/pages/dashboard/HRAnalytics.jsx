import { useEffect, useState } from "react";
import api from "../../lib/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line
} from "recharts";

const HRAnalytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard/").then(res => {
      setData(res.data);
    });
  }, []);

  if (!data) return <div>Loading dashboard...</div>;

  const COLORS = ["#1e293b", "#64748b", "#0f172a", "#334155"];

  return (
    <div className="space-y-6">

      {/* ---- TOP KPI CARDS ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-slate-500">Total Employees</p>
          <h2 className="text-2xl font-bold">{data.employees.total}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-slate-500">Today Present</p>
          <h2 className="text-2xl font-bold">{data.attendance.present_today}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-slate-500">Payroll Expense (This Month)</p>
          <h2 className="text-2xl font-bold">{data.payroll.monthly_salary}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-slate-500">Loan Disbursed</p>
          <h2 className="text-2xl font-bold">{data.loans.total_disbursed}</h2>
        </div>

      </div>


      {/* ---- ATTENDANCE TREND ---- */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Monthly Attendance Trend</h3>
        <LineChart width={800} height={250}
          data={data.attendance.trend.map(m=>({
            month: "M"+m["date__month"],
            present: m.present
          }))}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="present" stroke="#1e293b" strokeWidth={2}/>
        </LineChart>
      </div>


      {/* ---- RECRUITMENT FUNNEL ---- */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Recruitment Stages</h3>
        <PieChart width={400} height={300}>
          <Pie
            data={Object.keys(data.recruitment.stages).map((key, i)=>({
              name: key,
              value: data.recruitment.stages[key]
            }))}
            cx="50%" cy="50%" outerRadius={110}
            fill="#8884d8" dataKey="value"
            label
          >
            {Object.keys(data.recruitment.stages).map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </div>


      {/* ---- PF & LOAN ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-2">PF Contribution (This Month)</h3>
          <h1 className="text-3xl font-bold">{data.pf.monthly_pf}</h1>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Total Loan Requested</h3>
          <h1 className="text-3xl font-bold">{data.loans.total_requested}</h1>
        </div>

      </div>
    </div>
  );
};

export default HRAnalytics;
