import { useState, useEffect } from "react";
import api from "../../lib/api";

const BulkManualAttendance = () => {
  const [units, setUnits] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    unit: "",
    department: "",
    section: "",
    selectionType: "all", // all, unit, department, section, search
  });

  const [formData, setFormData] = useState({
    date: "",
    in_time: "",
    out_time: "",
    status: "P",
  });

  const [calculatedData, setCalculatedData] = useState({});

  useEffect(() => {
    loadUnits();
    loadAllEmployees();
  }, []);

  // Load departments when unit changes
  useEffect(() => {
    if (filters.unit) {
      loadDepartments(filters.unit);
      setFilters((prev) => ({
        ...prev,
        department: "",
        section: "",
      }));
      setSections([]);
    } else {
      setDepartments([]);
      setSections([]);
    }
  }, [filters.unit]);

  // Load sections when department changes
  useEffect(() => {
    if (filters.department) {
      loadSections(filters.department);
      setFilters((prev) => ({
        ...prev,
        section: "",
      }));
    } else {
      setSections([]);
    }
  }, [filters.department]);

  // Auto-calculate work hours and OT when in_time/out_time changes
  useEffect(() => {
    if (formData.in_time && formData.out_time) {
      const inTime = new Date(`2024-01-01 ${formData.in_time}`);
      const outTime = new Date(`2024-01-01 ${formData.out_time}`);

      if (outTime < inTime) {
        outTime.setDate(outTime.getDate() + 1);
      }

      const diffMs = outTime - inTime;
      const diffHours = diffMs / (1000 * 60 * 60);
      const workHours = Math.round(diffHours * 4) / 4;
      const otHours = workHours > 8 ? Math.round((workHours - 8) * 4) / 4 : 0;
      const status = workHours >= 8 ? "P" : formData.status;

      setCalculatedData({
        work_hours: workHours.toFixed(2),
        ot_hours: otHours.toFixed(2),
        status: status,
      });
    }
  }, [formData.in_time, formData.out_time]);

  const loadUnits = async () => {
    try {
      const res = await api.get("/settings/units/");
      setUnits(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.error("Error loading units:", err);
    }
  };

  const loadDepartments = async (unitId) => {
    try {
      const res = await api.get(`/settings/departments/?unit=${unitId}`);
      setDepartments(
        Array.isArray(res.data) ? res.data : res.data.results || [],
      );
    } catch (err) {
      console.error("Error loading departments:", err);
    }
  };

  const loadSections = async (departmentId) => {
    try {
      const res = await api.get(
        `/settings/sections/?department=${departmentId}`,
      );
      setSections(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.error("Error loading sections:", err);
    }
  };

  const loadAllEmployees = async () => {
    try {
      const res = await api.get("/employees/");
      setEmployees(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.error("Error loading employees:", err);
    }
  };

  const getFilteredEmployees = () => {
    let filtered = employees;

    if (filters.selectionType === "search" && searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = employees.filter(
        (e) =>
          e.code.toLowerCase().includes(lowerSearchTerm) ||
          e.first_name.toLowerCase().includes(lowerSearchTerm) ||
          (e.last_name && e.last_name.toLowerCase().includes(lowerSearchTerm)),
      );
    } else if (filters.selectionType === "unit" && filters.unit) {
      filtered = employees.filter((e) => e.unit === parseInt(filters.unit));
    } else if (filters.selectionType === "department" && filters.department) {
      filtered = employees.filter(
        (e) => e.department === parseInt(filters.department),
      );
    } else if (filters.selectionType === "section" && filters.section) {
      filtered = employees.filter(
        (e) => e.section === parseInt(filters.section),
      );
    }

    return filtered;
  };

  const handleSelectionTypeChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      selectionType: type,
    }));
    setSelectedEmployees([]);
  };

  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId],
    );
  };

  const handleSelectAll = () => {
    const filtered = getFilteredEmployees();
    const filteredIds = filtered.map((e) => e.id);

    if (selectedEmployees.length === filteredIds.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredIds);
    }
  };

  const handleSubmit = async () => {
    if (!formData.date || selectedEmployees.length === 0) {
      alert("Please select date and at least one employee");
      return;
    }

    if (!formData.in_time || !formData.out_time) {
      alert("Please enter both In Time and Out Time");
      return;
    }

    setLoading(true);
    try {
      const attendanceRecords = selectedEmployees.map((employeeId) => ({
        employee: employeeId,
        date: formData.date,
        in_time: formData.in_time,
        out_time: formData.out_time,
        work_hours: parseFloat(calculatedData.work_hours) || 0,
        ot_hours: parseFloat(calculatedData.ot_hours) || 0,
        status: calculatedData.status || "P",
        is_manual: true,
      }));

      // Submit all records
      for (const record of attendanceRecords) {
        await api.post("/attendance/", record);
      }

      alert(
        `Attendance saved successfully for ${selectedEmployees.length} employee(s)`,
      );

      // Reset form
      setFormData({
        date: "",
        in_time: "",
        out_time: "",
        status: "P",
      });
      setSelectedEmployees([]);
      setCalculatedData({});
    } catch (err) {
      console.error("Error saving attendance:", err);
      alert("Failed to save attendance");
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = getFilteredEmployees();
  const unitName =
    units.find((u) => u.id === parseInt(filters.unit))?.name || "";
  const departmentName =
    departments.find((d) => d.id === parseInt(filters.department))?.name || "";
  const sectionName =
    sections.find((s) => s.id === parseInt(filters.section))?.name || "";

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Bulk Manual Attendance</h2>

      {/* Selection Type */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-3">
            Selection Type
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="selectionType"
                value="all"
                checked={filters.selectionType === "all"}
                onChange={(e) => handleSelectionTypeChange(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm">All Employees</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="selectionType"
                value="search"
                checked={filters.selectionType === "search"}
                onChange={(e) => handleSelectionTypeChange(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm">Single Employee</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="selectionType"
                value="unit"
                checked={filters.selectionType === "unit"}
                onChange={(e) => handleSelectionTypeChange(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm">By Unit</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="selectionType"
                value="department"
                checked={filters.selectionType === "department"}
                onChange={(e) => handleSelectionTypeChange(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm">By Department</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="selectionType"
                value="section"
                checked={filters.selectionType === "section"}
                onChange={(e) => handleSelectionTypeChange(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm">By Section</span>
            </label>
          </div>
        </div>

        {/* Search Employee */}
        {filters.selectionType === "search" && (
          <div>
            <label className="block text-sm font-semibold mb-2">
              Search by Code or Name
            </label>
            <input
              type="text"
              placeholder="Enter employee code or name..."
              className="border border-gray-300 p-2 rounded w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* Unit Selection */}
        {(filters.selectionType === "unit" ||
          filters.selectionType === "department" ||
          filters.selectionType === "section") && (
          <div>
            <label className="block text-sm font-semibold mb-2">Unit</label>
            <select
              className="border border-gray-300 p-2 rounded w-full"
              value={filters.unit}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, unit: e.target.value }))
              }
            >
              <option value="">Select Unit</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Department Selection */}
        {(filters.selectionType === "department" ||
          filters.selectionType === "section") &&
          filters.unit && (
            <div>
              <label className="block text-sm font-semibold mb-2">
                Department
              </label>
              <select
                className="border border-gray-300 p-2 rounded w-full"
                value={filters.department}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          )}

        {/* Section Selection */}
        {filters.selectionType === "section" && filters.department && (
          <div>
            <label className="block text-sm font-semibold mb-2">Section</label>
            <select
              className="border border-gray-300 p-2 rounded w-full"
              value={filters.section}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, section: e.target.value }))
              }
            >
              <option value="">Select Section</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      

      {/* Employee Selection */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">
            Select Employees
            {unitName && ` - ${unitName}`}
            {departmentName && ` / ${departmentName}`}
            {sectionName && ` / ${sectionName}`}
            {filteredEmployees.length > 0 && ` (${filteredEmployees.length})`}
          </h3>
          <button
            onClick={handleSelectAll}
            className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
          >
            {selectedEmployees.length === filteredEmployees.length
              ? "Deselect All"
              : "Select All"}
          </button>
        </div>

        {filteredEmployees.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No employees found</p>
        ) : (
          <div className="max-h-96 overflow-y-auto border border-gray-300 rounded">
            <table className="w-full">
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectEmployee(employee.id)}
                  >
                    <td className="p-3 w-8">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => handleSelectEmployee(employee.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="p-3 text-sm font-medium">{employee.code}</td>
                    <td className="p-3 text-sm">
                      {employee.first_name} {employee.last_name || ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="bg-blue-50 p-3 rounded text-sm">
          <strong>{selectedEmployees.length}</strong> employee(s) selected
        </div>
      </div>

      {/* Attendance Details */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h3 className="font-semibold">Attendance Details</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Date</label>
            <input
              type="date"
              className="border border-gray-300 p-2 rounded w-full"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Status</label>
            <select
              className="border border-gray-300 p-2 rounded w-full"
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="P">Present</option>
              <option value="A">Absent</option>
              <option value="W">Weekend</option>
              <option value="H">Holiday</option>
              <option value="L">Leave</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">In Time</label>
            <input
              type="time"
              className="border border-gray-300 p-2 rounded w-full"
              value={formData.in_time}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, in_time: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Out Time</label>
            <input
              type="time"
              className="border border-gray-300 p-2 rounded w-full"
              value={formData.out_time}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, out_time: e.target.value }))
              }
            />
          </div>
        </div>

        {calculatedData.work_hours && (
          <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Work Hours
              </label>
              <div
                className={`border p-2 rounded font-semibold ${
                  parseFloat(calculatedData.work_hours) < 8
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
              >
                {calculatedData.work_hours}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                OT Hours
              </label>
              <div className="border border-gray-300 p-2 rounded font-semibold bg-white">
                {calculatedData.ot_hours}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <button
          onClick={handleSubmit}
          disabled={loading || selectedEmployees.length === 0}
          className="w-full bg-slate-900 text-white px-4 py-3 rounded font-medium hover:bg-slate-800 disabled:bg-gray-400 text-lg"
        >
          {loading
            ? "Saving..."
            : `Save Attendance for ${selectedEmployees.length} Employee(s)`}
        </button>
      </div>
    </div>
  );
};

export default BulkManualAttendance;
