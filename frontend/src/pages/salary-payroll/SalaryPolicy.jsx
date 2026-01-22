import { useState } from "react";

function SalaryPolicy() {
  const [policy, setPolicy] = useState({
    employee_type: "",
    gross: "",
    basic: {
      type: "percent", // percent | manual | formula
      value: "",
      divided: 1.5,
    },
    house_rent: { type: "percent", base: "gross", value: "" },
    medical: { type: "percent", base: "gross", value: "" },
    food: { type: "percent", base: "gross", value: "" },
    transport: { type: "percent", base: "gross", value: "" },
  });

  const [errors, setErrors] = useState({});

  /* =========================================================
     IMPORTANT CONCEPT
     -------------------------------------
     1. Final Basic → what user sees (calculateBasic)
     2. Derived Basic → temporary basic used for allowances
        (never 0, even if Basic rule is Formula)
  ========================================================= */

  // Derived Basic for allowance base
  const calculateDerivedBasic = () => {
    const gross = Number(policy.gross || 0);

    if (policy.basic.type === "manual") {
      return Number(policy.basic.value || 0);
    }

    if (policy.basic.type === "percent") {
      return (gross * Number(policy.basic.value || 0)) / 100;
    }

    // If formula → fallback basic for allowance base (50% of gross)
    return gross * 0.5;
  };

  // Allowance calculation
  const calculateAmount = (item) => {
    const gross = Number(policy.gross || 0);
    const basic = calculateDerivedBasic();

    if (item.type === "manual") return Number(item.value || 0);

    if (item.base === "basic") {
      return (basic * Number(item.value || 0))/100;
    }

    return (gross * Number(item.value || 0)) / 100;
  };
  // Total allowances
  const getTotalAllowances = () => {
    return (
      calculateAmount(policy.medical) +
      calculateAmount(policy.food) +
      calculateAmount(policy.transport)
    );
  };

  // Final Basic shown to user
  const calculateBasic = () => {
    const gross = Number(policy.gross || 0);
    const total = getTotalAllowances();

    if (policy.basic.type === "manual") {
      return Number(policy.basic.value || 0);
    }

    if (policy.basic.type === "percent") {
      return (gross * Number(policy.basic.value || 0)) / 100;
    }

    // Formula:
    // Basic = (Gross - TotalAllowances) / Divided
    if (policy.basic.type === "formula") {
      const m = Number(policy.basic.divided || 1);
      const result = (gross - total) / m;
      return result > 0 ? result : 0;
    }
    return 0;
  };

  /* ================= VALIDATION ================= */

  const validateValue = (type, value, base = "gross") => {
    let num = Number(value || 0);
    const gross = Number(policy.gross || 0);
    const basic = calculateDerivedBasic();

    if (num < 0) num = 0;

    // Percent limit
    if (type === "percent") {
      if (num > 100) return 100;
      return num;
    }

    // Manual limit
    if (type === "manual") {
      if (base === "basic") {
        if (num > basic) return basic;
      } else {
        if (num > gross) return gross;
      }
      return num;
    }

    return num;
  };

  const handleSave = () => {
    const newErrors = {};

    if (!policy.employee_type)
      newErrors.employee_type = "Employee type required";

    if (!policy.gross || Number(policy.gross) <= 0)
      newErrors.gross = "Gross salary must be greater than 0";

    const basic = calculateBasic();
    if (basic <= 0) newErrors.basic = "Calculated basic must be greater than 0";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Final Salary Policy:", policy);
      console.log("Final Basic:", calculateBasic());
      console.log("Derived Basic (for allowances):", calculateDerivedBasic());
      console.log("Total Allowances:", getTotalAllowances());
      alert("Salary policy validated successfully!");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Salary Policy</h1>

      <div className="bg-white p-4 rounded-xl shadow-sm space-y-6">

        {/* Employee Type */}
        <div>
          <label className="text-sm font-medium">Employee Type</label>
          <select
            className="border p-2 rounded w-full"
            value={policy.employee_type}
            onChange={(e) =>
              setPolicy({ ...policy, employee_type: e.target.value })
            }
          >
            <option value="">Select</option>
            <option value="management">Management</option>
            <option value="staff">Staff</option>
            <option value="worker">Worker</option>
          </select>
          {errors.employee_type && (
            <p className="text-red-500 text-xs">{errors.employee_type}</p>
          )}
        </div>

        {/* Gross */}
        <div>
          <label className="text-sm font-medium">Gross Salary</label>
          <input
            type="number"
            className="border p-2 rounded w-full"
            value={policy.gross}
            onChange={(e) =>
              setPolicy({
                ...policy,
                gross: e.target.value < 0 ? 0 : e.target.value,
              })
            }
          />
          {errors.gross && (
            <p className="text-red-500 text-xs">{errors.gross}</p>
          )}
        </div>

        {/* ================= BASIC ================= */}
        <div className="space-y-2 border p-3 rounded">
          <label className="text-sm font-semibold">Basic Salary Rule</label>

          <select
            className="border p-2 rounded w-full"
            value={policy.basic.type}
            onChange={(e) =>
              setPolicy({
                ...policy,
                basic: {
                  ...policy.basic,
                  type: e.target.value,
                  value: "",
                },
              })
            }
          >
            <option value="percent">From Gross (%)</option>
            <option value="manual">Manual Amount</option>
            <option value="formula">
              (Gross - Total Allowances (W.O-H/R)) / (1.5)
            </option>
          </select>

          {policy.basic.type === "percent" && (
            <input
              type="number"
              className="border p-2 rounded w-full"
              placeholder="Basic %"
              value={policy.basic.value}
              onChange={(e) => {
                const val = validateValue("percent", e.target.value, "gross");
                setPolicy({
                  ...policy,
                  basic: { ...policy.basic, value: val },
                });
              }}
            />
          )}

          {policy.basic.type === "manual" && (
            <input
              type="number"
              className="border p-2 rounded w-full"
              placeholder="Basic Amount"
              value={policy.basic.value}
              onChange={(e) => {
                const val = validateValue("manual", e.target.value, "gross");
                setPolicy({
                  ...policy,
                  basic: { ...policy.basic, value: val },
                });
              }}
            />
          )}

          {policy.basic.type === "formula" && (
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                step="0.1"
                className="border p-2 rounded w-full"
                placeholder="Divided (e.g. 1.5)"
                value={policy.basic.divided}
                onChange={(e) =>
                  setPolicy({
                    ...policy,
                    basic: {
                      ...policy.basic,
                      divided: e.target.value,
                    },
                  })
                }
              />
              <div className="flex items-center font-semibold">
                Total Allowances: {getTotalAllowances().toFixed(2)}
              </div>
            </div>
          )}

          <div className="font-semibold text-green-700">
            Final Basic = {calculateBasic().toFixed(2)}
          </div>

          <div className="text-xs text-gray-600">
            Derived Basic (for allowances) = {calculateDerivedBasic().toFixed(2)}
          </div>

          {errors.basic && (
            <p className="text-red-500 text-xs">{errors.basic}</p>
          )}
        </div>

        {/* ================= ALLOWANCES ================= */}

        <AllowanceBlock
          title="House Rent"
          item={policy.house_rent}
          showBase
          setItem={(val) => setPolicy({ ...policy, house_rent: val })}
          validateValue={validateValue}
          calculateAmount={calculateAmount}
        />

        <AllowanceBlock
          title="Medical"
          item={policy.medical}
          showBase
          setItem={(val) => setPolicy({ ...policy, medical: val })}
          validateValue={validateValue}
          calculateAmount={calculateAmount}
        />

        <AllowanceBlock
          title="Food"
          item={policy.food}
          showBase
          setItem={(val) => setPolicy({ ...policy, food: val })}
          validateValue={validateValue}
          calculateAmount={calculateAmount}
        />

        <AllowanceBlock
          title="Transport"
          item={policy.transport}
          showBase
          setItem={(val) => setPolicy({ ...policy, transport: val })}
          validateValue={validateValue}
          calculateAmount={calculateAmount}
        />

        <div className="text-right font-semibold text-blue-700">
          Total Allowances = {getTotalAllowances().toFixed(2)}
        </div>

        <div className="text-right">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-slate-900 text-white rounded"
          >
            Save Policy
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= ALLOWANCE COMPONENT ================= */

function AllowanceBlock({
  title,
  item,
  setItem,
  validateValue,
  calculateAmount,
  showBase = false,
}) {
  return (
    <div className="grid grid-cols-4 gap-3">
      <div>
        <label className="text-sm font-medium">{title} Type</label>
        <select
          className="border p-2 rounded w-full"
          value={item.type}
          onChange={(e) =>
            setItem({ ...item, type: e.target.value, value: "" })
          }
        >
          <option value="percent">Percent</option>
          <option value="manual">Manual</option>
        </select>
      </div>

      {showBase && (
        <div>
          <label className="text-sm font-medium">Base</label>
          <select
            className="border p-2 rounded w-full"
            value={item.base}
            onChange={(e) =>
              setItem({ ...item, base: e.target.value, value: "" })
            }
          >
            <option value="gross">Gross</option>
            <option value="basic">Basic</option>
          </select>
        </div>
      )}

      <div>
        <label className="text-sm font-medium">
          {item.type === "percent" ? "%" : "Amount"}
        </label>
        <input
          type="number"
          className="border p-2 rounded w-full"
          value={item.value}
          onChange={(e) => {
            const val = validateValue(
              item.type,
              e.target.value,
              item.base || "gross"
            );
            setItem({ ...item, value: val });
          }}
        />
      </div>

      <div className="flex items-end font-semibold">
        = {calculateAmount(item).toFixed(2)}
      </div>
    </div>
  );
}

export default SalaryPolicy;
