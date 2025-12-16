import sql from "mssql";
import config from "../config/db.js";


export const getROList = async (req, res) => {
    console.log("Backend: GET RO List", req.query);
  
    try {
      const pool = await sql.connect(config);
  
      const {
        user_id,
        fin_year,
        np_cd
      } = req.query;
  
      const page = parseInt(req.query.page || "1", 10);
      const limit = parseInt(req.query.limit || "20", 10);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
  
      const result = await pool
        .request()
        .input("user_id", sql.VarChar(5), '00020')
        .input("fin_year", sql.VarChar(9), '2024-2025')
        .input("np_cd", sql.VarChar(6), '000019')
        .input("action", sql.VarChar(10), "get")
        .output("returnval", sql.Int)
        .execute("NP_ROList");
  
      const returnValue = result.output.returnval;
  
      if (returnValue === -1) {
        return res.status(400).json({
          success: false,
          message: "Invalid input parameters",
        });
      }
  
      const fullData = result.recordset;
      const paginated = fullData.slice(startIndex, endIndex);
  
      return res.status(200).json({
        success: true,
        total: fullData.length,
        page,
        limit,
        data: paginated
      });
  
    } catch (err) {
      console.error("Error: GET RO LIST", err.message);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
};
  

export const publishRO = async (req, res) => {
    console.log("Minimal Publish RO request:", req.body);
  
    const { 
      avak_ref_id, 
      advt_no, 
      np_news_cd_list, 
      publish_status_cd,
      remark = "" 
    } = req.body;
  
    // Validate minimum inputs
    if (!avak_ref_id || !advt_no || !publish_status_cd) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (avak_ref_id, advt_no, publish_status_cd)",
      });
    }
  
    // Auto-generate missing fields
    const financial_year = "2024-2025";   // or calculate dynamically
    const action_name = "Publish RO";
    const status_reason_cd = "01";
    const action_by_section_cd = "NP";
    const action_taken_by = req.user?.id || "SYS01"; 
    const action_taken_by_type_cd = "USER";
    const ip_address = req.ip;
  
    try {
      const pool = await sql.connect(config);
  
      const result = await pool.request()
        .input("avak_ref_id", sql.VarChar(10), avak_ref_id)
        .input("advt_no", sql.VarChar(10), advt_no)
        .input("remark", sql.VarChar(sql.MAX), remark)
        .input("np_news_cd_list", sql.VarChar(sql.MAX), np_news_cd_list)
        .input("publish_status_cd", sql.VarChar(2), publish_status_cd)
  
        // auto-filled
        .input("action_name", sql.VarChar(50), action_name)
        .input("status_reason_cd", sql.VarChar(2), status_reason_cd)
        .input("financial_year", sql.VarChar(12), financial_year)
        .input("action_by_section_cd", sql.VarChar(3), action_by_section_cd)
        .input("action_taken_by", sql.VarChar(5), action_taken_by)
        .input("action_taken_by_type_cd", sql.VarChar(15), action_taken_by_type_cd)
        .input("ip_address", sql.NVarChar(20), ip_address)
  
        .output("returnval", sql.Int)
        .execute("A_Publish_RO");
  
      return res.status(200).json({
        success: true,
        message: "RO Published Successfully",
        returnval: result.output.returnval,
      });
  
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: err.message,
      });
    }
};

export const getRODetail = async (req, res) => {
  try {
    const { financial_year, avak_ref_id, advt_no } = req.query;

    if (!financial_year || !avak_ref_id || !advt_no) {
      return res.status(400).json({
        status: false,
        message: "financial_year, avak_ref_id and advt_no are required",
      });
    }

    let pool = await sql.connect(config);

    const query = `
      SELECT TOP 1
          financial_year,
          advt_no,
          current_status,
          publish_status,
          action_name,
          update_date = action_date,
          update_time = action_time
      FROM AdvtCurrentStatus
      WHERE 
          financial_year = @financial_year
          AND advt_no = @advt_no
    `;

    const result = await pool
      .request()
      .input("financial_year", sql.VarChar, financial_year)
      .input("advt_no", sql.VarChar, advt_no)
      .query(query);

    return res.status(200).json({
      status: true,
      data: result.recordset[0] || null,
    });

  } catch (error) {
    console.error("Error fetching single RO detail:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
  
  
  