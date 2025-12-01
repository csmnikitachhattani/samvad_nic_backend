// controllers/npBankController.js
import sql from "mssql";
import config from "../config/db.js";

/* ============================================================
   1️⃣ GET — Fetch NP Bank Details
   ============================================================ */
export const getNpBankDetails = async (req, res) => {
  console.log("GET @ NP Bank Detail", req.params);

  try {
    const pool = await sql.connect(config);
    const {
      user_id = null,
      np_cd = null,
      action = "get",
    } = req.params;

    if (!np_cd) {
      return res.status(400).json({
        status: -1,
        message: "np_cd is required",
      });
    }

    const request = pool.request();

    // Required inputs for GET
    request.input("user_id", sql.VarChar(5), user_id);
    request.input("np_cd", sql.VarChar(6), np_cd);

    // Other optional fields always null in GET
    request.input("bank_name", sql.NVarChar(100), null);
    request.input("account_no", sql.VarChar(20), null);
    request.input("account_holder_name", sql.NVarChar(50), null);
    request.input("ifsc_code", sql.VarChar(20), null);
    request.input("micr_code", sql.VarChar(20), null);
    request.input("status", sql.VarChar(9), null);
    request.input("district", sql.NVarChar(100), null);
    request.input("state", sql.NVarChar(100), null);
    request.input("branch_name", sql.NVarChar(100), null);
    request.input("ip_address", sql.VarChar(14), null);
    request.input("by_user_id", sql.VarChar(10), null);
    request.input("by_user_name", sql.NVarChar(50), null);

    request.input("action", sql.VarChar(10), action);
    request.output("returnval", sql.Int);

    const result = await request.execute("NP_BankDetail_Main_CRUD");

    return res.status(200).json({
      status: result.output.returnval,
      data: result.recordset || [],
      message: "Bank details fetched successfully",
    });

  } catch (error) {
    console.error("GET NP Bank Detail Error:", error);
    return res.status(500).json({
      status: -1,
      error: error.message,
    });
  }
};



/* ============================================================
   2️⃣ POST / EDIT / VERIFY — Modify/Add NP Bank Details
   ============================================================ */
export const postOrEditNpBankDetails = async (req, res) => {
  console.log("POST/EDIT @ NP Bank Detail", req.body);

  try {
    const pool = await sql.connect(config);

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
      action = "post",  // post/edit/is_verified
    } = req.body;

    const request = pool.request();

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

    const result = await request.execute("NP_BankDetail_Main_CRUD");

    return res.status(200).json({
      status: result.output.returnval,
      data: result.recordset || 1,
      message:
        action === "post"
          ? "Bank details added successfully"
          : action === "edit"
          ? "Bank details updated successfully"
          : action === "is_verified"
          ? "Verification status fetched"
          : "Operation completed",
    });

  } catch (error) {
    console.error("POST/EDIT NP Bank Detail Error:", error);
    return res.status(500).json({
      status: -1,
      error: error.message,
    });
  }
};
