import db from "../configs/db.js";
export const getTodayLogs = async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split("T")[0];

  try {
    const [workout] = await db.query(
      "SELECT duration FROM workout_logs WHERE user_id = ? AND log_date = ?",
      [userId, today]
    );

    const [sleep] = await db.query(
      "SELECT hours FROM sleep_logs WHERE user_id = ? AND log_date = ?",
      [userId, today]
    );

    const [water] = await db.query(
      "SELECT amount FROM water_logs WHERE user_id = ? AND log_date = ?",
      [userId, today]
    );

    const [calories] = await db.query(
      "SELECT calories FROM calorie_logs WHERE user_id = ? AND log_date = ?",
      [userId, today]
    );

    res.json({
      workout: workout[0]?.duration || 0,
      sleep: sleep[0]?.hours || 0,
      water: water[0]?.amount || 0,
      calories: calories[0]?.calories || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};
