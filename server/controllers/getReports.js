import db from "../configs/db.js";

export const getReports = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `SELECT 
        id,
        goal,
        bmi,
        category,
        weight,
        height,
        created_at
       FROM reports
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId],
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      reports: rows,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
    });
  }
};
