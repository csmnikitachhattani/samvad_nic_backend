// controllers/npProfileController.js
import sql from "mssql";
import config from "../config/db.js";

export const npProfileHandler = async (req, res) => {
  console.log("Backend call received @ NP Profile");

  try {
    const pool = await sql.connect(config);

    const {
      user_id,
      user_name = null,
      email_id = null,
      landline_no = null,
      std_code = null,
      fax_no = null,
      address = null,
      contact_no = null,
      NPADDR1 = null,
      NPADDR2 = null,
      NPSTATE = null,
      NPSTATE_text = null,
      NPCITY = null,
      NPCITY_Text = null,
      NPPOSTAL_cd = null,
      ip_address = null,
      by_user_id = null,
      by_user_name = null,
      action,
    } = req.body;

    const request = pool.request();

    request.input("user_id", sql.VarChar(6), user_id);
    request.input("user_name", sql.NVarChar(50), user_name);
    request.input("email_id", sql.NVarChar(50), email_id);
    request.input("landline_no", sql.VarChar(10), landline_no);
    request.input("std_code", sql.VarChar(5), std_code);
    request.input("fax_no", sql.VarChar(15), fax_no);
    request.input("address", sql.NVarChar(300), address);
    request.input("contact_no", sql.VarChar(10), contact_no);
    request.input("NPADDR1", sql.NVarChar(100), NPADDR1);
    request.input("NPADDR2", sql.NVarChar(50), NPADDR2);
    request.input("NPSTATE", sql.NVarChar(10), NPSTATE);
    request.input("NPSTATE_text", sql.VarChar(50), NPSTATE_text);
    request.input("NPCITY", sql.NVarChar(10), NPCITY);
    request.input("NPCITY_Text", sql.VarChar(50), NPCITY_Text);
    request.input("NPPOSTAL_cd", sql.NVarChar(10), NPPOSTAL_cd);
    request.input("ip_address", sql.VarChar(14), ip_address);
    request.input("by_user_id", sql.VarChar(10), by_user_id);
    request.input("by_user_name", sql.NVarChar(50), by_user_name);
    request.input("action", sql.VarChar(10), action);
    request.output("returnval", sql.Int);

    const result = await request.execute("NP_Profile_CRUD");

    return res.status(200).json({
      status: result.output.returnval,
      data: result.recordset || [],
      message:
        action === "get"
          ? "User profile fetched successfully"
          : "User profile updated successfully",
    });
  } catch (error) {
    console.error("NP Profile API error:", error);

    return res.status(500).json({
      status: -1,
      error: error.message,
    });
  }
};
