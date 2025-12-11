import { useState } from "react";
import api from "../../lib/api";

const GenerateSalary = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const generate = async () => {
    await api.post("/salary/generate/", { month, year });
    alert("Salary Generated Successfully");
  };

  return (
    <div>
      <h1 className="text-xl font-semibold">Salary Generation</h1>

      <div className="bg-white p-4 mt-4 rounded-xl shadow-sm space-y-4">

        <input
          type="number"
          placeholder="Month"
          className="border p-2 w-full"
          onChange={(e) => setMonth(e.target.value)}
        />

        <input
          type="number"
          placeholder="Year"
          className="border p-2 w-full"
          onChange={(e) => setYear(e.target.value)}
        />

        <button onClick={generate} className="bg-slate-900 text-white px-4 py-2 rounded">
          Generate Salary
        </button>

      </div>
    </div>
  );
};

export default GenerateSalary;
