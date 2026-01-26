import { NavLink } from "react-router-dom";
import { getUserRole } from "../lib/auth";
import { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

const Sidebar = () => {
  const [role, setRole] = useState(null);
  const [openMenus, setOpenMenus] = useState({});

  useEffect(() => {
    const r = getUserRole();
    console.log("User Role from getUserRole():", r); // Add this
    console.log("Type of role:", typeof r); // And this
    setRole(r);
  }, []);

  if (role === null) return null;

  const menu = [
    {
      label: "Dashboard",
      roles: ["Admin", "HR", "Employee","admin","hr","employee"],
      children: [
        { label: "Main Dashboard", path: "/dashboard" },
        {
          label: "HR Analytics",
          path: "/dashboard/hr",
          roles: ["Admin", "HR","admin","hr"],
        },
      ],
    },

    {
      label: "Employee Management",
      roles: ["Admin", "HR","admin","hr"],
      children: [
        { label: "Add Employee", path: "/employees" },
        { label: "Attendance", path: "/attendance" },
        { label: "Manual Attendance", path: "/attendance/manual" },
        { label: "Bulk Upload", path: "/attendance/bulk" },
        { label: "Job Card", path: "/attendance/jobcard" },
        { label: "OT History", path: "/attendance/ot" },
      ],
    },
    {
      label: "Leave Management",
      roles: ["Admin", "HR", "Employee","admin","hr","employee"],
      children: [
        { label: "Apply Leave", path: "/leave/apply" },
        { label: "Leave Balances", path: "/leave/balance" },
        { label: "Leave History", path: "/leave/history" },
        {
          label: "Leave Approval",
          path: "/leave/approval",
          roles: ["Admin", "HR","admin","hr"],
        },
        {
          label: "Leave Encashment",
          path: "/leave/encash",
          roles: ["Admin", "HR","admin","hr"],
        },
      ],
    },
    {
      label: "Salary & Payroll",
      roles: ["Admin", "HR","admin","hr"],
      children: [
        {
          label: "Salary Policy",
          path: "/payroll/salary-policy",
        },
        { label: "Salary Generate", path: "/payroll/generate" },
        { label: "Salary Sheet", path: "/payroll/salary-sheet" },
        {
          label: "Payslip",
          path: "/payroll/payslip",
          roles: ["Admin", "HR", "Employee","admin","hr","employee"],
        },
      ],
    },
    {
      label: "PF Management",
      roles: ["Admin", "HR","admin","hr"],
      children: [
        { label: "PF Dashboard", path: "/pf/dashboard" },
        { label: "PF Settings", path: "/pf/settings" },
        { label: "Generate PF", path: "/pf/generate" },
        { label: "PF Contribution List", path: "/pf/contributions" },
        { label: "PF Withdrawal", path: "/pf/withdrawal" },
      ],
    },
    {
      label: "Admin",
      roles: ["Admin", "HR","admin","hr"],
      children: [
        { label: "Loan Dashboard", path: "/loan/dashboard" },
        { label: "Loan Types", path: "/loan/types" },
        {
          label: "Loan Request",
          path: "/loan/request",
          roles: ["Admin", "HR", "Employee","admin","hr","employee"],
        },
        { label: "Loan Approval", path: "/loan/approval" },
        { label: "Loan Disbursement", path: "/loan/disbursement" },
        { label: "Requisitions", path: "/loan/requisitions" },
        { label: "New Requisition", path: "/loan/requisitions/new" },
      ],
    },

    {
      label: "Recruitment",
      roles: ["Admin", "HR", "Employee","admin","hr","employee"],
      children: [
        { label: "Aplly (Public)", path: "/recruit/apply" },
        {
          label: "Candidates",
          path: "/recruit/candidates",
          roles: ["Admin", "HR","admin","hr"],
        },
        {
          label: "Interviews",
          path: "/recruit/interviews",
          roles: ["Admin", "HR","employee"],
        },
        { label: "Offers", path: "/recruit/offers", roles: ["Admin", "HR","admin","hr"] },
      ],
    },

    {
      label: "Organization Settings",
      roles: ["Admin", "HR","admin","hr"],
      children: [
        { label: "Company", path: "/settings/company" },
        { label: "Unit", path: "/settings/unit" },
        { label: "Division", path: "/settings/division" },
        { label: "Department", path: "/settings/department" },
        { label: "Section", path: "/settings/section" },
        { label: "Subsection", path: "/settings/subsection" },
        { label: "Floor", path: "/settings/floor" },
        { label: "Line", path: "/settings/line" },
        { label: "Table", path: "/settings/table" },
        { label: "Designation", path: "/settings/designations" },
        { label: "Grade", path: "/settings/grades" },
      ],
    },

    {
      label: "Other Settings",
      roles: ["Admin", "HR","admin","hr"],
      children: [
        { label: "Employee Category", path: "/settings/employee-categories" },
        { label: "OT Eligibility", path: "/settings/ot-eligibility" },
      ],
    },

  ];

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside className="w-64 hidden md:flex flex-col bg-white h-full border-r">
      <div className="h-14 flex items-center px-4 border-b font-bold">
        HRM Management
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {menu
          .filter((item) => item.roles.includes(role))
          .map((item, idx) => (
            <div key={idx}>
              {/* 🔹 If item has children (submenu) */}
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <span>{item.label}</span>

                    {openMenus[item.label] ? (
                      <ChevronUpIcon className="w-4 h-4" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4" />
                    )}
                  </button>

                  {openMenus[item.label] && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child, cidx) => (
                        <NavLink
                          key={cidx}
                          to={child.path}
                          className={({ isActive }) =>
                            [
                              "block px-3 py-1 rounded-md text-sm",
                              isActive
                                ? "bg-slate-900 text-white"
                                : "text-slate-700 hover:bg-slate-100",
                            ].join(" ")
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Regular item
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    [
                      "block px-3 py-2 rounded-md text-sm",
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-100",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              )}
            </div>
          ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
