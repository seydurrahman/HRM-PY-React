import { useState, useEffect } from "react";
import api from "../../lib/api";

export default function DepartmentEntry() {
  const [companies, setCompanies] = useState([]);
  const [units, setUnits] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    api.get("/settings/companies/").then((res) => setCompanies(res.data));
  }, []);

  const loadUnits = (company_id) => {
    setSelectedCompany(company_id);
    setSelectedUnit("");
    setSelectedDivision("");

    api
      .get(`/settings/units/?company_id=${company_id}`)
      .then((res) => setUnits(res.data));
    setDivisions([]);
    setDepartments([]);
  };

  const loadDivisions = (unit_id) => {
    setSelectedUnit(unit_id);
    api
      .get(`/settings/divisions/?unit_id=${unit_id}`)
      .then((res) => setDivisions(res.data));
    setDepartments([]);
  };

  const loadDepartments = (division_id) => {
    setSelectedDivision(division_id);
    api
      .get(`/settings/departments/?division_id=${division_id}`)
      .then((res) => setDepartments(res.data));
  };

  const saveDepartment = async () => {
    if (!selectedDivision) return alert("Select division");
    if (!name.trim()) return alert("Enter department name");

    await api.post("/settings/departments/", {
      name,
      division: selectedDivision,
    });
    setName("");
    loadDepartments(selectedDivision);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Department Entry</h1>

      <select
        className="border p-2 w-full"
        onChange={(e) => loadUnits(e.target.value)}
      >
        <option>Select Company</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        disabled={!selectedCompany}
        className="border p-2 w-full"
        onChange={(e) => loadDivisions(e.target.value)}
      >
        <option>Select Unit</option>
        {units.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>

      <select
        disabled={!selectedUnit}
        className="border p-2 w-full"
        onChange={(e) => loadDepartments(e.target.value)}
      >
        <option>Select Division</option>
        {divisions.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      <input
        className="border p-2 w-full"
        placeholder="Department Name"
        disabled={!selectedDivision}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        disabled={!selectedDivision}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={saveDepartment}
      >
        Save Department
      </button>

      <h2 className="text-lg font-semibold mt-4">Department List</h2>
      <ul>
        {departments.map((dep) => (
          <li key={dep.id} className="border p-2">
            {dep.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
