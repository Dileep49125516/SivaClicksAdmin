import { ArrowUpRight } from "lucide-react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
}) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {value}
          </h2>
        </div>

        <div
          className={`rounded-xl p-3 ${color}`}
        >
          <Icon
            size={26}
            className="text-white"
          />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-green-600">
        <ArrowUpRight size={16} />

        <span>Updated just now</span>
      </div>
    </div>
  );
};

export default StatCard;