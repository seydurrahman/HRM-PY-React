import { useState, useEffect } from "react";
import api from "../../lib/api";

export default function UnitEntry() {
  const [companies, setCompanies] = useState([]);
  const [units, setUnits] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    api.get("/org/companies/").then(res => setCompanies(res.data));
  }, []);

  const loadUnits = (company_id) => {
    setSelectedCompany(company_id);
    api.get(`/org/units/?company_id=${company_id}`).then(res => setUnits(res.data));
  };

  const saveUnit = async () => {
    if (!selectedCompany) return alert("Select company");
    if (!name.trim()) return alert("Enter unit name");

    await api.post("/org/units/", {
      name,
      company: selectedCompany
    });

    setName("");
    loadUnits(selectedCompany);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Unit Entry</h1>

      <select
        className="border p-2 w-full"
        onChange={(e) => loadUnits(e.target.value)}
      >
        <option>Select Company</option>
        {companies.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <input
        className="border p-2 w-full"
        placeholder="Unit Name"
        disabled={!selectedCompany}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={!selectedCompany}
        onClick={saveUnit}
      >
        Save Unit
      </button>

      <h2 className="text-lg font-semibold mt-4">Unit List</h2>
      <ul>
        {units.map(u => (
          <li key={u.id} className="border p-2">{u.name}</li>
        ))}
      </ul>
    </div>
  );
}
