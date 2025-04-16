import pool from "./db";
import { logDatabaseConnection } from "./db_connection_logger";

async function testConnection() {
    try {
        await pool.query("SELECT 1 + 1 AS RESULT");
        await logDatabaseConnection("Successfully connected to database.");
    } catch (error) {
        await logDatabaseConnection(`Database Connection Failed : ${error}`);
    } finally {
        await pool.end();
    }
}

testConnection();