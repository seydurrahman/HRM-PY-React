import { useState, useEffect } from "react";
import api from "../../lib/api";

export default function CompanyEntry() {
  const [disignation, setDisignation] = useState([]);
  const [name, setName] = useState("");

  const loadDisignation = () => {
    api.get("/settings/designations/").then(res => setDisignation(res.data));
  };

  useEffect(() => {
    loadDisignation();
  }, []);

  const saveDesignation = async () => {
    if (!name.trim()) return alert("Enter designation name");

    await api.post("/settings/designations/", { name });
    setName("");
    loadDisignation();
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Designation Entry</h1>

      <input
        className="border p-2 w-full"
        placeholder="Designation Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={saveDesignation}
      >
        Save
      </button>

      <h2 className="text-lg font-semibold mt-4">Designation List</h2>
      <ul>
        {disignation.map(d => (
          <li key={d.id} className="border p-2">{d.name}</li>
        ))}
      </ul>
    </div>
  );
}
