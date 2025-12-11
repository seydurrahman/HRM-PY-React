const Navbar = () => {
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  };
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b bg-white">
      <div className="font-semibold text-lg">Corporate HRM</div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-slate-500 hidden sm:inline">
          Welcome, HR Admin
        </span>
        <button
          onClick={logout}
          className="px-3 py-1 rounded-md text-xs border hover:bg-slate-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
