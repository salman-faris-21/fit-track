import db from "../configs/db.js";

export const getWeeklyLogs = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT d.date,
        COALESCE(w.duration, 0) AS workout,
        COALESCE(s.hours, 0)    AS sleep,
        COALESCE(wa.amount, 0)  AS water,
        COALESCE(c.calories, 0) AS calories
      FROM (
        SELECT CURDATE() - INTERVAL n DAY AS date
        FROM (
          SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2
          UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
        ) days
      ) d
      LEFT JOIN workout_logs w 
        ON w.user_id = ? AND w.log_date = d.date
      LEFT JOIN sleep_logs s   
        ON s.user_id = ? AND s.log_date = d.date
      LEFT JOIN water_logs wa  
        ON wa.user_id = ? AND wa.log_date = d.date
      LEFT JOIN calorie_logs c 
        ON c.user_id = ? AND c.log_date = d.date
      ORDER BY d.date ASC
      `,
      [userId, userId, userId, userId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch weekly logs" });
  }
};
