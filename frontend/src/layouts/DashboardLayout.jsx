import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import { useEffect, useState } from "react";

const DashboardLayout = () => {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token"); // ✅ Correct key
    if (!token) {
      window.location.href = "/login";   // Redirect only once
      return;
    }

    // OPTIONAL: Validate token expiry safely
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.clear();
        window.location.href = "/login";
        return;
      }
    } catch (e) {
      localStorage.clear();
      window.location.href = "/login";
      return;
    }

    setAllowed(true); // Render layout only after validation
  }, []);

  if (!allowed) return null;  // Prevent flicker

  return (
    <div className="h-screen flex bg-slate-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
