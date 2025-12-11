import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });

  const login = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", form);
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      window.location.href = "/dashboard";
    } catch (err) {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80 space-y-4">

        <h1 className="text-xl font-semibold text-center">HRM Login</h1>

        <input
          className="border p-2 w-full rounded"
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          className="border p-2 w-full rounded"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          className="w-full bg-slate-900 text-white p-2 rounded"
          onClick={login}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
