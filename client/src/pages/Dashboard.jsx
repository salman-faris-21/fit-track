import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Activity, Droplet, Moon, Dumbbell, Plus, Mic } from "lucide-react";

import AddEntryModal from "../components/AddEntryModel";
import WeeklyChart from "../components/weeklyCharts.jsx";
import {
  fetchTodayLogs,
  fetchWeeklyLogs,
  saveLog,
} from "../store/slices/logslice.js";
import api from "../lib/api.js";

/* ---------------- STAT CARD ---------------- */

const StatCard = ({ icon: Icon, label, value, unit, onAdd }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
        <Icon size={26} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-slate-400">{label}</p>
        <p className="text-2xl font-semibold text-slate-100">
          {value} <span className="text-sm text-slate-400">{unit}</span>
        </p>
      </div>
    </div>

    <button
      onClick={onAdd}
      className="flex items-center justify-center gap-1 text-sm text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 rounded-lg py-2"
    >
      <Plus size={16} />
      Add Today
    </button>
  </div>
);

/* ---------------- DASHBOARD ---------------- */

const DashboardPage = () => {
  const dispatch = useDispatch();

  /* -------- REDUX STATE -------- */
  const user = useSelector((state) => state.auth.user);
  const { today, weekly, loading, saving } = useSelector((state) => state.logs);
  const token = useSelector((state) => state.auth.token);

  console.log("TOKEN:", token);
  /* -------- MODAL STATE -------- */
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

  /* -------- FETCH TODAY LOGS ON LOAD -------- */
  useEffect(() => {
    dispatch(fetchTodayLogs());
    dispatch(fetchWeeklyLogs());
  }, [dispatch]);

  /* -------- SAVE LOG -------- */
  const handleSubmit = async (value) => {
    await dispatch(
      saveLog({
        type: modalConfig.type,
        value,
      }),
    );

    // refresh dashboard after save
    dispatch(fetchTodayLogs());
    setModalOpen(false);
  };

  const generatePDF = async () => {
    try {
      const response = await api.post("/api/report/generate", reportData, {
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

  useEffect(() => {
    if (!token) return;

    const fetchReports = async () => {
      try {
        const { data } = await api.get("/api/report/get");
        console.log("Reports:", data);
      } catch (error) {
        console.error(error.response?.data);
      }
    };

    fetchReports();
  }, [token]);

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            Good Evening, {user?.name || "Athlete"} 👋
          </h1>
          <p className="text-slate-400 text-sm">
            Track today’s progress easily
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Dumbbell}
          label="Workout Time"
          value={today.workout}
          unit="mins"
          onAdd={() => openModal("Workout", "mins", "workout")}
        />

        <StatCard
          icon={Moon}
          label="Sleep"
          value={today.sleep}
          unit="hrs"
          onAdd={() => openModal("Sleep", "hrs", "sleep")}
        />

        <StatCard
          icon={Droplet}
          label="Water Intake"
          value={today.water}
          unit="ml"
          onAdd={() => openModal("Water Intake", "ml", "water")}
        />

        <StatCard
          icon={Activity}
          label="Calories Burned"
          value={today.calories}
          unit="kcal"
          onAdd={() => openModal("Calories", "kcal", "calories")}
        />
      </div>
      {weekly?.length > 0 && (
        <div className="mb-8">
          <WeeklyChart data={weekly} />
        </div>
      )}

      {/* AI Coach */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex justify-between items-center mt-20">
        <p className="text-slate-400">
          💡 Log today’s activity to keep your streak alive
        </p>
        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-xl text-slate-900">
          <Mic size={18} />
          Talk to AI
        </button>
      </div>

      {/* Modal */}
      <AddEntryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalConfig.title}
        unit={modalConfig.unit}
        onSubmit={handleSubmit}
        loading={saving}
      />
      <div className="mt-6 flex justify-end">
        <button
          onClick={generatePDF}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 px-6 py-2 rounded-xl font-medium"
        >
          Generate AI Fitness Report
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
