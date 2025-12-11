import CardStat from "../components/CardStat.jsx";

const Dashboard = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <CardStat title="Total Employees" value={320} subtext="Active" />
        <CardStat title="Today Present" value={295} />
        <CardStat title="Today Absent" value={25} />
        <CardStat title="Pending Leave Requests" value={7} />
      </div>
    </div>
  );
};

export default Dashboard;
