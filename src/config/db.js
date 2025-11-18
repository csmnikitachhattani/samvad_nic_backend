import sql from "mssql";
const config = {
  user: "nikita_chhattani",
  password: "Nikita@8",
  server: "CSMBHUL1506\\SQLEXPRESS",
  database: "samvad_np",
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

export const connectDB = async () => {
  try {
    const pool = await sql.connect(config);
    console.log("SQL Server connected successfully");
    return pool;
  } catch (err) {
    console.error("Database Connection Failed:", err);
  }
};


export default config;
