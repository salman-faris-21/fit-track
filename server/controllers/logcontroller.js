import db from "../configs/db.js";
export const addLog = async (req, res) => {
  const { type, value } = req.body;
  const userId = req.user.id;
  const today = new Date().toISOString().split("T")[0];

  try {
    switch (type) {
      case "workout":
        await db.query(
          `INSERT INTO workout_logs (user_id, duration, log_date)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE duration = ?`,
          [userId, value, today, value]
        );
        break;

      case "sleep":
        await db.query(
          `INSERT INTO sleep_logs (user_id, hours, log_date)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE hours = ?`,
          [userId, value, today, value]
        );
        break;

      case "water":
        await db.query(
          `INSERT INTO water_logs (user_id, amount, log_date)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE amount = amount + ?`,
          [userId, value, today, value]
        );
        break;

      case "calories":
        await db.query(
          `INSERT INTO calorie_logs (user_id, calories, log_date)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE calories = ?`,
          [userId, value, today, value]
        );
        break;

      default:
        return res.status(400).json({ message: "Invalid type" });
    }

    res.status(201).json({ message: "Log saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
