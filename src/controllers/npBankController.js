// controllers/npBankController.js
import sql from "mssql";
import config from "../config/db.js";

export const npBankDetailHandler = async (req, res) => {
  console.log("Backend call received @ NP Bank Detail", req.method);

  try {
    const pool = await sql.connect(config);

    // If GET request → params, else POST request → body
    const src = req.method === "GET" ? req.params : req.body;

    const {
      user_id = null,
      np_cd = null,
      bank_name = null,
      account_no = null,
      account_holder_name = null,
      ifsc_code = null,
      micr_code = null,
      status = null,
      district = null,
      state = null,
      branch_name = null,
      ip_address = null,
      by_user_id = null,
      by_user_name = null,
      action = "get", // get/post/edit/is_verified
    } = src;

    if (!action) {
      return res.status(400).json({
        status: -1,
        message: "action is required",
      });
    }

    const request = pool.request();

    // Inputs used for GET / POST / EDIT
    request.input("user_id", sql.VarChar(5), user_id);
    request.input("np_cd", sql.VarChar(6), np_cd);
    request.input("bank_name", sql.NVarChar(100), bank_name);
    request.input("account_no", sql.VarChar(20), account_no);
    request.input("account_holder_name", sql.NVarChar(50), account_holder_name);
    request.input("ifsc_code", sql.VarChar(20), ifsc_code);
    request.input("micr_code", sql.VarChar(20), micr_code);
    request.input("status", sql.VarChar(9), status);
    request.input("district", sql.NVarChar(100), district);
    request.input("state", sql.NVarChar(100), state);
    request.input("branch_name", sql.NVarChar(100), branch_name);
    request.input("ip_address", sql.VarChar(14), ip_address);
    request.input("by_user_id", sql.VarChar(10), by_user_id);
    request.input("by_user_name", sql.NVarChar(50), by_user_name);

    request.input("action", sql.VarChar(10), action);
    request.output("returnval", sql.Int);
    console.log("yahaan tk pohoche h hum", np_cd, action)
    // Execute your stored procedure
    const result = await request.execute("NP_BankDetail_Main_CRUD");
    console.log("ye hai result " , result)
    return res.status(200).json({
      status: result.output.returnval,
      data: result.recordset || [],
      message:
        action === "get"
          ? "Bank details fetched successfully"
          : action === "post"
          ? "Bank details added successfully"
          : action === "edit"
          ? "Bank details updated successfully"
          : action === "is_verified"
          ? "Verification status fetched"
          : "Operation completed",
    });
  } catch (error) {
    console.error("NP Bank Detail API Error:", error);

    return res.status(500).json({
      status: -1,
      error: error.message,
    });
  }
};
