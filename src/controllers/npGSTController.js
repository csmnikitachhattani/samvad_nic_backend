import sql from "mssql";
import config from "../config/db.js";

// --------------------------------------
// GET GST DETAILS
// --------------------------------------
export const getGstDetails = async (req, res) => {
  console.log("Backend: GET GST Details");

  try {
    const pool = await sql.connect(config);

    const { user_id } = req.params;

    const result = await pool
      .request()
      .input("user_id", sql.VarChar(5), user_id)
      .input("action", sql.VarChar(10), "get")
      .output("returnval", sql.Int)
      .execute("NP_GSTDetail_CRUD");

    const returnValue = result.output.returnval;

    if (returnValue === -1) {
      return res.status(400).json({
        success: false,
        message: "Invalid user_id",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.recordset[0] || {},
    });
  } catch (err) {
    console.error("Error: GET GST Details", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};


// --------------------------------------
// CHECK GST EXISTS
// --------------------------------------
export const checkGstExists = async (req, res) => {
  console.log("Backend: CHECK GST Exists");

  try {
    const pool = await sql.connect(config);

    const { user_id } = req.params;

    const result = await pool
      .request()
      .input("user_id", sql.VarChar(5), user_id)
      .input("action", sql.VarChar(10), "is_gst_exists")
      .output("returnval", sql.Int)
      .execute("NP_GSTDetail_CRUD");

    const returnValue = result.output.returnval;

    if (returnValue === -1) {
      return res.status(400).json({
        success: false,
        message: "Invalid user_id",
      });
    }

    return res.status(200).json({
      success: true,
      exists: result.recordset[0]?.is_gst_exists === "Y",
    });
  } catch (err) {
    console.error("Error: CHECK GST Exists", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};


// --------------------------------------
// UPDATE GST DETAILS
// --------------------------------------
export const updateGstDetails = async (req, res) => {
  console.log("Backend: UPDATE GST Details");

  try {
    const pool = await sql.connect(config);

    const {
      user_id,
      GST_legalName,
      GST_number,
      GST_StateID,
      GST_StateText,
      GST_DateOfRegistration,
      GST_TaxpayerType,
      ip_address,
      by_user_id,
      by_user_name,
    } = req.body;

    const result = await pool
      .request()
      .input("user_id", sql.VarChar(5), user_id)
      .input("GST_legalName", sql.NVarChar(100), GST_legalName)
      .input("GST_number", sql.VarChar(15), GST_number)
      .input("GST_StateID", sql.VarChar(10), GST_StateID)
      .input("GST_StateText", sql.NVarChar(50), GST_StateText)
      .input("GST_DateOfRegistration", sql.Date, GST_DateOfRegistration)
      .input("GST_TaxpayerType", sql.NVarChar(20), GST_TaxpayerType)
      .input("ip_address", sql.VarChar(14), ip_address)
      .input("by_user_id", sql.VarChar(10), by_user_id)
      .input("by_user_name", sql.NVarChar(50), by_user_name)
      .input("action", sql.VarChar(10), "update")
      .output("returnval", sql.Int)
      .execute("NP_GSTDetail_CRUD");
      console.log("ye hai result " , result)
    const returnValue = result.output.returnval;
    if (returnValue === -1) {
      return res.status(400).json({
        success: false,
        message: "Validation failed — missing required fields",
      });
    }

    return res.status(200).json({
      success: true,
      message: "GST details updated successfully",
    });
  } catch (err) {
    console.error("Error: UPDATE GST", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};
