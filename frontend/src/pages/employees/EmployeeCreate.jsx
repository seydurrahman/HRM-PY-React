import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";


const EmployeeCreate = () => {
  const navigate = useNavigate();

  const tabs = [
    "employee",
    "basic",
    "official",
    "salary",
    "leave info",
    "job experience",
    "education",
    "training",
    "documents",
  ];
  const [activeTab, setActiveTab] = useState("employee");

  const [designations, setDesignations] = useState([]);
  const [grades, setGrades] = useState([]);

  const [employees, setEmployees] = useState([]);

  const [jobExperiences, setJobExperiences] = useState([
    {
      job_company_name: "",
      job_department: "",
      job_designation: "",
      job_start_date: "",
      job_end_date: "",
      leave_reason: "",
    },
  ]);

  const [educations, setEducations] = useState([
    {
      degree_title: "",
      major_subject: "",
      institute_name: "",
      passing_year: "",
      education_board: "",
      result: "",
    },
  ]);

  const [training, setTraining] = useState([
    {
      training_name: "",
      training_institute: "",
      institute_address: "",
      training_duration: "",
      training_result: "",
      remarks: "",
    },
  ]);

  const [otherDocs, setOtherDocs] = useState([{ title: "", file: null }]);

  const [units, setUnits] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [subsections, setSubsections] = useState([]);
  const [floors, setFloors] = useState([]);
  const [lines, setLines] = useState([]);

  // Division to union
  const [bdDivisions, setBdDivisions] = useState([]);
  const [bdDistricts, setBdDistricts] = useState([]);
  const [bdUpazilas, setBdUpazilas] = useState([]);
  const [bdUnions, setBdUnions] = useState([]);

  const [codeError, setCodeError] = useState("");
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [isLoadingCode, setIsLoadingCode] = useState(true);
  const [formErrors, setFormErrors] = useState({}); // Track form errors

  const [countries, setCountries] = useState([]);

  // Load saved form data
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("employeeForm");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        delete parsed.code;
        return {
          code: "",
          date_of_birth: "",
          ...parsed,
        };
      } catch (e) {
        console.error("Error parsing saved form:", e);
        localStorage.removeItem("employeeForm");
      }
    }

    return {
      // Employee
      code: "",
      employee_id: "",
      first_name: "",
      last_name: "",
      full_name_bangla: "",
      phone: "",
      unit: "",
      division: "",
      department: "",
      section: "",
      subsection: "",
      floor: "",
      line: "",
      designation: "",

      // Basic
      date_of_birth: "",
      father_name: "",
      f_bangla_name: "",
      mother_name: "",
      m_bangla_name: "",
      religion: "",
      nationality: "",
      nid_no: "",
      birth_certificate: "",
      email: "",
      blood_group: "",
      marital_status: "",
      spouse_name: "",
      spouse_name_bangla: "",
      spouse_mobile: "",
      nominee_name: "",
      nominee_name_bangla: "",
      nominee_relation: "",
      nominee_mobile: "",
      nominee_nid: "",
      nominee_country: "",
      nominee_division: "",
      nominee_district: "",
      nominee_upazila: "",
      nominee_union: "",
      nominee_post_code: "",
      nominee_village: "",
      nominee_village_bangla: "",
      emg_contact_name: "",
      emg_contact_phone: "",
      emg_contact_relation: "",
      country: "",
      division: "",
      district: "",
      upazila: "",
      union: "",
      post_code: "",
      address: "",
      village: "",
      village_bangla: "",
      local_auth_name: "",
      local_auth_mobile: "",
      local_auth_relation: "",
      identity_mark: "",
      weight: "",
      height: "",

      // Official
      employee_type: "PER",
      employment_type: "FT",
      group_name: "",
      grade: "",
      device_id: "",
      join_date: "",
      confirm_date: "",
      reporting_to: "",
      disburse_type: "",
      mfs_number: "",
      shift: "",
      weekends: "",
      office_email: "",
      emp_panel_user: "",
      bgmea_ID: "",
      bkmea_ID: "",
      transport: false,
      food_allowance: "",
      bank_name: "",
      branch_name: "",
      account_no: "",
      account_type: "",
      basic_salary: "",
      bank_name: "",
      account_number: "",
      nid_number: "",

      // Job Experience
      job_company_name: "",
      job_department: "",
      job_designation: "",
      job_start_date: "",
      job_end_date: "",
      leave_reason: "",

      // Salary
      effective_date: "",
      salary_policy: "",
      pf_applicable: false,
      late_deduction: false,
      tin_number: "",
      gross_salary: "",
      basic_salary: "",
      house_rent: "",
      medical_allowance: "",
      mobile_allowance: "",
      transport_allowance: "",
      conveyance_allowance: "",
      other_allowance: "",
      attendance_bonus: "",
      tax_deduction: "",
      insurance_deduction: "",
      stamp_deduction: "",
      other_deduction: "",

      // Education
      degree_title: "",
      major_subject: "",
      institute_name: "",
      passing_year: "",
      education_board: "",
      result: "",

      // Leave Info
      leave_effective: "",
      casual_leave: "",
      sick_leave: "",
      earned_leave: "",
      maternity_leave: "",
      paternity_leave: "",
      funeral_leave: "",
      compensatory_leave: "",
      unpaid_leave: "",

      // Training
      training_name: "",
      training_institute: "",
      institute_address: "",
      training_duration: "",
      training_result: "",
      remarks: "",

      // Documents
      emp_id: "",
      emp_id_docs: null,
      emp_birthcertificate: "",
      emp_birthcertificate_docs: null,
      nominee_id: "",
      nominee_id_docs: null,
      job_exp_certificate: "",
      job_exp_certificate_docs: null,
      education_certificate: "",
      education_certificate_docs: null,
      training_certificate: "",
      training_certificate_docs: null,

      // system
      is_active: true,
    };
  });

  // Save to localStorage
  useEffect(() => {
    if (form.code && form.code.trim() !== "") {
      localStorage.setItem("employeeForm", JSON.stringify(form));
    }
  }, [form]);

  // Fetch designation + grade
  useEffect(() => {
    api.get("/settings/designations/").then((res) => setDesignations(res.data));
    api.get("/settings/grades/").then((res) => setGrades(res.data));
  }, []);

  // Fetch organization units-table
  useEffect(() => {
    api.get("/org/units/").then((res) => setUnits(res.data));
  }, []);
  useEffect(() => {
    if (!form.unit) {
      setDivisions([]);
      return;
    }

    api
      .get(`/org/divisions/?unit_id=${form.unit}`)
      .then((res) => setDivisions(res.data))
      .catch((err) => console.error(err));
  }, [form.unit]);
  useEffect(() => {
    if (!form.division) {
      setDepartments([]);
      return;
    }

    api
      .get(`/org/departments/?division_id=${form.division}`)
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error(err));
  }, [form.division]);
  useEffect(() => {
    if (!form.department) {
      setSections([]);
      return;
    }

    api
      .get(`/org/sections/?department_id=${form.department}`)
      .then((res) => setSections(res.data))
      .catch((err) => console.error(err));
  }, [form.department]);
  useEffect(() => {
    if (!form.section) {
      setSubsections([]);
      return;
    }

    api
      .get(`/org/subsections/?section_id=${form.section}`)
      .then((res) => setSubsections(res.data));
  }, [form.section]);
  useEffect(() => {
    if (!form.section) {
      setFloors([]);
      return;
    }

    api
      .get(`/org/floors/?section_id=${form.section}`)
      .then((res) => setFloors(res.data));
  }, [form.section]);
  useEffect(() => {
    if (!form.floor) {
      setLines([]);
      return;
    }

    api
      .get(`/org/lines/?floor_id=${form.floor}`)
      .then((res) => setLines(res.data));
  }, [form.floor]);

  // Country
  useEffect(() => {
    api
      .get("/countries/")
      .then((res) => {
        console.log("Countries API Response:", res.data);
        setCountries(res.data);
      })
      .catch((err) => console.error("Country error:", err));
  }, []);

  // Division to union
  useEffect(() => {
    fetch("https://bdapi.vercel.app/api/v.1/division")
      .then((res) => res.json())
      .then((data) => setBdDivisions(data.data))
      .catch((err) => console.error("Division Load Error:", err));
  }, []);

  useEffect(() => {
    if (!form.nominee_division) {
      setBdDistricts([]);
      return;
    }

    fetch(
      `https://bdapi.vercel.app/api/v.1/district?division_id=${form.nominee_division}`
    )
      .then((res) => res.json())
      .then((data) => setBdDistricts(data.data))
      .catch((err) => console.error("District Load Error:", err));

    // RESET CHILD FIELDS
    setForm((prev) => ({
      ...prev,
      nominee_district: "",
      nominee_upazila: "",
      nominee_union: "",
    }));
  }, [form.nominee_division]);

  useEffect(() => {
    if (!form.nominee_district) {
      setBdUpazilas([]);
      return;
    }

    fetch(
      `https://bdapi.vercel.app/api/v.1/upazila?district_id=${form.nominee_district}`
    )
      .then((res) => res.json())
      .then((data) => setBdUpazilas(data.data))
      .catch((err) => console.error("Upazila Load Error:", err));

    setForm((prev) => ({
      ...prev,
      nominee_upazila: "",
      nominee_union: "",
    }));
  }, [form.nominee_district]);

  useEffect(() => {
    if (!form.nominee_upazila) {
      setBdUnions([]);
      return;
    }

    fetch(
      `https://bdapi.vercel.app/api/v.1/union?upazila_id=${form.nominee_upazila}`
    )
      .then((res) => res.json())
      .then((data) => setBdUnions(data.data))
      .catch((err) => console.error("Union Load Error:", err));

    setForm((prev) => ({
      ...prev,
      nominee_union: "",
    }));
  }, [form.nominee_upazila]);

  // emploee Id get
  useEffect(() => {
    api
      .get("/employees/")
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Employee fetch error:", err));
  }, []);

  // Add/Remove Job Experience Entries
  const addJobExperience = () => {
    setJobExperiences([
      ...jobExperiences,
      {
        job_company_name: "",
        job_department: "",
        job_designation: "",
        job_start_date: "",
        job_end_date: "",
        leave_reason: "",
      },
    ]);
  };

  const removeJobExperience = (index) => {
    const updated = jobExperiences.filter((_, i) => i !== index);
    setJobExperiences(updated);
  };

  const handleJobChange = (index, e) => {
    const updated = [...jobExperiences];
    updated[index][e.target.name] = e.target.value;
    setJobExperiences(updated);
  };

  // Add/Remove Education Entries
  const addEducation = () => {
    setEducations([
      ...educations,
      {
        degree_title: "",
        major_subject: "",
        institute_name: "",
        passing_year: "",
        education_board: "",
        result: "",
      },
    ]);
  };
  const removeEducation = (index) => {
    const updated = educations.filter((_, i) => i !== index);
    setEducations(updated);
  };

  const handleEducationChange = (index, e) => {
    const updated = [...educations];
    updated[index][e.target.name] = e.target.value;
    setEducations(updated);
  };

  // Add/Remove Training Entries
  const addTraining = () => {
    setTraining([
      ...training,
      {
        training_name: "",
        training_institute: "",
        institute_address: "",
        training_duration: "",
        training_result: "",
        remarks: "",
      },
    ]);
  };
  const removeTraining = (index) => {
    const updated = training.filter((_, i) => i !== index);
    setTraining(updated);
  };

  const handleTrainingChange = (index, e) => {
    const updated = [...training];
    updated[index][e.target.name] = e.target.value;
    setTraining(updated);
  };
  // Add/Remove for Others Document
  const handleOtherDocChange = (index, field, value) => {
    const updated = [...otherDocs];
    updated[index][field] = value;
    setOtherDocs(updated);
  };

  const addOtherDoc = () => {
    setOtherDocs([...otherDocs, { title: "", file: null }]);
  };

  const removeOtherDoc = (index) => {
    const updated = otherDocs.filter((_, i) => i !== index);
    setOtherDocs(updated);
  };

  // Auto-generate employee code
  useEffect(() => {
    const generateEmployeeCode = async () => {
      setIsLoadingCode(true);
      try {
        if (form.code && form.code.startsWith("EMP-")) {
          setIsLoadingCode(false);
          return;
        }

        const response = await api.get("/employees-next-code/");
        console.log("API Response:", response.data);

        if (response.data && response.data.next_code) {
          setForm((prev) => ({
            ...prev,
            code: response.data.next_code,
          }));
        } else {
          setForm((prev) => ({ ...prev, code: "EMP-0001" }));
        }
      } catch (error) {
        console.error("Error generating employee code:", error);
        const fallbackCode = `EMP-${Date.now().toString().slice(-4)}`;
        setForm((prev) => ({ ...prev, code: fallbackCode }));
      } finally {
        setIsLoadingCode(false);
      }
    };

    if (!form.code || form.code.trim() === "") {
      generateEmployeeCode();
    } else {
      setIsLoadingCode(false);
    }
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setForm({ ...form, documents: e.target.files[0] });
  };

  // Check code uniqueness
  const checkCode = async () => {
    if (!form.code) return;

    setIsCheckingCode(true);
    try {
      const res = await api.get(
        `/employees-check-code/?code=${encodeURIComponent(form.code)}`
      );
      if (res.data.exists) {
        setCodeError("Employee Code already exists!");
      } else {
        setCodeError("");
      }
    } catch (err) {
      console.error("Error checking code:", err);
      setCodeError("Error checking code. Please try again.");
    }
    setIsCheckingCode(false);
  };

  // Regenerate code
  const regenerateCode = async () => {
    setIsLoadingCode(true);
    try {
      const res = await api.get("/employees-next-code/");
      if (res.data.next_code) {
        setForm((prev) => ({ ...prev, code: res.data.next_code }));
        setCodeError("");
      }
    } catch (error) {
      console.error("Error regenerating code:", error);
    } finally {
      setIsLoadingCode(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!form.code || form.code.trim() === "") {
      errors.code = "Employee code is required";
    }

    if (!form.first_name || form.first_name.trim() === "") {
      errors.first_name = "First name is required";
    }

    if (codeError) {
      errors.code = codeError;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Next tab
  const nextTab = () => {
    // Validate current tab
    let isValid = true;
    const errors = {};

    if (activeTab === "employee") {
      if (!form.code || form.code.trim() === "") {
        errors.code = "Employee code is required";
        isValid = false;
      }
      if (!form.first_name || form.first_name.trim() === "") {
        errors.first_name = "First name is required";
        isValid = false;
      }
      if (codeError) {
        errors.code = codeError;
        isValid = false;
      }
    }

    if (!isValid) {
      setFormErrors(errors);
      alert("Please fix the errors before proceeding.");
      return;
    }

    const i = tabs.indexOf(activeTab);
    if (i < tabs.length - 1) setActiveTab(tabs[i + 1]);
  };

  // Previous tab
  const prevTab = () => {
    const i = tabs.indexOf(activeTab);
    if (i > 0) setActiveTab(tabs[i - 1]);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form data before submit:", form);

    // Validate all required fields
    if (!validateForm()) {
      alert("Please fix all errors before submitting.");
      return;
    }

    if (codeError) {
      alert("Please fix the employee code error before submitting.");
      return;
    }

    // Create FormData
    const fd = new FormData();

    // Append all fields
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        if (key === "documents" && value instanceof File) {
          fd.append(key, value, value.name);
        } else if (key !== "documents") {
          fd.append(key, String(value));
        }
      }
    });

    // Debug - show all FormData entries
    console.log("FormData entries:");
    for (let [key, value] of fd.entries()) {
      console.log(key, ":", value);
    }

    try {
      console.log("Submitting to /employees/ with code:", form.code);

      const response = await api.post("/employees/", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Success response:", response.data);

      localStorage.removeItem("employeeForm");
      alert("Employee created successfully!");
      navigate("/employees");
    } catch (err) {
      console.error("Submission error:", err);
      console.error("Error response:", err.response?.data);

      if (err.response?.data) {
        let errorMessage = "Failed to create employee:\n";
        if (typeof err.response.data === "object") {
          Object.entries(err.response.data).forEach(([field, errors]) => {
            if (Array.isArray(errors)) {
              errorMessage += `${field}: ${errors.join(", ")}\n`;
            } else {
              errorMessage += `${field}: ${errors}\n`;
            }
          });
        } else {
          errorMessage = err.response.data;
        }
        alert(errorMessage);
      } else {
        alert("Failed to create employee. Please check console for details.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Add New Employee</h1>

      {/* TABS */}
      <div className="flex gap-10 border-b pb-2 text-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`pb-2 capitalize ${
              activeTab === tab
                ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white shadow-sm rounded-xl p-6">
        <form onSubmit={handleSubmit}>
          {/* EMPLOYEE INFO TAB */}
          {activeTab === "employee" && (
            <div className="grid grid-cols-3 gap-4">
              {/* Employee Code */}
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  EMP System Code *
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      name="code"
                      className={`border p-2 rounded w-full ${
                        formErrors.code || codeError
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Generating employee code..."
                      value={form.code}
                      readOnly
                      onBlur={checkCode}
                    />
                    {isLoadingCode && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={regenerateCode}
                    className="px-3 bg-blue-100 text-blue-600 rounded text-sm whitespace-nowrap hover:bg-blue-200"
                    disabled={isLoadingCode}
                  >
                    {isLoadingCode ? "..." : "⟳"}
                  </button>
                </div>
                {isCheckingCode && (
                  <p className="text-xs text-gray-500 mt-1">
                    Checking code availability...
                  </p>
                )}
                {(formErrors.code || codeError) && (
                  <p className="text-xs text-red-600 mt-1">
                    {formErrors.code || codeError}
                  </p>
                )}
              </div>

              {/* Employee ID */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Employee ID
                </label>
                <input
                  name="employee_id"
                  className={`border p-2 rounded w-full ${
                    formErrors.employee_id
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Employee ID"
                  value={form.employee_id}
                  onChange={handleChange}
                />
                {formErrors.employee_id && (
                  <p className="text-xs text-red-600 mt-1">
                    {formErrors.employee_id}
                  </p>
                )}
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  name="first_name"
                  className={`border p-2 rounded w-full ${
                    formErrors.first_name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="First Name"
                  value={form.first_name}
                  onChange={handleChange}
                />
                {formErrors.first_name && (
                  <p className="text-xs text-red-600 mt-1">
                    {formErrors.first_name}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  name="last_name"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Last Name"
                  value={form.last_name}
                  onChange={handleChange}
                />
              </div>

              {/* Bangla Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  নাম [বাংলায়]
                </label>
                <input
                  name="bangla_name"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="পুরো নাম"
                  value={form.bangla_name}
                  onChange={handleChange}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.phone}
                  onChange={handleChange}
                  pattern="01[0-9]{9}"
                  maxLength="11"
                  placeholder="01XXXXXXXXX"
                  title="Mobile number must be 11 digits and start with 01"
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium mb-1">Unit</label>
                <select
                  name="unit"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.unit}
                  onChange={handleChange}
                >
                  <option value="">Select Unit</option>
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Division */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Division
                </label>
                <select
                  name="division"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.division}
                  onChange={handleChange}
                >
                  <option value="">Select Division</option>
                  {divisions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Department
                </label>
                <select
                  name="department"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.department}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Section
                </label>
                <select
                  name="section"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.section}
                  onChange={handleChange}
                >
                  <option value="">Select Section</option>
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subsection */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Subsection
                </label>
                <select
                  name="subsection"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.subsection}
                  onChange={handleChange}
                >
                  <option value="">Select Subsection</option>
                  {subsections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Floor */}
              <div>
                <label className="block text-sm font-medium mb-1">Floor</label>
                <select
                  name="floor"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.floor}
                  onChange={handleChange}
                >
                  <option value="">Select Floor</option>
                  {floors.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Line */}
              <div>
                <label className="block text-sm font-medium mb-1">Line</label>
                <select
                  name="line"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.line}
                  onChange={handleChange}
                >
                  <option value="">Select Line</option>
                  {lines.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Designation
                </label>
                <select
                  name="designation"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.designation}
                  onChange={handleChange}
                >
                  <option value="">Select Designation</option>
                  {designations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* BASIC INFO TAB */}
          {activeTab === "basic" && (
            <div className="grid grid-cols-3 gap-4">
              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date of Birth
                </label>
                <input
                  name="date_of_birth"
                  type="date"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.date_of_birth}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]} // Prevent future dates
                />
              </div>

              {/* Father Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Father Name
                </label>
                <input
                  name="father_name"
                  className={`border p-2 rounded w-full ${
                    formErrors.father_name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Father Name"
                  value={form.father_name}
                  onChange={handleChange}
                />
                {formErrors.father_name && (
                  <p className="text-xs text-red-600 mt-1">
                    {formErrors.father_name}
                  </p>
                )}
              </div>

              {/* Bangla Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  পিতার নাম [বাংলায়]
                </label>
                <input
                  name="f_bangla_name"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="পিতার নাম"
                  value={form.f_bangla_name}
                  onChange={handleChange}
                />
              </div>

              {/* Mother Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mother Name
                </label>
                <input
                  name="mother_name"
                  className={`border p-2 rounded w-full ${
                    formErrors.mother_name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Mother Name"
                  value={form.mother_name}
                  onChange={handleChange}
                />
                {formErrors.mother_name && (
                  <p className="text-xs text-red-600 mt-1">
                    {formErrors.mother_name}
                  </p>
                )}
              </div>

              {/* Bangla Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  মায়ের নাম [বাংলায়]
                </label>
                <input
                  name="m_bangla_name"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="মায়ের নাম"
                  value={form.m_bangla_name}
                  onChange={handleChange}
                />
              </div>

              {/* Religion */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Religion
                </label>
                <select
                  name="religion"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.religion}
                  onChange={handleChange}
                >
                  <option value="">Select Religion</option>
                  <option value="Islam">Islam</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Christian">Christian</option>
                  <option value="Buddhist">Buddhist</option>
                </select>
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nationality
                </label>
                <select
                  name="nationality"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.nationality}
                  onChange={handleChange}
                  defuldtValue="Bangladesh"
                >
                  <option value="">Select Nationality</option>
                  {countries.map((c, index) => (
                    <option key={index} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* NID No */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  NID Number
                </label>
                <input
                  name="nid_no"
                  className={`border p-2 rounded w-full ${
                    formErrors.nid_no ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="NID Number"
                  value={form.nid_no}
                  onChange={handleChange}
                />
                {formErrors.nid_no && (
                  <p className="text-xs text-red-600 mt-1">
                    {formErrors.nid_no}
                  </p>
                )}
              </div>

              {/* Birth Certificate */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Birth Certificate
                </label>
                <input
                  name="birth_certificate"
                  className={`border p-2 rounded w-full ${
                    formErrors.birth_certificate
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Birth Certificate"
                  value={form.birth_certificate}
                  onChange={handleChange}
                />
                {formErrors.birth_certificate && (
                  <p className="text-xs text-red-600 mt-1">
                    {formErrors.birth_certificate}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  className={`border p-2 rounded w-full ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                />
                {formErrors.email && (
                  <p className="text-xs text-red-600 mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Blood Group
                </label>
                <select
                  name="blood_group"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.blood_group}
                  onChange={handleChange}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              {/* Marital Status */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Marital Status
                </label>
                <select
                  name="marital_status"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.marital_status}
                  onChange={handleChange}
                >
                  <option value="">Select Marital Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>

              {/* Spouse Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Spouse Name
                </label>
                <input
                  name="spouse_name"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Spouse Name"
                  value={form.spouse_name}
                  onChange={handleChange}
                />
              </div>
              {/* Bangla Name */}
              <div>
                <label className="block text-sm font-medium mb-1">বাংলায়</label>
                <input
                  name="bangla_name"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Spouse বাংলায়"
                  value={form.bangla_name}
                  onChange={handleChange}
                />
              </div>

              {/* Spouse Mobile */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Spouse Mobile
                </label>
                <input
                  name="spouse_mobile"
                  type="tel"
                  pattern="01[0-9]{9}"
                  maxLength="11"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="01XXXXXXXXX"
                  value={form.spouse_mobile}
                  onChange={handleChange}
                  title="Mobile number must be 11 digits and start with 01"
                />
              </div>

              {/* Nominee Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nominee Name
                </label>
                <input
                  name="nominee_name"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Nominee Name"
                  value={form.nominee_name}
                  onChange={handleChange}
                />
              </div>
              {/* Nominee Name Bangla */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nominee-বাংলায়
                </label>
                <input
                  name="nominee_name_bangla"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="নমিনি নাম"
                  value={form.nominee_name_bangla}
                  onChange={handleChange}
                />
              </div>

              {/* Nominee Relation */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nominee Relation
                </label>
                <select
                  name="nominee_relation"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Nominee Relation"
                  value={form.nominee_relation}
                  onChange={handleChange}>
                  <option value="">Select Marital Status</option>
                  <option value="single">Mother</option>
                  <option value="married">Father</option>
                  <option value="divorced">Brother</option>
                  <option value="widowed">Sister</option>
                  <option value="widowed">Others</option>
                </select>
              </div>
              
              {/* Nominee Mobile */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nominee Mobile
                </label>
                <input
                  name="nominee_mobile"
                  type="tel"
                  pattern="01[0-9]{9}"
                  maxLength="11"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="01XXXXXXXXX"
                  value={form.nominee_mobile}
                  onChange={handleChange}
                  title="Mobile number must be 11 digits and start with 01"
                />
              </div>
              {/* Nominee NID */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nominee NID
                </label>
                <input
                  name="nominee_nid"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Nominee NID"
                  value={form.nominee_nid}
                  onChange={handleChange}
                />
              </div>
              {/* Nominee country */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nominee Country
                </label>
                <select
                  name="nominee_country"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.nominee_country}
                  onChange={handleChange}
                  defuldtValue="Bangladesh"
                >
                  <option value="">Select Nationality</option>
                  {countries.map((n_c, index) => (
                    <option key={index} value={n_c.name}>
                      {n_c.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Nominee Division */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nominee Division
                </label>
                <select
                  name="nominee_division"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.nominee_division}
                  onChange={handleChange}
                >
                  <option value="">Select Division</option>
                  {bdDivisions.map((div) => (
                    <option key={div.id} value={div.id}>
                      {div.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Nominee District */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nominee District
                </label>
                <select
                  name="nominee_district"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.nominee_district}
                  onChange={handleChange}
                >
                  <option value="">Select District</option>
                  {bdDistricts.map((dist) => (
                    <option key={dist.id} value={dist.id}>
                      {dist.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Nominee Upazila */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nominee Upazila
                </label>
                <select
                  name="nominee_upazila"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.nominee_upazila}
                  onChange={handleChange}
                >
                  <option value="">Select Upazila</option>
                  {bdUpazilas.map((upa) => (
                    <option key={upa.id} value={upa.id}>
                      {upa.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Nominee Union */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nominee Union
                </label>
                <select
                  name="nominee_union"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.nominee_union}
                  onChange={handleChange}
                >
                  <option value="">Select Union</option>
                  {bdUnions.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Nominee Post Code */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nominee Post Code
                </label>
                <input
                  name="nominee_post_code"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Nominee Post Code"
                  value={form.nominee_post_code}
                  onChange={handleChange}
                />
              </div>
              {/* Nominee Village */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nominee Village
                </label>
                <input
                  name="nominee_village"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Nominee Village"
                  value={form.nominee_village}
                  onChange={handleChange}
                />
              </div>
              {/* Nominee Village Bangla */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  নমিনির গ্রাম-বাংলায়
                </label>
                <input
                  name="nominee_village_bangla"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="নমিনির গ্রাম"
                  value={form.nominee_village_bangla}
                  onChange={handleChange}
                />
              </div>
              {/* Emg_Contact Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Emergency Contact Name
                </label>
                <input
                  name="emg_contact_name"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Emergency Contact Name"
                  value={form.emg_contact_name}
                  onChange={handleChange}
                />
              </div>
              {/* Emg_Contact Phone */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Emergency Contact Phone
                </label>
                <input
                  name="emg_contact_phone"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Emergency Contact Phone"
                  value={form.emg_contact_phone}
                  onChange={handleChange}
                />
              </div>
              {/* Emg_Contact Relation */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Emergency Contact Relation
                </label>
                <input
                  name="emg_contact_relation"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Emergency Contact Relation"
                  value={form.emg_contact_relation}
                  onChange={handleChange}
                />
              </div>
              {/* Country */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Country
                </label>
                <select
                  name="country"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.country}
                  onChange={handleChange}
                  defuldtValue="Bangladesh"
                >
                  <option value="">Select Nationality</option>
                  {countries.map((c, index) => (
                    <option key={index} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Division */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Division
                </label>
                <select
                  name="division"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.division}
                  onChange={handleChange}
                >
                  <option value="">Select Division</option>
                  {bdDivisions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* District */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  District
                </label>
                <select
                  name="district"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.district}
                  onChange={handleChange}
                >
                  <option value="">Select District</option>
                  {bdDistricts.map((dist) => (
                    <option key={dist.id} value={dist.id}>
                      {dist.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Upazila */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Upazila
                </label>
                <select
                  name="upazila"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.upazila}
                  onChange={handleChange}
                >
                  <option value="">Select Upazila</option>
                  {bdUpazilas.map((upa) => (
                    <option key={upa.id} value={upa.id}>
                      {upa.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Union */}
              <div>
                <label className="block text-sm font-medium mb-1">Union</label>
                <select
                  name="union"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.union}
                  onChange={handleChange}
                >
                  <option value="">Select Union</option>
                  {bdUnions.map((uni) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Post Code */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Post Code
                </label>
                <input
                  name="post_code"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Post Code"
                  value={form.post_code}
                  onChange={handleChange}
                />
              </div>
              {/* Village */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Village
                </label>
                <input
                  name="village"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Village"
                  value={form.village}
                  onChange={handleChange}
                />
              </div>
              {/* Village Bangla */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  গ্রাম-বাংলায়
                </label>
                <input
                  name="village_bangla"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="গ্রাম-বাংলায়"
                  value={form.village_bangla}
                  onChange={handleChange}
                />
              </div>
              {/* Local Auth Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Local Authority Name
                </label>
                <input
                  name="local_auth_name"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Local Authority Name"
                  value={form.local_auth_name}
                  onChange={handleChange}
                />
              </div>
              {/* Local Auth Mobile */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Local Authority Mobile
                </label>
                <input
                  name="local_auth_mobile"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.local_auth_mobile}
                  onChange={handleChange}
                  type="tel"
                  pattern="01[0-9]{9}"
                  maxLength="11"
                  placeholder="01XXXXXXXXX"
                  title="Mobile number must be 11 digits and start with 01"
                />
              </div>
              {/* Local Auth Relation */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Local Authority Relation
                </label>
                <input
                  name="local_auth_relation"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Local Authority Relation"
                  value={form.local_auth_relation}
                  onChange={handleChange}
                />
              </div>
              {/* Identity */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Identity Mark
                </label>
                <input
                  name="identity_mark"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Identity Mark"
                  value={form.identity_mark}
                  onChange={handleChange}
                />
              </div>
              {/* Weight */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Weight (kg)
                </label>
                <input
                  name="weight"
                  type="number"
                  step="0.01"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Weight in kg"
                  value={form.weight}
                  onChange={handleChange}
                />
              </div>
              {/* Height */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Height (cm)
                </label>
                <input
                  name="height"
                  type="number"
                  step="0.01"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Height in cm"
                  value={form.height}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* OFFICIAL INFO TAB */}
          {activeTab === "official" && (
            <div className="grid grid-cols-3 gap-4">
              {/* Employee Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Employee Type
                </label>
                <select
                  name="employee_type"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.employee_type}
                  onChange={handleChange}
                >
                  <option value="PER">Permanent</option>
                  <option value="CON">Contract</option>
                  <option value="TMP">Temporary</option>
                </select>
              </div>

              {/* Employment Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Employment Type
                </label>
                <select
                  name="employment_type"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.employment_type}
                  onChange={handleChange}
                >
                  <option value="FT">Full Time</option>
                  <option value="PT">Part Time</option>
                </select>
              </div>
              {/* Group */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Group Name
                </label>
                <select
                  name="group_name"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.group_name}
                  onChange={handleChange}
                >
                  <option value="">Select Group</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
              </div>

              {/* Grade */}
              <div>
                <label className="block text-sm font-medium mb-1">Grade</label>
                <select
                  name="grade"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.grade}
                  onChange={handleChange}
                >
                  <option value="">Select Grade</option>
                  {grades.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Device ID */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Device ID
                </label>
                <input
                  name="device_id"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Device ID"
                  value={form.device_id}
                  onChange={handleChange}
                />
              </div>
              {/* Join Date */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Join Date
                </label>
                <input
                  name="join_date"
                  type="date"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.join_date}
                  onChange={handleChange}
                />
              </div>
              {/* Confirm Date */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Confirm Date
                </label>
                <input
                  name="confirm_date"
                  type="date"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.confirm_date}
                  onChange={handleChange}
                />
              </div>
              {/* Reporting To */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Reporting To
                </label>
                <select
                  name="reporting_to"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.reporting_to}
                  onChange={handleChange}
                >
                  <option value="">Select Reporting To</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.code} — {emp.first_name} {emp.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Disburse Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Disburse Type
                </label>
                <select
                  name="disburse_type"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.disburse_type}
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  <option value="bank">Bank</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
              {/* MFS Number */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  MFS Number
                </label>
                <input
                  name="mfs_number"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="MFS Number"
                  value={form.mfs_number}
                  onChange={handleChange}
                />
              </div>
              {/* Shift */}
              <div>
                <label className="block text-sm font-medium mb-1">Shift</label>
                <select
                  name="shift"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.shift}
                  onChange={handleChange}
                >
                  <option value="">Select Shift</option>
                  <option value="morning">General(8am-5pm)</option>
                  <option value="evening">Day(8am-8pm)</option>
                  <option value="evening">Night(8pm-8am)</option>
                </select>
              </div>
              {/* Weekend */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Weekend
                </label>
                <select
                  name="weekend"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.weekend}
                  onChange={handleChange}
                >
                  <option value="">Select Weekend</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                </select>
              </div>

              {/* Official Mail */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Official Email
                </label>
                <input
                  name="official_email"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Official Email"
                  value={form.official_email}
                  onChange={handleChange}
                />
              </div>

              {/* Official Mobile */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Official Mobile
                </label>
                <input
                  name="official_mobile"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.official_mobile}
                  onChange={handleChange}
                  type="tel"
                  pattern="01[0-9]{9}"
                  maxLength="11"
                  placeholder="01XXXXXXXXX"
                  title="Mobile number must be 11 digits and start with 01"
                />
              </div>

              {/* Work Location */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Work Location
                </label>
                <input
                  name="work_location"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Work Location"
                  value={form.work_location}
                  onChange={handleChange}
                />
              </div>

              {/* OT_eligibility */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  OT Eligibility
                </label>
                <select
                  name="ot_eligibility"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.ot_eligibility}
                  onChange={handleChange}
                >
                  <option value="">Select OT Eligibility</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {/* software_user */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Software User
                </label>
                <select
                  name="software_user"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.software_user}
                  onChange={handleChange}
                >
                  <option value="">Select Software User</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {/* emp_panel_user */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Employee Panel User
                </label>
                <select
                  name="emp_panel_user"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.emp_panel_user}
                  onChange={handleChange}
                >
                  <option value="">Select Employee Panel User</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {/* bgmea_ID */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  BGMEA ID
                </label>
                <input
                  name="bgmea_id"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="BGMEA ID"
                  value={form.bgmea_id}
                  onChange={handleChange}
                />
              </div>

              {/* bkmea_ID */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  BKMEA ID
                </label>
                <input
                  name="bkmea_id"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="BKMEA ID"
                  value={form.bkmea_id}
                  onChange={handleChange}
                />
              </div>

              {/* transport */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Transport
                </label>
                <select
                  name="transport"
                  className="border border-gray-300 p-2 rounded w-full"
                  value={form.transport}
                  onChange={handleChange}
                >
                  <option value="">Select Transport</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {/* food_allowance */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Food Allowance
                </label>
                <input
                  name="food_allowance"
                  type="number"
                  step="0.01"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="0.00"
                  value={form.food_allowance}
                  onChange={handleChange}
                />
              </div>

              {/* bank_name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bank Name
                </label>
                <input
                  name="bank_name"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Bank Name"
                  value={form.bank_name}
                  onChange={handleChange}
                />
              </div>

              {/* bank_account_no */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bank Account Number
                </label>
                <input
                  name="bank_account_no"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Bank Account Number"
                  value={form.bank_account_no}
                  onChange={handleChange}
                />
              </div>
              {/* account_type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Account Type
                </label>
                <input
                  name="account_type"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Account Type"
                  value={form.account_type}
                  onChange={handleChange}
                />
              </div>

              {/* Is Active */}
              {/* <div className="col-span-3 mt-4">
                <label className="flex items-center gap-2 p-2 border border-gray-300 rounded w-fit">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium">Active Employee</span>
                </label>
              </div> */}
            </div>
          )}

          {/* SALARY TAB */}
          {activeTab === "salary" && (
            <div className="grid grid-cols-3 gap-4">
              {/* Effective Date */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Effective Date
                </label>
                <input
                  type="date"
                  name="effective_date"
                  value={form.effective_date}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              {/* Salary Policy */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Salary Policy
                </label>
                <input
                  name="salary_policy"
                  value={form.salary_policy}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="Salary Policy"
                />
              </div>
              {/* Late Deduction */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Late Deduction
                </label>
                <select
                  name="late_deduction"
                  value={form.late_deduction}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="Late Deduction">
                  <option value="">Yes</option>
                  <option value="">No</option>
                </select>
              </div>
              {/* Tin Number */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tin Number
                </label>
                <input
                  name="tin_number"
                  value={form.tin_number}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="Tin Number"
                />
              </div>
              {/* Gross Salary */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Gross Salary
                </label>
                <input
                  name="gross_salary"
                  value={form.gross_salary}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="Gross Salary"
                />
              </div>

              {/* Basic Salary */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Basic Salary
                </label>
                <input
                  name="basic_salary"
                  value={form.basic_salary}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="Basic Salary"
                />
              </div>

              {/* House Rent */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  House Rent
                </label>
                <input
                  name="house_rent"
                  value={form.house_rent}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="House Rent"
                />
              </div>

              {/* Medical Allowance */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Medical Allowance
                </label>
                <input
                  name="medical_allowance"
                  value={form.medical_allowance}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="Medical Allowance"
                />
              </div>

              {/* Mobile Allowance */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mobile Allowance
                </label>
                <input
                  name="mobile_allowance"
                  value={form.mobile_allowance}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="Mobile Allowance"
                />
              </div>

              {/* Transport Allowance */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Transport Allowance
                </label>
                <input
                  name="transport_allowance"
                  value={form.transport_allowance}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="Transport Allowance"
                />
              </div>

              {/* Conveyance Allowance */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Conveyance Allowance
                </label>
                <input
                  name="conveyance_allowance"
                  value={form.conveyance_allowance}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="Conveyance Allowance"
                />
              </div>

              {/* Other Allowances */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Other Allowances
                </label>
                <input
                  name="other_allowances"
                  value={form.other_allowances}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="Other Allowances"
                />
              </div>

              {/* Attendance Bonus */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Attendance Bonus
                </label>
                <input
                  name="attendance_bonus"
                  value={form.attendance_bonus}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="Attendance Bonus"
                />
              </div>

              {/* Tax deduction */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tax deduction
                </label>
                <input
                  name="tax_deduction"
                  value={form.tax_deduction}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="Tax deduction"
                />
              </div>

              {/* insurance deduction */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Insurance deduction
                </label>
                <input
                  name="insurance_deduction"
                  value={form.insurance_deduction}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="Insurance deduction"
                />
              </div>

              {/* stamp deduction */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Stamp deduction
                </label>
                <input
                  name="stamp_deduction"
                  value={form.stamp_deduction}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="Stamp deduction"
                />
              </div>

              {/* Other deductions */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Other deductions
                </label>
                <input
                  name="other_deductions"
                  value={form.other_deductions}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="Other deductions"
                />
              </div>
            </div>
          )}

          {/* Leave Info*/}
          {activeTab === "leave info" && (
            <div className="grid grid-cols-3 gap-4">
              {/* Leave Effective Date */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Leave Effective
                </label>
                <input
                  type="date"
                  name="leave_effective"
                  value={form.leave_effective}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              {/* Casual Leave */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Casual Leave
                </label>
                <input
                  name="casual_leave"
                  value={form.casual_leave}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="Casual Leave"
                />
              </div>
              {/* Sick Leave */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Sick Leave
                </label>
                <input
                  name="sick_leave"
                  value={form.sick_leave}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="Sick Leave"
                />
              </div>
              {/* Earned Leave */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Earned Leave
                </label>
                <input
                  name="earned_leave"
                  value={form.earned_leave}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="Earned Leave"
                />
              </div>
              {/* Maternity Leave */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Maternity Leave
                </label>
                <input
                  name="maternity_leave"
                  value={form.maternity_leave}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="Maternity Leave"
                />
              </div>

              {/* Paternity Leave */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Paternity Leave
                </label>
                <input
                  name="paternity_leave"
                  value={form.paternity_leave}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder=" Paternity Leave"
                />
              </div>

              {/* Funeral Leave */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Funeral Leave
                </label>
                <input
                  name="funeral_leave"
                  value={form.funeral_leave}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="Funeral Leave"
                />
              </div>

              {/* Compensatory Leave */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Compensatory Leave
                </label>
                <input
                  name="compensatory_leave"
                  value={form.compensatory_leave}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="Compensatory Leave"
                />
              </div>

              {/* Unpaid Leave */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Unpaid Leave
                </label>
                <input
                  name="unpaid_leave"
                  value={form.unpaid_leave}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  placeholder="Unpaid Leave"
                />
              </div>
            </div>
          )}

          {/* JOB EXPERIENCE TAB */}
          {activeTab === "job experience" && (
            <div className="space-y-6">
              {jobExperiences.map((exp, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 p-4 relative"
                >
                  {/* --- Buttons --- */}
                  {/* Remove button (only hide for first when only one item exists) */}
                  {jobExperiences.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeJobExperience(index)}
                      className="absolute top-2 right-12 bg-red-500 text-white px-2 rounded"
                    >
                      -
                    </button>
                  )}

                  {/* Add Button (only for last item) */}
                  {index === jobExperiences.length - 1 && (
                    <button
                      type="button"
                      onClick={addJobExperience}
                      className="absolute top-2 right-2 bg-green-500 text-white px-2 rounded"
                    >
                      +
                    </button>
                  )}

                  {/* --- Fields --- */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Company Name
                    </label>
                    <input
                      name="job_company_name"
                      value={exp.job_company_name}
                      onChange={(e) => handleJobChange(index, e)}
                      className="border p-2 rounded w-full"
                      placeholder="Company Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Department
                    </label>
                    <input
                      name="job_department"
                      value={exp.job_department}
                      onChange={(e) => handleJobChange(index, e)}
                      className="border p-2 rounded w-full"
                      placeholder="Department"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Designation
                    </label>
                    <input
                      name="job_designation"
                      value={exp.job_designation}
                      onChange={(e) => handleJobChange(index, e)}
                      className="border p-2 rounded w-full"
                      placeholder="Designation"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="job_start_date"
                      value={exp.job_start_date}
                      onChange={(e) => handleJobChange(index, e)}
                      className="border p-2 rounded w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="job_end_date"
                      value={exp.job_end_date}
                      onChange={(e) => handleJobChange(index, e)}
                      className="border p-2 rounded w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Reason for Leaving
                    </label>
                    <input
                      name="leave_reason"
                      value={exp.leave_reason}
                      onChange={(e) => handleJobChange(index, e)}
                      className="border p-2 rounded w-full"
                      placeholder="Reason for Leaving"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EDUCATION TAB */}
          {activeTab === "education" && (
            <div className="space-y-6">
              {educations.map((edu, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 p-4 relative"
                >
                  {/* REMOVE button (shown only if more than 1 education) */}
                  {educations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="absolute top-2 right-12 bg-red-500 text-white px-2 rounded"
                    >
                      -
                    </button>
                  )}

                  {/* ADD button only on last block */}
                  {index === educations.length - 1 && (
                    <button
                      type="button"
                      onClick={addEducation}
                      className="absolute top-2 right-2 bg-green-500 text-white px-2 rounded"
                    >
                      +
                    </button>
                  )}

                  {/* --- Fields --- */}

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Degree Title
                    </label>
                    <input
                      name="degree_title"
                      value={edu.degree_title}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="border p-2 rounded w-full"
                      placeholder="Degree Title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Major Subject
                    </label>
                    <input
                      name="major_subject"
                      value={edu.major_subject}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="border p-2 rounded w-full"
                      placeholder="Major Subject"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Institute Name
                    </label>
                    <input
                      name="institute_name"
                      value={edu.institute_name}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="border p-2 rounded w-full"
                      placeholder="Institute Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Passing Year
                    </label>
                    <input
                      name="passing_year"
                      value={edu.passing_year}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="border p-2 rounded w-full"
                      placeholder="Passing Year"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Education Board
                    </label>
                    <input
                      name="education_board"
                      value={edu.education_board}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="border p-2 rounded w-full"
                      placeholder="Education Board"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Result
                    </label>
                    <input
                      name="result"
                      value={edu.result}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="border p-2 rounded w-full"
                      placeholder="Result"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Training Tab */}
          {activeTab === "training" && (
            <div className="space-y-6">
              {training.map((edu, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 p-4 relative"
                >
                  {/* REMOVE button (shown only if more than 1 training) */}
                  {training.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTraining(index)}
                      className="absolute top-2 right-12 bg-red-500 text-white px-2 rounded"
                    >
                      -
                    </button>
                  )}

                  {/* ADD button only on last block */}
                  {index === training.length - 1 && (
                    <button
                      type="button"
                      onClick={addTraining}
                      className="absolute top-2 right-2 bg-green-500 text-white px-2 rounded"
                    >
                      +
                    </button>
                  )}

                  {/* --- Fields --- */}

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Training Name
                    </label>
                    <input
                      name="training_name"
                      value={edu.training_name}
                      onChange={(e) => handleTrainingChange(index, e)}
                      className="border p-2 rounded w-full"
                      placeholder="Training Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Institute
                    </label>
                    <input
                      name="training_institute"
                      value={edu.training_institute}
                      onChange={(e) => handleTrainingChange(index, e)}
                      className="border p-2 rounded w-full"
                      placeholder="Institute"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Institute Address
                    </label>
                    <input
                      name="institute_address"
                      value={edu.institute_address}
                      onChange={(e) => handleTrainingChange(index, e)}
                      className="border p-2 rounded w-full"
                      placeholder="Institute Address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Training Duration
                    </label>
                    <input
                      name="training_duration"
                      value={edu.training_duration}
                      onChange={(e) => handleTrainingChange(index, e)}
                      className="border p-2 rounded w-full"
                      placeholder="Training Duration"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Result
                    </label>
                    <input
                      name="training_result"
                      value={edu.training_result}
                      onChange={(e) => handleTrainingChange(index, e)}
                      className="border p-2 rounded w-full"
                      placeholder="Result"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Remarks
                    </label>
                    <input
                      name="remarks"
                      value={edu.remarks}
                      onChange={(e) => handleTrainingChange(index, e)}
                      className="border p-2 rounded w-full"
                      placeholder="Remarks"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DOCUMENTS TAB */}
          {activeTab === "documents" && (
            <div className="grid grid-cols-2 max-w-[70%] gap-4">
              {/* Employee NID */}
              <div className="">
                <label className="block text-sm font-medium mb-1">
                  Employee NID
                </label>
                <input
                  name="emp_id"
                  value={form.emp_id}
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Employee NID"
                  onChange={handleChange}
                />
              </div>
              {/* NID Image */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  NID (PDF, JPEG, PNG)
                </label>
                <input
                  type="file"
                  name="emp_id_docs"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="border border-gray-300 p-2 rounded w-full"
                  onChange={handleFileChange}
                />
                {form.documents && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ File selected: {form.documents.name}
                  </p>
                )}
              </div>

              {/* Employee Birth Certificate */}
              <div className="">
                <label className="block text-sm font-medium mb-1">
                  Employee Bith Certificate
                </label>
                <input
                  name="emp_birthcertificate"
                  value={form.emp_birthcertificate}
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Emp BC"
                  onChange={handleChange}
                />
              </div>
              {/* Birth Certificate */}
              <div className="">
                <label className="block text-sm font-medium mb-1">
                  Birth Certificate (PDF, JPEG, PNG)
                </label>
                <input
                  type="file"
                  name="emp_birthcertificate_docs"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="border border-gray-300 p-2 rounded w-full"
                  onChange={handleFileChange}
                />
                {form.documents && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ File selected: {form.documents.name}
                  </p>
                )}
              </div>

              {/*Nominee NID */}
              <div className="">
                <label className="block text-sm font-medium mb-1">
                  Nominee NID
                </label>
                <input
                  name="nominee_id"
                  value={form.nominee_id}
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Nominee NID"
                  onChange={handleChange}
                />
              </div>
              {/* NID Image */}
              <div className="">
                <label className="block text-sm font-medium mb-1">
                  Nominee NID (PDF, JPEG, PNG)
                </label>
                <input
                  type="file"
                  name="nominee_id_docs"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="border border-gray-300 p-2 rounded w-full"
                  onChange={handleFileChange}
                />
                {form.documents && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ File selected: {form.documents.name}
                  </p>
                )}
              </div>

              {/*Job Certificate */}
              <div className="">
                <label className="block text-sm font-medium mb-1">
                  Job Certificate
                </label>
                <input
                  name="job_exp_certificate"
                  value={form.job_exp_certificate}
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Job Certificate"
                  onChange={handleChange}
                />
              </div>
              {/* Job Certificate */}
              <div className="">
                <label className="block text-sm font-medium mb-1">
                  Job Certificate (PDF, JPEG, PNG)
                </label>
                <input
                  type="file"
                  name="job_exp_certificate_docs"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="border border-gray-300 p-2 rounded w-full"
                  onChange={handleFileChange}
                />
                {form.documents && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ File selected: {form.documents.name}
                  </p>
                )}
              </div>

              {/*Education Certificate */}
              <div className="">
                <label className="block text-sm font-medium mb-1">
                  Education Certificate
                </label>
                <input
                  name="education_certificate"
                  value={form.education_certificate}
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Education Certificate"
                  onChange={handleChange}
                />
              </div>
              {/* Education Certificate */}
              <div className="">
                <label className="block text-sm font-medium mb-1">
                  Certificate (PDF, JPEG, PNG)
                </label>
                <input
                  type="file"
                  name="education_certificate_docs"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="border border-gray-300 p-2 rounded w-full"
                  onChange={handleFileChange}
                />
                {form.documents && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ File selected: {form.documents.name}
                  </p>
                )}
              </div>

              {/*Training Certificate */}
              <div className="">
                <label className="block text-sm font-medium mb-1">
                  Training Certificate
                </label>
                <input
                  name="training_certificate"
                  value={form.training_certificate}
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Training Certificate"
                  onChange={handleChange}
                />
              </div>
              {/* Training Certificate */}
              <div className="">
                <label className="block text-sm font-medium mb-1">
                  Certificate (PDF, JPEG, PNG)
                </label>
                <input
                  type="file"
                  name="training_certificate_docs"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="border border-gray-300 p-2 rounded w-full"
                  onChange={handleFileChange}
                />
                {form.documents && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ File selected: {form.documents.name}
                  </p>
                )}
              </div>

              {/* Others Documents */}
              <div className="space-y-4 w-full">
                <label className="block text-sm font-medium">
                  Other Documents
                </label>

                {otherDocs.map((doc, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    {/* Document Name */}
                    <div className="w-1/2">
                      <input
                        type="text"
                        name="others_docs"
                        placeholder="Document name"
                        className="border border-gray-300 p-2 rounded w-full"
                        value={doc.title}
                        onChange={(e) =>
                          handleOtherDocChange(index, "title", e.target.value)
                        }
                      />
                    </div>

                    {/* File Upload */}
                    <div className="w-1/2">
                      <input
                        type="file"
                        name="others_docs_file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="border border-gray-300 p-2 rounded w-full"
                        onChange={(e) =>
                          handleOtherDocChange(index, "file", e.target.files[0])
                        }
                      />

                      {doc.file && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ {doc.file.name}
                        </p>
                      )}
                    </div>

                    {/* Remove Button */}
                    {otherDocs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOtherDoc(index)}
                        className="text-red-600 text-sm px-2"
                      >
                        ❌
                      </button>
                    )}
                  </div>
                ))}

                {/* Add Button */}
                <button
                  type="button"
                  onClick={addOtherDoc}
                  className="text-blue-600 text-sm font-medium"
                >
                  ➕ Add another document
                </button>
              </div>
            </div>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <div>
              {activeTab !== "employee" && (
                <button
                  type="button"
                  onClick={prevTab}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  ← Previous
                </button>
              )}
            </div>

            <div className="flex gap-2">
              {activeTab !== "documents" ? (
                <button
                  type="button"
                  onClick={nextTab}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Next →
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={prevTab}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    ← Previous
                  </button>
                  <button
                    type="submit"
                    disabled={!form.code || codeError || isLoadingCode}
                    className={`px-6 py-2 rounded ${
                      !form.code || codeError || isLoadingCode
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    Save Employee
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeCreate;
