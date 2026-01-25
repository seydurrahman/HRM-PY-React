import { useState, useEffect } from "react";
import api from "../../lib/api";

function SalaryPolicy() {
  const [categories, setCategories] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
    mobile_allowance: { type: "percent", base: "gross", value: "" },
    food: { type: "percent", base: "gross", value: "" },
    transport: { type: "percent", base: "gross", value: "" },
    conveyance: { type: "percent", base: "gross", value: "" },
    others1: { type: "percent", base: "gross", value: "" },
  });

  const [errors, setErrors] = useState({});

  // Fetch employee categories and salary policies on component mount
  useEffect(() => {
    fetchCategories();
    fetchPolicies();
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

  const fetchPolicies = async () => {
    try {
      const res = await api.get("/salary-policies/");
      setPolicies(res.data);
    } catch (error) {
      console.error("Error fetching policies:", error);
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

        const mobile_allowance =
          policy.mobile_allowance.type === "manual"
            ? Number(policy.mobile_allowance.value || 0)
            : policy.mobile_allowance.base === "basic"
              ? (derived * Number(policy.mobile_allowance.value || 0)) / 100
              : (gross * Number(policy.mobile_allowance.value || 0)) / 100;

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

        const conveyance =
          policy.conveyance.type === "manual"
            ? Number(policy.conveyance.value || 0)
            : policy.conveyance.base === "basic"
              ? (derived * Number(policy.conveyance.value || 0)) / 100
              : (gross * Number(policy.conveyance.value || 0)) / 100;

        const totalAllowances = medical + mobile_allowance + food + transport + conveyance;

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
      calculateAmount(policy.mobile_allowance) +
      calculateAmount(policy.food) +
      calculateAmount(policy.transport) +
      calculateAmount(policy.conveyance)
    );
  };

  // Total of Basic + all components (excluding Others1)
  const getTotalWithoutOthers1 = () => {
    return (
      calculateBasic() +
      calculateAmount(policy.house_rent) +
      calculateAmount(policy.medical) +
      calculateAmount(policy.mobile_allowance) +
      calculateAmount(policy.food) +
      calculateAmount(policy.transport) +
      calculateAmount(policy.conveyance)
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
      const saveData = {
        employee_type: policy.employee_type,
        gross: Number(policy.gross),
        basic: policy.basic,
        house_rent: policy.house_rent,
        medical: policy.medical,
        mobile_allowance: policy.mobile_allowance,
        food: policy.food,
        transport: policy.transport,
        conveyance: policy.conveyance,
        others1: policy.others1,
      };

      if (editingId) {
        // Update existing policy
        api
          .put(`/salary-policies/${editingId}/`, saveData)
          .then(() => {
            alert("Salary policy updated successfully!");
            setIsCreating(false);
            setEditingId(null);
            resetForm();
            fetchPolicies();
          })
          .catch((error) => {
            console.error("Error updating policy:", error);
            alert("Failed to update salary policy");
          });
      } else {
        // Create new policy
        api
          .post("/salary-policies/", saveData)
          .then(() => {
            alert("Salary policy created successfully!");
            setIsCreating(false);
            resetForm();
            fetchPolicies();
          })
          .catch((error) => {
            console.error("Error creating policy:", error);
            alert("Failed to create salary policy");
          });
      }
    }
  };

  const resetForm = () => {
    setPolicy({
      employee_type: "",
      gross: "",
      basic: {
        type: "percent",
        value: "",
        divided: 1.5,
      },
      house_rent: { type: "percent", base: "gross", value: "" },
      medical: { type: "percent", base: "gross", value: "" },
      mobile_allowance: { type: "percent", base: "gross", value: "" },
      food: { type: "percent", base: "gross", value: "" },
      transport: { type: "percent", base: "gross", value: "" },
      conveyance: { type: "percent", base: "gross", value: "" },
      others1: { type: "percent", base: "gross", value: "" },
    });
    setErrors({});
  };

  const handleCreate = () => {
    resetForm();
    setEditingId(null);
    setIsCreating(true);
  };

  const handleEdit = (policyData) => {
    setPolicy(policyData);
    setEditingId(policyData.id);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      api
        .delete(`/salary-policies/${id}/`)
        .then(() => {
          alert("Salary policy deleted successfully!");
          fetchPolicies();
        })
        .catch((error) => {
          console.error("Error deleting policy:", error);
          alert("Failed to delete salary policy");
        });
    }
  };

  // Helper to calculate derived basic from stored policy data (using iterative convergence for formula type)
  const calculateDerivedBasicFromPolicy = (policyData) => {
    const gross = Number(policyData.gross || 0);
    const basicConfig =
      typeof policyData.basic === "object"
        ? policyData.basic
        : { type: "percent", value: 0 };

    if (basicConfig.type === "manual") {
      return Number(basicConfig.value || 0);
    }

    if (basicConfig.type === "percent") {
      return (gross * Number(basicConfig.value || 0)) / 100;
    }

    // Formula type: use iterative convergence
    if (basicConfig.type === "formula") {
      let derived = gross * 0.5; // Initial guess
      const maxIterations = 20;
      const tolerance = 0.01;

      for (let i = 0; i < maxIterations; i++) {
        // Calculate allowances (medical, food, transport) with current derived basic
        let medical = 0;
        if (policyData.medical) {
          if (policyData.medical.type === "manual") {
            medical = Number(policyData.medical.value || 0);
          } else if (policyData.medical.type === "percent") {
            const base = policyData.medical.base === "basic" ? derived : gross;
            medical = (base * Number(policyData.medical.value || 0)) / 100;
          }
        }

        let mobile_allowance = 0;
        if (policyData.mobile_allowance) {
          if (policyData.mobile_allowance.type === "manual") {
            mobile_allowance = Number(policyData.mobile_allowance.value || 0);
          } else if (policyData.mobile_allowance.type === "percent") {
            const base =
              policyData.mobile_allowance.base === "basic" ? derived : gross;
            mobile_allowance =
              (base * Number(policyData.mobile_allowance.value || 0)) / 100;
          }
        }
        let food = 0;
        if (policyData.food) {
          if (policyData.food.type === "manual") {
            food = Number(policyData.food.value || 0);
          } else if (policyData.food.type === "percent") {
            const base = policyData.food.base === "basic" ? derived : gross;
            food = (base * Number(policyData.food.value || 0)) / 100;
          }
        }

        let transport = 0;
        if (policyData.transport) {
          if (policyData.transport.type === "manual") {
            transport = Number(policyData.transport.value || 0);
          } else if (policyData.transport.type === "percent") {
            const base =
              policyData.transport.base === "basic" ? derived : gross;
            transport = (base * Number(policyData.transport.value || 0)) / 100;
          }
        }

        let conveyance = 0;
        if (policyData.conveyance) {
          if (policyData.conveyance.type === "manual") {
            conveyance = Number(policyData.conveyance.value || 0);
          } else if (policyData.conveyance.type === "percent") {
            const base =
              policyData.conveyance.base === "basic" ? derived : gross;
            conveyance =
              (base * Number(policyData.conveyance.value || 0)) / 100;
          }
        }

        const totalAllowances =
          medical + mobile_allowance + transport + food + conveyance;

        // Calculate new derived basic using formula
        const m = Number(basicConfig.divided || 1);
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

  // Helper to calculate basic from stored policy data
  const calculateBasicFromPolicy = (policyData) => {
    const gross = Number(policyData.gross || 0);
    const basicConfig =
      typeof policyData.basic === "object"
        ? policyData.basic
        : { type: "percent", value: 0 };

    if (basicConfig.type === "manual") {
      return Number(basicConfig.value || 0).toFixed(2);
    }

    if (basicConfig.type === "percent") {
      return ((gross * Number(basicConfig.value || 0)) / 100).toFixed(2);
    }

    if (basicConfig.type === "formula") {
      // Calculate total allowances
      let medical = 0;
      if (policyData.medical) {
        if (policyData.medical.type === "manual") {
          medical = Number(policyData.medical.value || 0);
        } else if (policyData.medical.type === "percent") {
          const derivedBasic = calculateDerivedBasicFromPolicy(policyData);
          const base =
            policyData.medical.base === "basic" ? derivedBasic : gross;
          medical = (base * Number(policyData.medical.value || 0)) / 100;
        }
      }

      let food = 0;
      if (policyData.food) {
        if (policyData.food.type === "manual") {
          food = Number(policyData.food.value || 0);
        } else if (policyData.food.type === "percent") {
          const derivedBasic = calculateDerivedBasicFromPolicy(policyData);
          const base = policyData.food.base === "basic" ? derivedBasic : gross;
          food = (base * Number(policyData.food.value || 0)) / 100;
        }
      }

      let transport = 0;
      if (policyData.transport) {
        if (policyData.transport.type === "manual") {
          transport = Number(policyData.transport.value || 0);
        } else if (policyData.transport.type === "percent") {
          const derivedBasic = calculateDerivedBasicFromPolicy(policyData);
          const base =
            policyData.transport.base === "basic" ? derivedBasic : gross;
          transport = (base * Number(policyData.transport.value || 0)) / 100;
        }
      }

      let conveyance = 0;
      if (policyData.conveyance) {
        if (policyData.conveyance.type === "manual") {
          conveyance = Number(policyData.conveyance.value || 0);
        } else if (policyData.conveyance.type === "percent") {
          const derivedBasic = calculateDerivedBasicFromPolicy(policyData);
          const base =
            policyData.conveyance.base === "basic" ? derivedBasic : gross;
          conveyance = (base * Number(policyData.conveyance.value || 0)) / 100;
        }
      }

      const totalAllowances = medical + food + transport + conveyance;

      // Final Basic = (Gross - TotalAllowances) / Divided
      const m = Number(basicConfig.divided || 1);
      const result = (gross - totalAllowances) / m;
      return (result > 0 ? result : 0).toFixed(2);
    }

    return "0.00";
  };

  // Helper to calculate component values from stored policy data
  const calculateComponentFromPolicy = (policyData, component) => {
    const gross = Number(policyData.gross || 0);

    // For components based on basic, use the derived basic
    const derivedBasic = calculateDerivedBasicFromPolicy(policyData);

    const componentConfig = policyData[component];
    if (!componentConfig) return "0.00";

    if (componentConfig.type === "manual") {
      return Number(componentConfig.value || 0).toFixed(2);
    }

    if (componentConfig.type === "percent") {
      // Determine the base (gross or basic)
      const base = componentConfig.base === "basic" ? derivedBasic : gross;
      return ((base * Number(componentConfig.value || 0)) / 100).toFixed(2);
    }

    return "0.00";
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Salary Policy</h1>

      {!isCreating ? (
        // LIST VIEW
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Salary Policies</h2>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              + Create New Policy
            </button>
          </div>

          {policies.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No salary policies found. Create one to get started.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100 border">
                    <th className="border p-2 text-left">Employee Type</th>
                    <th className="border p-2 text-right">Gross</th>
                    <th className="border p-2 text-right">Basic</th>
                    <th className="border p-2 text-right">House Rent</th>
                    <th className="border p-2 text-right">Medical</th>
                    <th className="border p-2 text-right">Mobile</th>
                    <th className="border p-2 text-right">Food</th>
                    <th className="border p-2 text-right">Transport</th>
                    <th className="border p-2 text-right">Conveyance</th>
                    <th className="border p-2 text-right">Others1</th>
                    <th className="border p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {policies.map((policyItem) => (
                    <tr key={policyItem.id} className="border hover:bg-gray-50">
                      <td className="border p-2">
                        {policyItem.employee_type_name ||
                          policyItem.employee_type}
                      </td>
                      <td className="border p-2 text-right">
                        {Number(policyItem.gross).toFixed(2)}
                      </td>
                      <td className="border p-2 text-right font-semibold">
                        {calculateBasicFromPolicy(policyItem)}
                      </td>
                      <td className="border p-2 text-right">
                        {calculateComponentFromPolicy(policyItem, "house_rent")}
                      </td>
                      <td className="border p-2 text-right">
                        {calculateComponentFromPolicy(policyItem, "medical")}
                      </td>
                      <td className="border p-2 text-right">
                        {calculateComponentFromPolicy(
                          policyItem,
                          "mobile_allowance",
                        )}
                      </td>
                      <td className="border p-2 text-right">
                        {calculateComponentFromPolicy(policyItem, "food")}
                      </td>
                      <td className="border p-2 text-right">
                        {calculateComponentFromPolicy(policyItem, "transport")}
                      </td>
                      <td className="border p-2 text-right">
                        {calculateComponentFromPolicy(policyItem, "conveyance")}
                      </td>
                      <td className="border p-2 text-right">
                        {calculateComponentFromPolicy(policyItem, "others1")}
                      </td>
                      <td className="border p-2 text-center space-x-1">
                        <button
                          onClick={() => handleEdit(policyItem)}
                          className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(policyItem.id)}
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        // FORM VIEW
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-2">
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
              Basic Salary = {calculateBasic().toFixed(2)}
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
            title="Medical Allowance"
            item={policy.medical}
            showBase
            setItem={(val) => setPolicy({ ...policy, medical: val })}
            validateValue={validateValue}
            calculateAmount={calculateAmount}
            fieldError={null}
          />

          <AllowanceBlock
            title="Mobile Allowance"
            item={policy.mobile_allowance}
            showBase
            setItem={(val) => setPolicy({ ...policy, mobile_allowance: val })}
            validateValue={validateValue}
            calculateAmount={calculateAmount}
            fieldError={null}
          />

          <AllowanceBlock
            title="Food Allowance"
            item={policy.food}
            showBase
            setItem={(val) => setPolicy({ ...policy, food: val })}
            validateValue={validateValue}
            calculateAmount={calculateAmount}
            fieldError={null}
          />

          <AllowanceBlock
            title="Transport Allowance"
            item={policy.transport}
            showBase
            setItem={(val) => setPolicy({ ...policy, transport: val })}
            validateValue={validateValue}
            calculateAmount={calculateAmount}
            fieldError={null}
          />

          <AllowanceBlock
            title="Conveyance Allowance"
            item={policy.conveyance}
            showBase
            setItem={(val) => setPolicy({ ...policy, conveyance: val })}
            validateValue={validateValue}
            calculateAmount={calculateAmount}
            fieldError={null}
          />

          <AllowanceBlock
            title="Others Allowances"
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
            Total (Basic + HR + Medical + Mobile + Food + Transport + Conveyance
            ) = {getGrandTotal().toFixed(2)}
          </div>

          <div className="text-right font-semibold text-purple-700">
            Others1 (Gross - Total) = {calculateOthers1Remainder().toFixed(2)}
          </div>

          <div className="text-right">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-slate-900 text-white rounded mr-2 hover:bg-slate-800"
            >
              {editingId ? "Update Policy" : "Save Policy"}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
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
