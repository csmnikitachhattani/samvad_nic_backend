// controllers/npBankSubController.js
import sql from "mssql";
import config from "../config/db.js";

export const getNpBankSubDetails = async (req, res) => {
  console.log("Backend: GET NP Bank Sub Details");

  try {
    const pool = await sql.connect(config);

    // Extract params from query OR params
    const {
      action,        // get | get_cate | get_by_cate_id | check_exists_TAN_CST_PAN
      user_id,
      np_cd,
      Cate_cd,
      TaxNo,
      max_sno,
      ip_address,
    } = req.query;

    if (!action) {
      return res.status(400).json({
        success: false,
        message: "Action is required",
      });
    }

    // Prepare SQL request
    const request = pool.request();
    request.input("user_id", sql.VarChar(5), user_id || null);
    request.input("np_cd", sql.VarChar(6), np_cd || null);
    request.input("Cate_cd", sql.VarChar(2), Cate_cd || null);
    request.input("TaxNo", sql.VarChar(10), TaxNo || null);
    request.input("max_sno", sql.Int, max_sno || null);
    request.input("ip_address", sql.VarChar(20), ip_address || null);
    request.input("action", sql.VarChar(10), action);

    request.output("returnval", sql.Int);

    // Execute stored procedure
    const result = await request.execute("NP_BankDetail_Sub_CRUD");

    const returnVal = result.output.returnval;

    if (returnVal === -1) {
      return res.status(400).json({
        success: false,
        action,
        message: "Invalid parameters OR no data found",
      });
    }

    // For GET calls, data is in result.recordset
    return res.status(200).json({
      success: true,
      action,
      data: result.recordset || [],
    });

  } catch (error) {
    console.error("Error fetching NP Bank Sub Details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
