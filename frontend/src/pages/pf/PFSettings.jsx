import { useEffect, useState } from "react";
import api from "../../lib/api";

const PFSettings = () => {
  const [settings, setSettings] = useState([]);
  const [form, setForm] = useState({
    employee_percent: "",
    employer_percent: ""
  });

  const save = async () => {
    await api.post("/pf-settings/", form);
    alert("PF Settings Saved");
  };

  useEffect(() => {
    api.get("/pf-settings/").then(res => setSettings(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold">PF Settings</h1>

      <div className="mt-4 bg-white p-4 rounded-xl shadow-sm space-y-3">

        <input className="border p-2 w-full" 
          placeholder="Employee %"
          onChange={e => setForm({...form, employee_percent: e.target.value})}
        />

        <input className="border p-2 w-full"
          placeholder="Employer %"
          onChange={e => setForm({...form, employer_percent: e.target.value})}
        />

        <button className="bg-slate-900 text-white px-3 py-2 rounded" onClick={save}>
          Save Settings
        </button>
      </div>

      <div className="mt-5">
        <h2 className="font-semibold mb-2">Existing Settings</h2>
        <pre>{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </div>
  );
};

export default PFSettings;
