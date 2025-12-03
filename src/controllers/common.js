import sql from "mssql";
import config from "../config/db.js"; // note the .js extension

export const getStates = async (req, res) => {
    try {
        let pool = await sql.connect(config);

        const query = `
      SELECT *
      FROM [samvad_np].[dbo].[StateMaster]
    `;
 
        let result = await pool.request().query(query);
        return res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset,
        });

    } catch (error) {
        console.error("Error fetching States list:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching States",
        });
    }
}
export const getDistricts = async (req, res) => {
    try {
        let pool = await sql.connect(config);

        const query = `
        select * from [dbo].[DistrictMaster]
    `;
 
        let result = await pool.request().query(query);
        console.log("result data", result)
        return res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset,
        });

    } catch (error) {
        console.error("Error fetching District list:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching Distric data",
        });
    }
}
