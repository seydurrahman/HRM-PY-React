import { useState, useEffect } from "react";
import api from "../../lib/api";

export default function CompanyEntry() {
  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState("");

  const loadCompanies = () => {
    api.get("/org/companies/").then(res => setCompanies(res.data));
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const saveCompany = async () => {
    if (!name.trim()) return alert("Enter company name");

    await api.post("/org/companies/", { name });
    setName("");
    loadCompanies();
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Company Entry</h1>

      <input
        className="border p-2 w-full"
        placeholder="Company Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={saveCompany}
      >
        Save Company
      </button>

      <h2 className="text-lg font-semibold mt-4">Company List</h2>
      <ul>
        {companies.map(c => (
          <li key={c.id} className="border p-2">{c.name}</li>
        ))}
      </ul>
    </div>
  );
}
