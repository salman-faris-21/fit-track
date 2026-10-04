import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Activity, Droplet, Moon, Dumbbell, Plus, Mic } from "lucide-react";

import AddEntryModal from "../components/AddEntryModel";
import WeeklyChart from "../components/weeklyCharts.jsx";
import {
  fetchTodayLogs,
  fetchWeeklyLogs,
  saveLog,
} from "../store/slices/logslice.js";
import api from "../lib/api.js";

/* ---------------- KPI CARD ---------------- */
const GradientCard = ({ title, value, unit, color }) => (
  <div className={`p-5 rounded-xl bg-gradient-to-br ${color}`}>
    <p className="text-sm text-white/80">{title}</p>
    <h2 className="text-2xl font-bold mt-2">
      {value} <span className="text-sm">{unit}</span>
    </h2>
  </div>
);

const DashboardPage = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const { today, weekly, saving } = useSelector((state) => state.logs);
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    unit: "",
    type: "",
  });

  const openModal = (title, unit, type) => {
    setModalConfig({ title, unit, type });
    setModalOpen(true);
  };

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    dispatch(fetchTodayLogs());
    dispatch(fetchWeeklyLogs());
  }, [dispatch]);

  const reportData = {
    name: user?.name,
    height: 170, // replace later with real user profile
    weight: 70, // replace later with real user profile
    goal: "Weight Loss",
    workoutPlan: "30 min cardio + strength training",
    dietPlan: "High protein, reduce sugar",
    waterIntake: "3 Litres",
    sleepRecommendation: "7-8 hours",
    notes: "Stay consistent and track daily progress.",
  };

  const generatePDF = async () => {
    try {
      const response = await api.post("/report/generate", reportData, {
        responseType: "blob", // IMPORTANT for PDF
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const a = document.createElement("a");
      a.href = url;
      a.download = "fittrack-report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("PDF Error:", error.response?.data || error.message);
      alert("Failed to generate report");
    }
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get("/insights");
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnalytics();
  }, []);

  /* ---------------- SAVE ---------------- */
  const handleSubmit = async (value) => {
    await dispatch(saveLog({ type: modalConfig.type, value }));
    dispatch(fetchTodayLogs());
    dispatch(fetchWeeklyLogs());
    setModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#0b0f1a] text-white">
      {/* SIDEBAR */}
      <div className="w-64 bg-[#111827] p-6 flex flex-col justify-between">
        <div className="flex flex-col gap-8">
          <h1 className="text-xl font-bold">FitTrack</h1>

          <nav className="flex flex-col gap-3">
            <button className="bg-purple-600 px-4 py-2 rounded-lg w-full text-left font-medium">
              Dashboard
            </button>
            <button
              onClick={() => navigate("/generate-program")}
              className="text-slate-400 hover:text-white px-4 py-2 rounded-lg w-full text-left font-medium transition"
            >
              AI Voice Coach
            </button>
            <button
              onClick={() => navigate("/rag")}
              className="text-slate-400 hover:text-white px-4 py-2 rounded-lg w-full text-left font-medium transition"
            >
              RAG Chatbot
            </button>
            <button
              onClick={generatePDF}
              className="text-slate-400 hover:text-white px-4 py-2 rounded-lg w-full text-left font-medium transition"
            >
              Reports (PDF)
            </button>
          </nav>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Dashboard — {user?.name || "Athlete"}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Track, analyze, and improve your fitness daily
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={generatePDF}
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition"
            >
              Generate AI Fitness Report
            </button>
            <button
              onClick={() => navigate("/rag")}
              className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition"
            >
              Open RAG Bot
            </button>
          </div>
        </div>

        {/* KPI CARDS */}
        {analytics && (
          <div className="grid grid-cols-4 gap-4">
            <GradientCard
              title="Sleep"
              value={analytics.avg_sleep}
              unit="hrs"
              color="from-blue-500 to-cyan-500"
            />
            <GradientCard
              title="Water"
              value={analytics.avg_water}
              unit="ml"
              color="from-teal-500 to-emerald-500"
            />
            <GradientCard
              title="Workout"
              value={analytics.avg_workout}
              unit="min"
              color="from-purple-500 to-indigo-600"
            />
            <GradientCard
              title="Fitness Score"
              value={analytics.fitness_score}
              unit=""
              color="from-pink-500 to-red-500"
            />
          </div>
        )}

        {/* 🔥 TODAY LOGGING SECTION */}
        <div className="bg-[#111827] p-5 rounded-xl border border-white/10">
          {/* HEADER + CTA */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Today’s Log</h2>
              <p className="text-xs text-slate-400">
                Start by logging today’s activity
              </p>
            </div>

            <button
              onClick={() => openModal("Workout", "min", "workout")}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm"
            >
              <Plus size={16} />
              Add Entry
            </button>
          </div>

          {/* INPUT CARDS */}
          <div className="grid grid-cols-4 gap-4">
            <button
              onClick={() => openModal("Workout", "min", "workout")}
              className="bg-[#0b0f1a] p-4 rounded-xl hover:bg-white/5 transition"
            >
              <Dumbbell className="mb-2 text-purple-400" />
              <p className="text-xs text-slate-400">Workout</p>
              <h3 className="text-lg font-semibold">
                {today?.workout || 0} min
              </h3>
            </button>

            <button
              onClick={() => openModal("Sleep", "hrs", "sleep")}
              className="bg-[#0b0f1a] p-4 rounded-xl hover:bg-white/5 transition"
            >
              <Moon className="mb-2 text-blue-400" />
              <p className="text-xs text-slate-400">Sleep</p>
              <h3 className="text-lg font-semibold">{today?.sleep || 0} hrs</h3>
            </button>

            <button
              onClick={() => openModal("Water", "ml", "water")}
              className="bg-[#0b0f1a] p-4 rounded-xl hover:bg-white/5 transition"
            >
              <Droplet className="mb-2 text-cyan-400" />
              <p className="text-xs text-slate-400">Water</p>
              <h3 className="text-lg font-semibold">{today?.water || 0} ml</h3>
            </button>

            <button
              onClick={() => openModal("Calories", "kcal", "calories")}
              className="bg-[#0b0f1a] p-4 rounded-xl hover:bg-white/5 transition"
            >
              <Activity className="mb-2 text-orange-400" />
              <p className="text-xs text-slate-400">Calories</p>
              <h3 className="text-lg font-semibold">
                {today?.calories || 0} kcal
              </h3>
            </button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-3 gap-6">
          {/* CHART */}
          <div className="col-span-2 bg-[#111827] p-5 rounded-xl">
            <h3 className="mb-3 text-lg">Weekly Trends</h3>
            {weekly?.length > 0 && <WeeklyChart data={weekly} />}
          </div>

          {/* INSIGHTS */}
          <div className="bg-[#111827] p-5 rounded-xl">
            <h3 className="mb-3 text-lg">Insights</h3>

            {analytics?.insights?.map((item, i) => (
              <p key={i} className="text-sm text-slate-300 mb-2">
                • {item}
              </p>
            ))}
          </div>
        </div>

        {/* EXTRA PANELS */}
        {analytics && (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-[#111827] p-4 rounded-xl">
              <h4>Consistency</h4>
              <p className="text-slate-400 mt-2">{analytics.consistency}</p>
            </div>

            <div className="bg-[#111827] p-4 rounded-xl">
              <h4>Fitness Score</h4>
              <p className="text-emerald-400 text-xl">
                {analytics.fitness_score}
              </p>
            </div>

            <div className="bg-[#111827] p-4 rounded-xl">
              <h4>Recommendation</h4>
              <p className="text-slate-400 text-sm">
                Improve hydration & consistency
              </p>
            </div>
          </div>
        )}

        {/* AI VOICE COACH BANNER */}
        <div className="bg-[#111827] border border-white/10 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Mic size={24} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Interactive AI Voice Coach</h3>
              <p className="text-sm text-slate-400">
                Log today's activity and start a voice conversation to discuss your progress and get direct feedback.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/generate-program")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg text-sm font-semibold transition shrink-0"
          >
            Talk to AI Coach 🎙️
          </button>
        </div>
      </div>

      {/* MODAL */}
      <AddEntryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalConfig.title}
        unit={modalConfig.unit}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
};

export default DashboardPage;
