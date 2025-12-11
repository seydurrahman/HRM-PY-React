import { useState, useEffect } from "react";
import api from "../../lib/api";

export default function CompanyEntry() {
  const [grade, setGrade] = useState([]);
  const [name, setName] = useState("");

  const loadGrade = () => {
    api.get("/settings/grades/").then((res) => setGrade(res.data));
  };

  useEffect(() => {
    loadGrade();
  }, []);

  const saveGrade = async () => {
    if (!name.trim()) return alert("Enter grade name");
    await api.post("/settings/grades/", { name });
    setName("");
    loadGrade();
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Grade Entry</h1>

      <input
        className="border p-2 w-full"
        placeholder="Grade Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={saveGrade}
      >
        Save
      </button>

      <h2 className="text-lg font-semibold mt-4">Grade List</h2>
      <ul>
        {grade.map((g) => (
          <li key={g.id} className="border p-2">
            {g.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
