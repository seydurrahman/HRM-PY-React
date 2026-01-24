import { useState, useEffect } from "react";
import api from "../../lib/api";

function SalaryPolicy() {
  const [categories, setCategories] = useState([]);
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
    others1: { type: "percent", base: "gross", value: "" },
    others2: { type: "percent", base: "gross", value: "" },
  });

  const [errors, setErrors] = useState({});

  // Fetch employee categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Real-time validation whenever policy changes
  useEffect(() => {
    const newErrors = validateFieldsRealTime();
    setErrors(newErrors);
  }, [policy]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/settings/employee-categories/");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

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

    // If formula → calculate iteratively to converge with final basic
    if (policy.basic.type === "formula") {
      let derived = gross * 0.5; // Initial guess
      const maxIterations = 20;
      const tolerance = 0.01;

      for (let i = 0; i < maxIterations; i++) {
        // Calculate allowances with current derived basic
        const medical =
          policy.medical.type === "manual"
            ? Number(policy.medical.value || 0)
            : policy.medical.base === "basic"
              ? (derived * Number(policy.medical.value || 0)) / 100
              : (gross * Number(policy.medical.value || 0)) / 100;

        const food =
          policy.food.type === "manual"
            ? Number(policy.food.value || 0)
            : policy.food.base === "basic"
              ? (derived * Number(policy.food.value || 0)) / 100
              : (gross * Number(policy.food.value || 0)) / 100;

        const transport =
          policy.transport.type === "manual"
            ? Number(policy.transport.value || 0)
            : policy.transport.base === "basic"
              ? (derived * Number(policy.transport.value || 0)) / 100
              : (gross * Number(policy.transport.value || 0)) / 100;

        const totalAllowances = medical + food + transport;

        // Calculate new derived basic using formula
        const m = Number(policy.basic.divided || 1);
        const newDerived = (gross - totalAllowances) / m;

        // Check convergence
        if (Math.abs(newDerived - derived) < tolerance) {
          return newDerived > 0 ? newDerived : gross * 0.5;
        }

        derived = newDerived;
      }

      return derived > 0 ? derived : gross * 0.5;
    }

    return gross * 0.5;
  };

  // Allowance calculation
  const calculateAmount = (item) => {
    const gross = Number(policy.gross || 0);
    const basic = calculateDerivedBasic();

    if (item.type === "manual") return Number(item.value || 0);

    if (item.base === "basic") {
      return (basic * Number(item.value || 0)) / 100;
    }

    return (gross * Number(item.value || 0)) / 100;
  };
  // Total allowances (used in formula calculations)
  const getTotalAllowances = () => {
    return (
      calculateAmount(policy.medical) +
      calculateAmount(policy.food) +
      calculateAmount(policy.transport)
    );
  };

  // Total of Basic + all components (excluding Others1)
  const getTotalWithoutOthers1 = () => {
    return (
      calculateBasic() +
      calculateAmount(policy.house_rent) +
      calculateAmount(policy.medical) +
      calculateAmount(policy.food) +
      calculateAmount(policy.transport)
    );
  };

  // Total of Basic + all components INCLUDING Others1
  const getGrandTotal = () => {
    return getTotalWithoutOthers1() + calculateAmount(policy.others1);
  };

  // Others1 Remainder = Gross - Grand Total (recalculated after Others1 is included)
  const calculateOthers1Remainder = () => {
    const gross = Number(policy.gross || 0);
    const total = getGrandTotal();
    return gross - total;
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

  const validateTotalNotExceedGross = () => {
    const gross = Number(policy.gross || 0);
    const grandTotal = getGrandTotal();

    if (grandTotal > gross) {
      return `Total components (${grandTotal.toFixed(2)}) cannot exceed Gross salary (${gross.toFixed(2)})`;
    }
    return null;
  };

  const validateOthers1 = () => {
    const gross = Number(policy.gross || 0);
    const totalWithoutOthers1 = getTotalWithoutOthers1();
    const others1Amount = calculateAmount(policy.others1);

    // Others1 should not make the total exceed gross
    if (totalWithoutOthers1 + others1Amount > gross) {
      return `Others1 value (${others1Amount.toFixed(2)}) causes total to exceed Gross salary`;
    }

    // Others1 remainder should not be negative
    const remainder = calculateOthers1Remainder();
    if (remainder < 0) {
      return `Others1 value cannot be more than Gross minus other components`;
    }

    return null;
  };

  // Real-time validation for all fields
  const validateFieldsRealTime = () => {
    const newErrors = {};

    if (policy.employee_type === "")
      newErrors.employee_type = "Employee type required";

    if (!policy.gross || Number(policy.gross) <= 0)
      newErrors.gross = "Gross salary must be greater than 0";

    const basic = calculateBasic();
    if (policy.basic.value && basic <= 0)
      newErrors.basic = "Calculated basic must be greater than 0";

    // Validate total doesn't exceed gross
    const totalValidationError = validateTotalNotExceedGross();
    if (totalValidationError) {
      newErrors.total = totalValidationError;
    }

    // Validate Others1 specifically for all basic types
    if (policy.others1.value) {
      const others1ValidationError = validateOthers1();
      if (others1ValidationError) {
        newErrors.others1 = others1ValidationError;
      }
    }

    return newErrors;
  };

  const handleSave = () => {
    const newErrors = validateFieldsRealTime();
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
          <label className="text-sm font-medium">
            Employee Type <span className="text-red-500">*</span>
          </label>
          <select
            className="border p-2 rounded w-full"
            value={policy.employee_type}
            onChange={(e) =>
              setPolicy({ ...policy, employee_type: e.target.value })
            }
          >
            <option value="">Select Employee Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Gross */}
        <div>
          <label className="text-sm font-medium">
            Gross Salary <span className="text-red-500">*</span>
          </label>
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
        </div>

        {/* ================= BASIC ================= */}
        <div
          className={`space-y-2 border p-3 rounded ${errors.basic ? "border-red-500 bg-red-50" : ""}`}
        >
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
            <option value="formula">Formula(G.S-T.All(ex-H/R))/1.5</option>
          </select>

          {policy.basic.type === "percent" && (
            <input
              type="number"
              className={`border p-2 rounded w-full ${errors.basic ? "border-red-500 bg-red-50" : ""}`}
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
              className={`border p-2 rounded w-full ${errors.basic ? "border-red-500 bg-red-50" : ""}`}
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
            Derived Basic (for allowances) ={" "}
            {calculateDerivedBasic().toFixed(2)}
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
          fieldError={null}
        />

        <AllowanceBlock
          title="Medical"
          item={policy.medical}
          showBase
          setItem={(val) => setPolicy({ ...policy, medical: val })}
          validateValue={validateValue}
          calculateAmount={calculateAmount}
          fieldError={null}
        />

        <AllowanceBlock
          title="Transport"
          item={policy.transport}
          showBase
          setItem={(val) => setPolicy({ ...policy, transport: val })}
          validateValue={validateValue}
          calculateAmount={calculateAmount}
          fieldError={null}
        />

        <AllowanceBlock
          title="Food"
          item={policy.food}
          showBase
          setItem={(val) => setPolicy({ ...policy, food: val })}
          validateValue={validateValue}
          calculateAmount={calculateAmount}
          fieldError={null}
        />

        <AllowanceBlock
          title="Others1"
          item={policy.others1}
          showBase={false}
          setItem={(val) => setPolicy({ ...policy, others1: val })}
          validateValue={validateValue}
          calculateAmount={calculateAmount}
          disabled={getTotalWithoutOthers1() >= Number(policy.gross || 0)}
          disabledMessage={
            getTotalWithoutOthers1() >= Number(policy.gross || 0)
              ? "Total already equals gross salary"
              : ""
          }
          fieldError={errors.others1 || null}
        />

        <div className="text-right font-semibold text-blue-700">
          Total (Basic + HR + Medical + Food + Transport) ={" "}
          {getGrandTotal().toFixed(2)}
        </div>

        <div className="text-right font-semibold text-purple-700">
          Others1 (Gross - Total) = {calculateOthers1Remainder().toFixed(2)}
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
  disabled = false,
  disabledMessage = "",
  fieldError = null,
}) {
  return (
    <div>
      <div className="grid grid-cols-4 gap-3">
        <div>
          <label className="text-sm font-medium">{title} Type</label>
          <select
            className={`border p-2 rounded w-full disabled:bg-gray-100 disabled:cursor-not-allowed ${fieldError ? "border-red-500 bg-red-50" : ""}`}
            value={item.type}
            onChange={(e) =>
              setItem({ ...item, type: e.target.value, value: "" })
            }
            disabled={disabled}
          >
            <option value="percent">Percent</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        {showBase && (
          <div>
            <label className="text-sm font-medium">Base</label>
            <select
              className={`border p-2 rounded w-full disabled:bg-gray-100 disabled:cursor-not-allowed ${fieldError ? "border-red-500 bg-red-50" : ""}`}
              value={item.base}
              onChange={(e) =>
                setItem({ ...item, base: e.target.value, value: "" })
              }
              disabled={disabled}
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
            className={`border p-2 rounded w-full disabled:bg-gray-100 disabled:cursor-not-allowed ${fieldError ? "border-red-500 bg-red-50" : ""}`}
            value={item.value}
            onChange={(e) => {
              const val = validateValue(
                item.type,
                e.target.value,
                item.base || "gross",
              );
              setItem({ ...item, value: val });
            }}
            disabled={disabled}
          />
        </div>

        <div className="flex items-end font-semibold">
          = {calculateAmount(item).toFixed(2)}
        </div>
      </div>
      {fieldError && (
        <p className="text-red-500 text-xs mt-2 font-semibold">
          ❌ {fieldError}
        </p>
      )}
      {disabled && disabledMessage && (
        <p className="text-orange-600 text-xs mt-2 font-medium">
          ⚠️ {disabledMessage}
        </p>
      )}
    </div>
  );
}

export default SalaryPolicy;
