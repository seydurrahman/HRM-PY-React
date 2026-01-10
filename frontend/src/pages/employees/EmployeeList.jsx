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
              <th className="px-3 py-2">Employee ID</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Unit</th>
              <th className="px-3 py-2">Division</th>
              <th className="px-3 py-2">Department</th>
              <th className="px-3 py-2">Section</th>
              <th className="px-3 py-2">Subsection</th>
              <th className="px-3 py-2">Floor</th>
              <th className="px-3 py-2">Line</th>
              <th className="px-3 py-2">Designation</th>
              <th className="px-3 py-2">Grade</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="8" className="px-3 py-4">
                  Loading...
                </td>
              </tr>
            )}

            {!loading &&
              employees.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="px-3 py-2">{e.code}</td>
                  <td className="px-3 py-2">{e.employee_id}</td>
                  <td className="px-3 py-2">
                    {e.first_name} {e.last_name}
                  </td>
                  <td className="px-3 py-2">
                    {e.unit_name || e.unit || "-"}
                  </td>
                  <td className="px-3 py-2">
                    {e.division_name || e.division || "-"}
                  </td>
                  <td className="px-3 py-2">
                    {e.department_name || e.department || "-"}
                  </td>
                  <td className="px-3 py-2">
                    {e.section_name || e.section || "-"}
                  </td>
                  <td className="px-3 py-2">
                    {e.subsection_name || e.subsection || "-"}
                  </td>
                  <td className="px-3 py-2">
                    {e.floor_name || e.floor || "-"}
                  </td>
                  <td className="px-3 py-2">
                    {e.line_name || e.line || "-"}
                  </td>
                  <td className="px-3 py-2">
                    {e.designation_name ||
                      e.designation?.name ||
                      "Not assigned"}
                  </td>
                  <td className="px-3 py-2">
                    {e.grade_name || e.grade?.name || "Not assigned"}
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      to={`/employees/${e.id}/edit`}
                      className="px-2 py-1 bg-slate-200 rounded text-sm"
                    >
                      Edit
                    </Link>
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
