import sql from "mssql";

export const testDB = async (req, res) => {
  try {
    const result = await sql.query`SELECT GETDATE() AS currentTime`;

    res.json({
      success: true,
      message: "Database is working!",
      serverTime: result.recordset[0].currentTime
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
