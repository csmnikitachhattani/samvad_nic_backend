import sql from "mssql";
import config from "../config/db.js"; // note the .js extension


// GET Newspaper List
export const getNewspapers = async (req, res) => {
    console.log("calling this")
    try {
        let pool = await sql.connect(config);

        const query = `
      SELECT TOP (1000)
        np_cd,
        np_name,
        edition,
        type,
        language_id,
        language,
        status,
        rni_reg_no,
        bank_acount_no,
        bank_name,
        ifsc_code,
        display_order,
        who_created,
        is_eligible_for_gst,
        is_gst_verified_by_admin,
        CONTACT,
        DESN,
        NPADDR1,
        NPADDR2,
        NPADDR3,
        NPSTATE,
        NPSTATE_text,
        NPCITY,
        NPCITY_text,
        NPPOSTAL_cd,
        NPPHONE,
        YROPBAL,
        COMMPERC,
        NPNAME,
        GST_legalName,
        GST_number,
        GST_StateID,
        GST_StateText,
        GST_DateOfRegistration,
        GST_TaxpayerType,
        GST_Trade_Name,
        GST_DateOfIssue,
        State_Code,
        District_Code,
        State_Text,
        District_Text,
        entry_date,
        entry_time,
        ip_address,
        entry_by_user_id,
        entry_by_user_name,
        modify_date,
        modify_time,
        modify_ip_address,
        modify_by_user_id,
        modify_by_user_name,
        np_info
      FROM [samvad_np].[dbo].[NewsPaper]
    `;

        let result = await pool.request().query(query);
        //console.log("result data", result)
        return res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset,
        });

    } catch (error) {
        console.error("Error fetching newspaper list:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching newspaper data",
        });
    }
};

// New function: get NP user details with newspaper info
export const getNpUserWithNewspaper = async (req, res) => {
    console.log("Fetching NP user for ID:");

    try {
        const { user_id } = req.params;

        console.log("User ID received:", user_id);
        const pool = await sql.connect(config);

        const query = `
        SELECT DISTINCT 
          NPUser_Login.user_id, 
          NPUser_Login.contact_no, 
          NPUser_Login.np_cd, 
          NPUser_Login.user_name, 
          NPUser_Login.std_code, 
          NPUser_Login.landline_no,
          NPUser_Login.email_id, 
          NPUser_Login.fax_no,
          NPUser_Login.address as loginaddr, 
          NPUser_Login.status, 
          NewsPaper.District_Text,
          NewsPaper.np_name + '-' + NewsPaper.edition AS np_name, 
          NewsPaper.NPADDR1 + ',' + ISNULL(NewsPaper.NPADDR2 + ',', '') + ISNULL(NewsPaper.NPADDR3 + ',', '') +
          NewsPaper.NPCITY_text + ',' + NewsPaper.NPSTATE_text + ',' + NewsPaper.NPPOSTAL_cd AS address  
        FROM NewsPaper
        INNER JOIN NPUser_Login ON NewsPaper.np_cd = NPUser_Login.np_cd
        WHERE NewsPaper.status = 1
          AND NPUser_Login.user_id = @user_id
      `;

        const result = await pool.request()
            .input("user_id", sql.VarChar, user_id)
            .query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            data: result.recordset[0]
        });

    } catch (error) {
        console.error("Error fetching NP user with newspaper:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching NP user data",
        });
    }
};

export const getBankDetailsByUser = async (req, res) => {

    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ message: "user_id is required" });
        }
        const pool = await sql.connect(config);
        const query = `SELECT DISTINCT 
      NPUser_Login.user_id,
      state,
      district,
      bank_name,
      branch_name,
      ifsc_code,
      micr_code,
      account_no,
      account_holder_name 
      FROM NewsPaper
        INNER JOIN NPUser_Login ON NewsPaper.np_cd = NPUser_Login.np_cd
        WHERE NewsPaper.status = 1
          AND NPUser_Login.user_id = @user_id`;

        const result = await pool.request()
            .input("user_id", sql.VarChar, user_id)
            .query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            data: result.recordset[0]
        });

    } catch (error) {
        console.error("Error fetching bank details:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

export const getGSTDetailsByUser = async (req, res) => {
    console.log("called api gst oneś")
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ message: "user_id is required" });
        }
        const pool = await sql.connect(config);
        const query = `SELECT DISTINCT 
      GST_legalName, GST_number, GST_StateID, GST_StateText, GST_DateOfRegistration, 
                         GST_TaxpayerType, GST_Trade_Name, GST_DateOfIssue
      FROM NewsPaper
        INNER JOIN NPUser_Login ON NewsPaper.np_cd = NPUser_Login.np_cd
        WHERE NewsPaper.status = 1
          AND NPUser_Login.status = 1 AND NPUser_Login.user_id = @user_id`;

        const result = await pool.request()
            .input("user_id", sql.VarChar, user_id)
            .query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            data: result.recordset[0]
        });

    } catch (error) {
        console.error("Error fetching bank details:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

