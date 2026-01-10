import { useState, useEffect } from "react";
import api from "../../lib/api";

export default function SubsectionEntry() {
  const [companies, setCompanies] = useState([]);
  const [units, setUnits] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [subsections, setSubsections] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    api.get("/settings/companies/").then((res) => setCompanies(res.data));
  }, []);

  const loadUnits = (company_id) => {
    setSelectedCompany(company_id);
    api
      .get(`/settings/units/?company_id=${company_id}`)
      .then((res) => setUnits(res.data));
    setDivisions([]);
    setDepartments([]);
    setSections([]);
    setSubsections([]);
  };

  const loadDivisions = (unit_id) => {
    setSelectedUnit(unit_id);
    api
      .get(`/settings/divisions/?unit_id=${unit_id}`)
      .then((res) => setDivisions(res.data));
    setDepartments([]);
    setSections([]);
    setSubsections([]);
  };

  const loadDepartments = (division_id) => {
    setSelectedDivision(division_id);
    api
      .get(`/settings/departments/?division_id=${division_id}`)
      .then((res) => setDepartments(res.data));
    setSections([]);
    setSubsections([]);
  };

  const loadSections = (department_id) => {
    setSelectedDepartment(department_id);
    api
      .get(`/settings/sections/?department_id=${department_id}`)
      .then((res) => setSections(res.data));
    setSubsections([]);
  };

  const loadSubsections = (section_id) => {
    setSelectedSection(section_id);
    api
      .get(`/settings/subsections/?section_id=${section_id}`)
      .then((res) => setSubsections(res.data));
  };

  const saveSubsection = async () => {
    if (!selectedSection) return alert("Select section");
    if (!name.trim()) return alert("Enter subsection name");

    await api.post("/settings/subsections/", {
      name,
      section: selectedSection,
    });
    setName("");
    loadSubsections(selectedSection);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Subsection Entry</h1>

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

      <select
        disabled={!selectedDivision}
        className="border p-2 w-full"
        onChange={(e) => loadSections(e.target.value)}
      >
        <option>Select Department</option>
        {departments.map((dep) => (
          <option key={dep.id} value={dep.id}>
            {dep.name}
          </option>
        ))}
      </select>

      <select
        disabled={!selectedDepartment}
        className="border p-2 w-full"
        onChange={(e) => loadSubsections(e.target.value)}
      >
        <option>Select Section</option>
        {sections.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <input
        placeholder="Subsection Name"
        className="border p-2 w-full"
        disabled={!selectedSection}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        disabled={!selectedSection}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={saveSubsection}
      >
        Save Subsection
      </button>

      <h2 className="text-lg font-semibold mt-4">Subsection List</h2>
      <ul>
        {subsections.map((sub) => (
          <li key={sub.id} className="border p-2">
            {sub.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
