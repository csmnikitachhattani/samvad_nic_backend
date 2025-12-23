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
        data: fullData
      });
  
    } catch (err) {
      console.error("Error: GET RO LIST", err.message);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
};
export const rejectRO = async (req, res) => {
  try {
    const {
      advt_no,
      avak_ref_id,
      financial_year,
      remark,
      reject_status_cd,
      status_reason_cd,
      np_news_cd,
      reject_by_user_id,
      ip_address
    } = req.body;

    // 🔒 Basic validation
    if (!advt_no || !avak_ref_id || !financial_year || !reject_status_cd || !np_news_cd || !reject_by_user_id) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    const pool = await sql.connect(config);

    const result = await pool.request()
      .input("advt_no", sql.VarChar(50), advt_no)
      .input("avak_ref_id", sql.VarChar(50), avak_ref_id)
      .input("financial_year", sql.VarChar(9), financial_year)
      .input("remark", sql.NVarChar(300), remark || "")
      .input("reject_status_cd", sql.VarChar(2), '18')
      .input("status_reason_cd", sql.VarChar(2), '02')
      .input("np_news_cd", sql.Int, parseInt(np_news_cd))
      .input("reject_by_user_id", sql.VarChar(5), reject_by_user_id)
      .input("ip_address", sql.VarChar(20), ip_address || "")
      .output("returnval", sql.Int)
      .execute("A_RejectRO");

    const returnVal = result.output.returnval;

    if (returnVal === 1) {
      return res.status(200).json({
        success: true,
        message: "RO rejected successfully"
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "RO rejection failed"
      });
    }

  } catch (error) {
    console.error("Reject RO Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
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
    const financial_year = "2024-2025";
    const action_name = "Publish RO";
    const status_reason_cd = "";
    const action_by_section_cd = "NP";
    const action_taken_by = req.user?.id || "SYS01";
    const action_taken_by_type_cd = "01";
    const action_taken_by_user_id = "00020";
    const ip_address = req.ip || null;
    //const np_news_cd_list = '1-2-3-4'
  
    try {
      const pool = await sql.connect(config);
  
      const result = await pool.request()
      .input("avak_ref_id", sql.VarChar(10), avak_ref_id)
      .input("advt_no", sql.VarChar(10), advt_no)
      .input("remark", sql.VarChar(sql.MAX), remark)
      .input("np_news_cd_list", sql.VarChar(sql.MAX), np_news_cd_list)
      .input("publish_status_cd", sql.VarChar(2), '08')
      .input("action_name", sql.VarChar(50), action_name)
      .input("status_reason_cd", sql.VarChar(50), status_reason_cd)
      .input("financial_year", sql.VarChar(12), financial_year)
      .input("action_by_section_cd", sql.VarChar(3), action_by_section_cd)
      .input("action_taken_by", sql.VarChar(50), action_taken_by)
      .input("action_taken_by_type_cd", sql.VarChar(15), action_taken_by_type_cd)
      ///.input("action_taken_by_user_id", sql.VarChar(50), action_taken_by_user_id)
      .input("ip_address", sql.NVarChar(20), ip_address)
      
  
        .output("returnval", sql.Int)
        .execute("A_Publish_RO");
  
      return res.status(200).json({
        success: true,
        message: "RO Published Successfully",
        returnval: result.output.returnval,
      });
  
    } catch (err) {
      console.error("SQL ERROR:", err);
    
      res.status(500).json({
        success: false,
        message: "Server Error",
        error:
          err.originalError?.info?.message ||
          err.precedingErrors?.[0]?.message ||
          err.message
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
export const publishPrecheck = async (req, res) => {
  console.log(req.body)
  try {
    const {
      advt_no,
      financial_year,
      ro_no,
      user_id,
      np_news_cd
    } = req.body;

    // Basic validation
    if (!advt_no || !financial_year || !ro_no || !user_id || !np_news_cd) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }

   
    let pool = await sql.connect(config);


    const result = await pool.request()
      .input('advt_no', sql.VarChar(10), advt_no)
      .input('financial_year', sql.VarChar(12), financial_year)
      .input('ro_no', sql.VarChar(10), ro_no)
      .input('user_id', sql.VarChar(5), user_id)
      .input('np_news_cd', sql.Int, np_news_cd)
      .execute('dbo.A_Publish_PRECHECK');

    // Stored procedure returns a single column via SELECT 
    console.log(result)
    const response = result.recordset?.[0][""];

    res.status(200).json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Publish Precheck Error:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
export const getActionStatus = async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const query = `
      select ActionStatus.action_status_name as action_name,
             ActionStatus.action_status_cd + '/' + ActionStatus.update_field_name + '/' + ActionStatus.action_priority AS action_status_cd,
             order_no
      from ActionStatus
      where action_status_cd = '08'
      union
      select action_status_name,
             action_status_cd + '/' + update_field_name + '/' + ActionStatus.action_priority AS action_status_cd,
             order_no
      from ActionStatus
      where action_status_cd = '18'
    `;

    const result = await pool.request().query(query);

    res.status(200).json({
      success: true,
      data: result.recordset
    });
  } catch (error) {
    console.error("Error fetching action status:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
export const uploadPublishProof = async (req, res) => {
  try {
    const {
      advt_no, fin_year, ro_no, content_type,
      file_size_in_bytes, file_data, link_name,
      advt_file_path, enable_status, ip_address
    } = req.body;

    if (!advt_no || !fin_year || !ro_no || !file_data) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const pool = await sql.connect(config);

    const result = await pool.request()
      .input("advt_no", sql.VarChar(10), advt_no)
      .input("fin_year", sql.VarChar(6), fin_year)
      .input("ro_no", sql.Int, ro_no)
      .input("content_type", sql.NVarChar(100), content_type)
      .input("file_size_in_bytes", sql.Numeric(18, 0), file_size_in_bytes)
      .input("file_data", sql.VarBinary(sql.MAX), Buffer.from(file_data, "base64"))
      .input("link_name", sql.NVarChar(250), link_name)
      .input("advt_file_path", sql.NVarChar(150), advt_file_path)
      .input("enable_status", sql.NVarChar(1), enable_status || "Y")
      .input("ip_address", sql.VarChar(20), ip_address || "")
      .input("action", sql.VarChar(50), "upload_publish_proof")
      .output("returnval", sql.Int)
      .execute("NP_RO_Actions");

    return result.output.returnval === 1
      ? res.json({ success: true, message: "Proof uploaded successfully" })
      : res.status(500).json({ success: false, message: "Upload failed" });

  } catch (error) {
    console.error("Upload Proof Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProofDetail = async (req, res) => {
  try {
    const { user_id, np_cd, fin_year, advt_no, ro_no } = req.body;

    if (!user_id || !np_cd || !fin_year || !advt_no || !ro_no) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    const pool = await sql.connect(config);

    const result = await pool.request()
      .input("user_id", sql.VarChar(5), user_id)
      .input("np_cd", sql.VarChar(6), np_cd)
      .input("fin_year", sql.VarChar(6), fin_year)
      .input("advt_no", sql.VarChar(10), advt_no)
      .input("ro_no", sql.Int, parseInt(ro_no))
      .input("action", sql.VarChar(50), "get_proof_detail")
      .execute("NP_RO_Actions");

    return res.status(200).json({
      success: true,
      data: result.recordset
    });

  } catch (error) {
    console.error("Get Proof Detail Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};



