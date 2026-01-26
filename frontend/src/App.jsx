import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

// AUTH
import Login from "./pages/auth/Login";

// Dashboard
import Dashboard from "./pages/Dashboard.jsx";
import HRAnalytics from "./pages/dashboard/HRAnalytics";

// Employees
import EmployeeList from "./pages/employees/EmployeeList.jsx";
import EmployeeCreate from "./pages/employees/EmployeeCreate.jsx";

// Attendance
import AttendanceList from "./pages/attendance/AttendanceList.jsx";
import ManualAttendance from "./pages/attendance/ManualAttendance.jsx";
import BulkUpload from "./pages/attendance/BulkUpload.jsx";
import JobCard from "./pages/attendance/JobCard.jsx";
import OTHistory from "./pages/attendance/OTHistory.jsx";

// Leave
import ApplyLeave from "./pages/leaves/ApplyLeave";
import LeaveBalances from "./pages/leaves/LeaveBalances";
import LeaveHistory from "./pages/leaves/LeaveHistory";
import LeaveApproval from "./pages/leaves/LeaveApproval";
import LeaveEncash from "./pages/leaves/LeaveEncash";

// Payroll
import SalaryPolicy from "./pages/salary-payroll/SalaryPolicy";
import GenerateSalary from "./pages/salary-payroll/GenerateSalary";
import SalarySheet from "./pages/salary-payroll/SalarySheet";
import Payslip from "./pages/salary-payroll/Payslip";

// PF
import PFSettings from "./pages/pf/PFSettings";
import GeneratePF from "./pages/pf/GeneratePF";
import PFContributionList from "./pages/pf/PFContributionList";
import PFWithdrawal from "./pages/pf/PFWithdrawal";
import PFDashboard from "./pages/pf/PFDashboard";

// Loans
import LoanType from "./pages/loan/LoanType";
import LoanRequest from "./pages/loan/LoanRequest";
import LoanApproval from "./pages/loan/LoanApproval";
import LoanDisbursement from "./pages/loan/LoanDisbursement";
import LoanDashboard from "./pages/loan/LoanDashboard";

// Recruitment
import RequisitionList from "./pages/recruitment/RequisitionList";
import RequisitionCreate from "./pages/recruitment/RequisitionCreate";
import CandidateApply from "./pages/recruitment/CandidateApply";
import CandidateList from "./pages/recruitment/CandidateList";
import InterviewSchedule from "./pages/recruitment/InterviewSchedule";
import OfferCreate from "./pages/recruitment/OfferCreate";

// Organization
import OrgEntryForm from "./pages/organization/OrgEntryForm.jsx";
import CompanyEntry from "./pages/organization/CompanyEntry.jsx";
import UnitEntry from "./pages/organization/UnitEntry.jsx";
import DivisionEntry from "./pages/organization/DivisionEntry.jsx";
import DepartmentEntry from "./pages/organization/DepartmentEntry.jsx";
import SectionEntry from "./pages/organization/SectionEntry.jsx";
import SubsectionEntry from "./pages/organization/SubsectionEntry.jsx";
import FloorEntry from "./pages/organization/FloorEntry.jsx";
import LineEntry from "./pages/organization/LineEntry.jsx";
import TableEntry from "./pages/organization/TableEntry.jsx";
import EmployeeCategory from "./pages/other-settings/EmployeeCategory.jsx";

// Other Settings
import OT_Eligibility from "./pages/other-settings/OT_Eligibility.jsx";

// Designation
import DesignationEntry from "./pages/organization/DesignationEntry.jsx";
import Grade from "./pages/organization/Grade.jsx";

function App() {
  return (
    <Routes>
      {/* ---------------------------------- */}
      {/* PUBLIC ROUTE (No Sidebar, No Auth) */}
      {/* ---------------------------------- */}
      <Route path="/login" element={<Login />} />

      {/* Redirect root → dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* ---------------------------------- */}
      {/* PROTECTED ROUTES (Require Token) */}
      {/* Everything else uses DashboardLayout */}
      {/* ---------------------------------- */}
      <Route element={<DashboardLayout />}>
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/hr" element={<HRAnalytics />} />

        {/* Employees */}
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/employees/new" element={<EmployeeCreate />} />
        <Route path="/employees/:id/edit" element={<EmployeeCreate />} />

        {/* Attendance */}
        <Route path="/attendance" element={<AttendanceList />} />
        <Route path="/attendance/manual" element={<ManualAttendance />} />
        <Route path="/attendance/bulk" element={<BulkUpload />} />
        <Route path="/attendance/jobcard" element={<JobCard />} />
        <Route path="/attendance/ot" element={<OTHistory />} />

        {/* Leaves */}
        <Route path="/leave/apply" element={<ApplyLeave />} />
        <Route path="/leave/balance" element={<LeaveBalances />} />
        <Route path="/leave/history" element={<LeaveHistory />} />
        <Route path="/leave/approval" element={<LeaveApproval />} />
        <Route path="/leave/encash" element={<LeaveEncash />} />

        {/* Payroll */}
        <Route path="/payroll/salary-policy" element={<SalaryPolicy />} />
        <Route path="/payroll/generate" element={<GenerateSalary />} />
        <Route path="/payroll/salary-sheet" element={<SalarySheet />} />
        <Route path="/payroll/payslip" element={<Payslip />} />

        {/* PF */}
        <Route path="/pf/dashboard" element={<PFDashboard />} />
        <Route path="/pf/settings" element={<PFSettings />} />
        <Route path="/pf/generate" element={<GeneratePF />} />
        <Route path="/pf/contributions" element={<PFContributionList />} />
        <Route path="/pf/withdrawal" element={<PFWithdrawal />} />

        {/* Loans */}
        <Route path="/loan/types" element={<LoanType />} />
        <Route path="/loan/request" element={<LoanRequest />} />
        <Route path="/loan/approval" element={<LoanApproval />} />
        <Route path="/loan/disbursement" element={<LoanDisbursement />} />
        <Route path="/loan/dashboard" element={<LoanDashboard />} />

        {/* Recruitment */}
        <Route path="/recruit/requisitions" element={<RequisitionList />} />
        <Route
          path="/recruit/requisitions/new"
          element={<RequisitionCreate />}
        />
        <Route path="/recruit/apply" element={<CandidateApply />} />
        <Route path="/recruit/candidates" element={<CandidateList />} />
        <Route path="/recruit/interviews" element={<InterviewSchedule />} />
        <Route path="/recruit/offers" element={<OfferCreate />} />

        {/* Organization */}
        <Route path="/org-entry" element={<OrgEntryForm />} />
        <Route path="/settings/company" element={<CompanyEntry />} />
        <Route path="/settings/unit" element={<UnitEntry />} />
        <Route path="/settings/division" element={<DivisionEntry />} />
        <Route path="/settings/department" element={<DepartmentEntry />} />
        <Route path="/settings/section" element={<SectionEntry />} />
        <Route path="/settings/subsection" element={<SubsectionEntry />} />
        <Route path="/settings/floor" element={<FloorEntry />} />
        <Route path="/settings/line" element={<LineEntry />} />
        <Route path="/settings/table" element={<TableEntry />} />
        <Route
          path="/settings/employee-categories"
          element={<EmployeeCategory />}
        />
        {/* Other Settings */}
        <Route
          path="/settings/ot-eligibility"
          element={<OT_Eligibility />}
        />

        {/* Designation */}
        <Route path="/settings/designations" element={<DesignationEntry />} />
        <Route path="/settings/grades" element={<Grade />} />
      </Route>
    </Routes>
  );
}

export default App;
