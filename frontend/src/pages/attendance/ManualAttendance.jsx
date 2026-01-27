import { useState } from "react";
import BulkManualAttendance from "./BulkManualAttendance";
import ManualAttendanceList from "./ManualAttendanceList";

const ManualAttendance = () => {
  const [activeTab, setActiveTab] = useState("bulk");

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Manual Attendance</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto">
        <button
          onClick={() => setActiveTab("bulk")}
          className={`px-4 py-2 font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === "bulk"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Add Attendance
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === "list"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          View List
        </button>
      </div>

      {/* Bulk Attendance */}
      {activeTab === "bulk" && <BulkManualAttendance />}

      {/* Attendance List */}
      {activeTab === "list" && <ManualAttendanceList />}
    </div>
  );
};

export default ManualAttendance;
