// src/controllers/noticeBoard.js
import sql from "mssql";
import config from "../config/db.js"; // default export from db.js

export const noticeBoard = async (req, res) => {
  console.log("calling this")
  try {
    const pool = await sql.connect(config);

    const query = `
      SELECT 
        Sno,
        Information,
        notice_for_user_type,
        Is_Active,
        From_date,
        To_Date,
        CONVERT(VARCHAR(10), entry_date, 103) AS entry_date
      FROM NP_Information
      WHERE Is_Active = 'Y'
        AND notice_for_user_type = 'NPUsers'
      ORDER BY Sno DESC
    `;

    const result = await pool.request().query(query);
    console.log("result", result)
    return res.status(200).json({
      success: true,
      count: result.recordset.length,
      data: result.recordset,
    });

  } catch (error) {
    console.error("Error fetching notice board:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching notice board data",
    });
  }
};
