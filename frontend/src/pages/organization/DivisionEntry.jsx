import { useState, useEffect } from "react";
import api from "../../lib/api";

export default function DivisionEntry() {
  const [companies, setCompanies] = useState([]);
  const [units, setUnits] = useState([]);
  const [divisions, setDivisions] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    api.get("/settings/companies/").then((res) => setCompanies(res.data));
  }, []);

  const loadUnits = (company_id) => {
    setSelectedCompany(company_id);
    setSelectedUnit("");

    api
      .get(`/settings/units/?company_id=${company_id}`)
      .then((res) => setUnits(res.data));
    setDivisions([]);
  };

  const loadDivisions = (unit_id) => {
    setSelectedUnit(unit_id);
    api
      .get(`/settings/divisions/?unit_id=${unit_id}`)
      .then((res) => setDivisions(res.data));
  };

  const saveDivision = async () => {
    if (!selectedUnit) return alert("Select unit");
    if (!name.trim()) return alert("Enter division name");

    // Send parent as name (backend accepts name or id)
    const unitObj = units.find((u) => String(u.id) === String(selectedUnit));
    await api.post("/settings/divisions/", {
      name,
      unit: unitObj ? unitObj.name : selectedUnit,
    });

    setName("");
    loadDivisions(selectedUnit);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Division Entry</h1>

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
        className="border p-2 w-full"
        disabled={!selectedCompany}
        onChange={(e) => loadDivisions(e.target.value)}
      >
        <option>Select Unit</option>
        {units.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>

      <input
        className="border p-2 w-full"
        placeholder="Division Name"
        disabled={!selectedUnit}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={!selectedUnit}
        onClick={saveDivision}
      >
        Save Division
      </button>

      <h2 className="text-lg font-semibold mt-4">Division List</h2>
      <ul>
        {divisions.map((d) => (
          <li key={d.id} className="border p-2">
            {d.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
