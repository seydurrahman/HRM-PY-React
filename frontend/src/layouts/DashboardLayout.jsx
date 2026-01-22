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
    <div className="h-screen flex bg-slate-100 overflow-hidden">
    {/* Sidebar with its own scrollbar */}
    <aside className="w-64 min-w-[16rem] shrink-0 h-full overflow-y-auto bg-white">
      <Sidebar />
    </aside>

    {/* Main area */}
    <div className="flex flex-1 flex-col h-full overflow-hidden">
      <Navbar />

      {/* Main content without page-level scroll */}
      <main className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  </div>
  );
};

export default DashboardLayout;
