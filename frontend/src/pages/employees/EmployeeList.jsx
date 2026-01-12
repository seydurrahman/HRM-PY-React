import { useEffect, useState, useMemo } from "react";
import api from "../../lib/api.js";
import { Link } from "react-router-dom";

// Small reusable hook to debounce rapidly-typed values
function useDebouncedValue(value, delay = 200) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter UI state: single typed search with qualifiers (e.g. "unit:Sales division:North")
  const [searchQuery, setSearchQuery] = useState("");

  // Debounced query to avoid excessive recomputations while typing
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 180);

  // Compute filtered employees using typed qualifiers in the single search field.
  // Query syntax:
  // - field:value (e.g. unit:Sales, division:North)
  // - multiple qualifiers are ANDed, e.g. "unit:Sales division:North"
  // - free text tokens without a qualifier search across all supported fields
  const filteredEmployees = useMemo(() => {
    if (!employees || employees.length === 0) return [];

    const raw = (debouncedSearchQuery || "").trim();
    if (raw === "") return employees;

    // parse tokens
    const parts = raw.split(/\s+/).filter(Boolean);
    const fieldFilters = {}; // field -> combined string
    const globalTokens = [];

    parts.forEach((p) => {
      const m = p.match(/^([a-zA-Z_]+):(.*)$/);
      if (m) {
        const field = m[1].toLowerCase();
        let val = m[2];
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        fieldFilters[field] = (
          fieldFilters[field] ? fieldFilters[field] + " " + val : val
        ).toLowerCase();
      } else {
        globalTokens.push(p.toLowerCase());
      }
    });

    const getFieldValue = (emp, field) => {
      switch (field) {
        case "unit":
          return (emp.unit_name || String(emp.unit || "") || "").toLowerCase();
        case "division":
          return (
            emp.division_name ||
            String(emp.division || "") ||
            ""
          ).toLowerCase();
        case "department":
          return (
            emp.department_name ||
            String(emp.department || "") ||
            ""
          ).toLowerCase();
        case "section":
          return (
            emp.section_name ||
            String(emp.section || "") ||
            ""
          ).toLowerCase();
        case "subsection":
          return (
            emp.subsection_name ||
            String(emp.subsection || "") ||
            ""
          ).toLowerCase();
        case "floor":
          return (
            emp.floor_name ||
            String(emp.floor || "") ||
            ""
          ).toLowerCase();
        case "line":
          return (emp.line_name || String(emp.line || "") || "").toLowerCase();
        case "designation":
          return (
            emp.designation_name ||
            emp.designation?.name ||
            String(emp.designation || "")
          ).toLowerCase();
        case "grade":
          return (
            emp.grade_name ||
            emp.grade?.name ||
            String(emp.grade || "")
          ).toLowerCase();
        default:
          // 'all' case: concat several fields
          return (
            (emp.code || "") +
            " " +
            (emp.employee_id || "") +
            " " +
            (emp.first_name || "") +
            " " +
            (emp.last_name || "") +
            " " +
            (emp.unit_name || emp.unit || "") +
            " " +
            (emp.division_name || emp.division || "") +
            " " +
            (emp.department_name || emp.department || "") +
            " " +
            (emp.section_name || emp.section || "") +
            " " +
            (emp.subsection_name || emp.subsection || "") +
            " " +
            (emp.floor_name || emp.floor || "") +
            " " +
            (emp.line_name || emp.line || "") +
            " " +
            (emp.designation_name || emp.designation?.name || "") +
            " " +
            (emp.grade_name || emp.grade?.name || "")
          ).toLowerCase();
      }
    };

    return employees.filter((e) => {
      // field qualifiers must all match
      for (const [field, qVal] of Object.entries(fieldFilters)) {
        const v = getFieldValue(e, field);
        if (!v || !v.includes(qVal)) return false;
      }

      // global tokens: every token must appear somewhere in the 'all' string
      if (globalTokens.length) {
        const all = getFieldValue(e, "all");
        for (const t of globalTokens) {
          if (!all.includes(t)) return false;
        }
      }

      return true;
    });
  }, [employees, debouncedSearchQuery]);

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

      {/* Search */}
      <div className="flex gap-4 items-end mt-4 mb-2 flex-col">
        <div className="w-2/4 block mx-auto">
          <input
            className="border border-purple-600 p-2 w-full rounded cursor-pointer"
            placeholder={`Search.....`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={employees.length === 0}
          />
          <div className="flex justify-between mt-1">
            <div className=" text-sm text-gray-600">
              Showing {filteredEmployees.length} / {employees.length}
            </div>
            <div>
              <button
                className="ml-2 px-2 py-1 bg-gray-100 rounded text-sm cursor-pointer"
                onClick={() => {
                  setSearchQuery("");
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
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
              filteredEmployees.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="px-3 py-2">{e.code}</td>
                  <td className="px-3 py-2">{e.employee_id}</td>
                  <td className="px-3 py-2">
                    {e.first_name} {e.last_name}
                  </td>
                  <td className="px-3 py-2">{e.unit_name || e.unit || "-"}</td>
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
                  <td className="px-3 py-2">{e.line_name || e.line || "-"}</td>
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
