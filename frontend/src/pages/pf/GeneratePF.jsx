import { useState } from "react";
import api from "../../lib/api";

const GeneratePF = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const generate = async () => {
    await api.post("/pf-contribution/generate/", { month, year });
    alert("PF Contribution generated!");
  };

  return (
    <div>
      <h1 className="text-xl font-semibold">Generate PF Contribution</h1>

      <div className="mt-4 bg-white p-4 rounded-xl shadow-sm space-y-4">

        <input className="border p-2 w-full" placeholder="Month"
          onChange={e => setMonth(e.target.value)}
        />

        <input className="border p-2 w-full" placeholder="Year"
          onChange={e => setYear(e.target.value)}
        />

        <button onClick={generate} className="bg-slate-900 text-white px-4 py-2 rounded">
          Generate
        </button>

      </div>
    </div>
  );
};

export default GeneratePF;
