import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* Format date like "28 Dec" */
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

const WeeklyChart = ({ data }) => {
  const [visible, setVisible] = useState({
    workout: true,
    sleep: true,
    water: true,
    calories: true,
  });

  const formattedData = data.map((item) => ({
    ...item,
    date: formatDate(item.date),
  }));

  const toggleMetric = (key) => {
    setVisible((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[420px]">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">
        Weekly Fitness Trends
      </h3>

      {/* Toggles */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.keys(visible).map((key) => (
          <button
            key={key}
            onClick={() => toggleMetric(key)}
            className={`px-3 py-1 rounded-full text-sm border transition
              ${
                visible[key]
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-400/40"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          {/* Gradients */}
          <defs>
            <linearGradient id="workoutGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="sleepGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="waterGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="calorieGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f87171" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />

          {visible.workout && (
            <Line
              type="natural"
              dataKey="workout"
              stroke="#34d399"
              strokeWidth={3}
              dot={false}
              strokeDasharray="0"
              animationDuration={1200}
            />
          )}

          {visible.sleep && (
            <Line
              type="natural"
              dataKey="sleep"
              stroke="#60a5fa"
              strokeWidth={3}
              dot={false}
              animationDuration={1400}
            />
          )}

          {visible.water && (
            <Line
              type="natural"
              dataKey="water"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={false}
              animationDuration={1600}
            />
          )}

          {visible.calories && (
            <Line
              type="natural"
              dataKey="calories"
              stroke="#f87171"
              strokeWidth={3}
              dot={false}
              animationDuration={1800}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyChart;
