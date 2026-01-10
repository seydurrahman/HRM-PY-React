import { useState, useEffect } from "react";
import api from "../../lib/api";

export default function OrgEntryForm() {
  const [companies, setCompanies] = useState([]);
  const [units, setUnits] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [subsections, setSubsections] = useState([]);
  const [floors, setFloors] = useState([]);
  const [lines, setLines] = useState([]);
  const [tables, setTables] = useState([]);

  const [selected, setSelected] = useState({
    company: "",
    unit: "",
    division: "",
    department: "",
    section: "",
    subsection: "",
    floor: "",
  });

  const [newName, setNewName] = useState("");

  // Load Companies
  useEffect(() => {
    api.get("/settings/companies/").then((res) => setCompanies(res.data));
  }, []);

  const handleSelect = (key, value) => {
    setSelected((prev) => ({ ...prev, [key]: value }));
  };

  // Load Units
  const loadUnits = (company_id) => {
    handleSelect("company", company_id);
    api
      .get(`/settings/units/?company_id=${company_id}`)
      .then((res) => setUnits(res.data));
  };

  // Load Divisions
  const loadDivisions = (unit_id) => {
    handleSelect("unit", unit_id);
    api
      .get(`/settings/divisions/?unit_id=${unit_id}`)
      .then((res) => setDivisions(res.data));
  };

  // Load Departments
  const loadDepartments = (division_id) => {
    handleSelect("division", division_id);
    api
      .get(`/settings/departments/?division_id=${division_id}`)
      .then((res) => setDepartments(res.data));
  };

  // Load Sections
  const loadSections = (department_id) => {
    handleSelect("department", department_id);
    api
      .get(`/settings/sections/?department_id=${department_id}`)
      .then((res) => setSections(res.data));
  };

  // Load Subsections + Floors
  const loadSectionChilds = (section_id) => {
    handleSelect("section", section_id);

    api
      .get(`/settings/subsections/?section_id=${section_id}`)
      .then((res) => setSubsections(res.data));
    api
      .get(`/settings/floors/?section_id=${section_id}`)
      .then((res) => setFloors(res.data));
  };

  // Load Lines + Tables
  const loadFloorChilds = (floor_id) => {
    handleSelect("floor", floor_id);

    api
      .get(`/settings/lines/?floor_id=${floor_id}`)
      .then((res) => setLines(res.data));
    api
      .get(`/settings/tables/?floor_id=${floor_id}`)
      .then((res) => setTables(res.data));
  };

  // CREATE entry based on level
  const createItem = async (level) => {
    let payload = { name: newName };

    if (level === "unit") payload.company = selected.company;
    if (level === "division") payload.unit = selected.unit;
    if (level === "department") payload.division = selected.division;
    if (level === "section") payload.department = selected.department;
    if (level === "subsection") payload.section = selected.section;
    if (level === "floor") payload.section = selected.section;
    if (level === "line") payload.floor = selected.floor;
    if (level === "table") payload.floor = selected.floor;

    await api.post(`/settings/${level}s/`, payload);

    setNewName("");

    // reload after create
    if (level === "unit") loadUnits(selected.company);
    if (level === "division") loadDivisions(selected.unit);
    if (level === "department") loadDepartments(selected.division);
    if (level === "section") loadSections(selected.department);
    if (level === "subsection" || level === "floor")
      loadSectionChilds(selected.section);
    if (level === "line" || level === "table") loadFloorChilds(selected.floor);
  };

  return (
    <div className="p-6 space-y-6 max-w-xl">
      {/* Create Company */}
      <h2 className="text-xl font-bold">Company</h2>
      <input
        placeholder="New Company"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && createItem("company")}
        className="border p-2 w-full"
      />
      <button
        className="bg-blue-500 text-white px-4 py-2"
        onClick={() => createItem("company")}
      >
        Add Company
      </button>

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

      {/* UNIT */}
      <h2 className="text-xl font-bold">Unit</h2>
      <input
        placeholder="New Unit"
        disabled={!selected.company}
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && createItem("unit")}
        className="border p-2 w-full"
      />
      <button
        disabled={!selected.company}
        className="bg-blue-500 text-white px-4 py-2 disabled:bg-gray-400"
        onClick={() => createItem("unit")}
      >
        Add Unit
      </button>

      <select
        className="border p-2 w-full"
        disabled={!selected.company}
        onChange={(e) => loadDivisions(e.target.value)}
      >
        <option>Select Unit</option>
        {units.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>

      {/* DIVISION */}
      <h2 className="text-xl font-bold">Division</h2>
      <input
        placeholder="New Division"
        disabled={!selected.unit}
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && createItem("division")}
        className="border p-2 w-full"
      />
      <button
        disabled={!selected.unit}
        className="bg-blue-500 text-white px-4 py-2 disabled:bg-gray-400"
        onClick={() => createItem("division")}
      >
        Add Division
      </button>

      <select
        disabled={!selected.unit}
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

      {/* Continue same for Department → Section → Subsection → Floor → Line → Table */}

      {/* I will complete the remaining levels once you confirm this structure is correct. */}
    </div>
  );
}
