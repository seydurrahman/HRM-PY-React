const CardStat = ({ title, value, subtext }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="text-xs font-medium text-slate-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {subtext && (
        <div className="mt-1 text-xs text-slate-400">{subtext}</div>
      )}
    </div>
  );
};

export default CardStat;
