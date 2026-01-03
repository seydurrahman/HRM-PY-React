import { useEffect, useState } from "react";
import api from "../../lib/api.js";
import { Link } from "react-router-dom";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await api.get("/employees/");
        console.log("Employee data:", res.data[0]); // Check what fields are available
        setEmployees(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Employees</h1>
        <Link
          to="/employees/new"
          className="px-3 py-2 text-sm rounded-md bg-slate-900 text-white"
        >
          + New Employee
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-3 py-2">System ID</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Department</th>
              <th className="px-3 py-2">Section</th>
              <th className="px-3 py-2">Designation</th>
              <th className="px-3 py-2">Grade</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="px-3 py-4">
                  Loading...
                </td>
              </tr>
            )}

            {!loading &&
              employees.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="px-3 py-2">{e.code}</td>
                  <td className="px-3 py-2">
                    {e.first_name} {e.last_name}
                  </td>
                  <td className="px-3 py-2">{e.email || "-"}</td>
                  <td className="px-3 py-2">{e.department || "-"}</td>
                  <td className="px-3 py-2">{e.section || "-"}</td>
                  <td className="px-3 py-2">
                    {e.designation_name ||
                      e.designation?.name ||
                      "Not assigned"}
                  </td>
                  <td className="px-3 py-2">
                    {e.grade_name || e.grade?.name || "Not assigned"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
