import { spawn } from "child_process";
import db from "../configs/db.js";
import path from "path";

export const getInsights = async (req, res) => {
  try {
    const [sleep] = await db.query("SELECT log_date, hours FROM sleep_logs");
    const [water] = await db.query("SELECT log_date, amount FROM water_logs");
    const [workout] = await db.query(
      "SELECT log_date, duration FROM workout_logs",
    );
    const [calories] = await db.query(
      "SELECT log_date, calories FROM calorie_logs",
    );

    const merged = {};

    const formatDate = (d) => new Date(d).toISOString().slice(0, 10);

    sleep.forEach((item) => {
      const date = formatDate(item.log_date);
      merged[date] = { date, sleep: item.hours };
    });

    water.forEach((item) => {
      const date = formatDate(item.log_date);
      if (!merged[date]) merged[date] = { date };
      merged[date].water = item.amount;
    });

    workout.forEach((item) => {
      const date = formatDate(item.log_date);
      if (!merged[date]) merged[date] = { date };
      merged[date].workout = item.duration;
    });

    calories.forEach((item) => {
      const date = formatDate(item.log_date);
      if (!merged[date]) merged[date] = { date };
      merged[date].calories = item.calories;
    });

    const finalData = Object.values(merged);

    // ✅ Handle empty case
    if (finalData.length === 0) {
      return res.json({
        avg_sleep: 0,
        avg_water: 0,
        avg_workout: 0,
        avg_calories: 0,
        insights: [],
      });
    }

    const scriptPath = path.join(process.cwd(), "analytics", "analyse.py");
    const py = spawn("python", [scriptPath]);

    let result = "";

    py.stdin.write(JSON.stringify(finalData));
    py.stdin.end();

    py.stdout.on("data", (data) => {
      result += data.toString();
    });

    py.stderr.on("data", (err) => {
      console.error("Python error:", err.toString());
    });

    py.on("close", () => {
      try {
        console.log("Python output:", result); // debug
        const parsed = JSON.parse(result);
        res.json(parsed);
      } catch (e) {
        res.status(500).json({ error: "Invalid Python response" });
      }
    });
  } catch (err) {
    console.error("Controller error:", err);
    res.status(500).json({ error: "Failed to generate insights" });
  }
};
