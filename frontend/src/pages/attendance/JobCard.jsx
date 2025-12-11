import { useState } from "react";
import api from "../../lib/api";

const JobCard = () => {
  const [data, setData] = useState([]);

  const searchCard = async () => {
    const res = await api.get("/jobcard/", {
      params: {
        employee: document.getElementById("emp").value,
        month: document.getElementById("month").value,
        year: document.getElementById("year").value,
      },
    });
    setData(res.data);
  };

  return (
    <div>
      <h1 className="text-xl font-semibold">Monthly Job Card</h1>

      <div className="bg-white p-4 rounded-xl shadow-sm mt-4 space-y-4 flex gap-4">
        <input id="emp" placeholder="Employee ID" className="border p-2 rounded" />
        <input id="month" type="number" placeholder="Month" className="border p-2 rounded" />
        <input id="year" type="number" placeholder="Year" className="border p-2 rounded" />

        <button onClick={searchCard} className="bg-slate-900 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>

      {/* Result */}
      <div className="mt-4 bg-white rounded-xl shadow-sm">
        <pre className="p-4">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default JobCard;
