const { sql, config } = require("../db");

exports.publishROAction2 = async (req, res) => {
    try {
        const {
            avak_ref_id,
            advt_no,
            remark,
            np_news_cd_list,
            publish_status_cd,
            action_name,
            status_reason_cd,
            financial_year,
            action_by_section_cd,
            action_taken_by,
            action_taken_by_type_cd,
            ip_address
        } = req.body;

        let pool = await sql.connect(config);

        let request = pool.request();

        request.input("avak_ref_id", sql.VarChar(10), avak_ref_id);
        request.input("advt_no", sql.VarChar(10), advt_no);
        request.input("remark", sql.VarChar(sql.MAX), remark);
        request.input("np_news_cd_list", sql.VarChar(sql.MAX), np_news_cd_list);
        request.input("publish_status_cd", sql.VarChar(2), publish_status_cd);
        request.input("action_name", sql.VarChar(50), action_name);
        request.input("status_reason_cd", sql.VarChar(2), status_reason_cd);
        request.input("financial_year", sql.VarChar(12), financial_year);
        request.input("action_by_section_cd", sql.VarChar(3), action_by_section_cd);
        request.input("action_taken_by", sql.VarChar(5), action_taken_by);
        request.input("action_taken_by_type_cd", sql.VarChar(15), action_taken_by_type_cd);
        request.input("ip_address", sql.NVarChar(20), ip_address);

        request.output("returnval", sql.Int);

        const result = await request.execute("A_Publish_RO");

        return res.status(200).json({
            status: 1,
            message: "Action 2 executed successfully via stored procedure",
            procedure_output: result.output.returnval
        });

    } catch (err) {
        console.error("Procedure Error:", err);
        return res.status(500).json({
            status: -1,
            message: "Failed to execute stored procedure",
            error: err.message
        });
    }
};


exports.publishPrecheck = async (req, res) => {
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
  
      // Stored procedure returns a single column via SELECT CASE
      const response = result.recordset?.[0];
  
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