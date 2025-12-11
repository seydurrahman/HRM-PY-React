import { useState, useEffect } from "react";
import api from "../../lib/api";

export default function SectionEntry() {
  const [companies, setCompanies] = useState([]);
  const [units, setUnits] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    api.get("/org/companies/").then(res => setCompanies(res.data));
  }, []);

  const loadUnits = (company_id) => {
    setSelectedCompany(company_id);
    api.get(`/org/units/?company_id=${company_id}`).then(res => setUnits(res.data));
    setDivisions([]); setDepartments([]); setSections([]);
  };

  const loadDivisions = (unit_id) => {
    setSelectedUnit(unit_id);
    api.get(`/org/divisions/?unit_id=${unit_id}`).then(res => setDivisions(res.data));
    setDepartments([]); setSections([]);
  };

  const loadDepartments = (division_id) => {
    setSelectedDivision(division_id);
    api.get(`/org/departments/?division_id=${division_id}`).then(res => setDepartments(res.data));
    setSections([]);
  };

  const loadSections = (department_id) => {
    setSelectedDepartment(department_id);
    api.get(`/org/sections/?department_id=${department_id}`).then(res => setSections(res.data));
  };

  const saveSection = async () => {
    if (!selectedDepartment) return alert("Select department");
    if (!name.trim()) return alert("Enter section name");

    await api.post("/org/sections/", { name, department: selectedDepartment });
    setName("");
    loadSections(selectedDepartment);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Section Entry</h1>

      <select className="border p-2 w-full" onChange={(e) => loadUnits(e.target.value)}>
        <option>Select Company</option>
        {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <select disabled={!selectedCompany} className="border p-2 w-full"
        onChange={(e) => loadDivisions(e.target.value)}
      >
        <option>Select Unit</option>
        {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
      </select>

      <select disabled={!selectedUnit} className="border p-2 w-full"
        onChange={(e) => loadDepartments(e.target.value)}
      >
        <option>Select Division</option>
        {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>

      <select disabled={!selectedDivision} className="border p-2 w-full"
        onChange={(e) => loadSections(e.target.value)}
      >
        <option>Select Department</option>
        {departments.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
      </select>

      <input placeholder="Section Name" className="border p-2 w-full"
        disabled={!selectedDepartment} value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button disabled={!selectedDepartment}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={saveSection}
      >
        Save Section
      </button>

      <h2 className="text-lg font-semibold mt-4">Section List</h2>
      <ul>
        {sections.map(s => (
          <li key={s.id} className="border p-2">{s.name}</li>
        ))}
      </ul>
    </div>
  );
}
