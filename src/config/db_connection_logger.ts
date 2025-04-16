import { appendFile } from "fs/promises";
import path from "path";

const logFile = path.resolve(__dirname, "db-connection.log");

export async function logDatabaseConnection(status: string) {
	const timestamp = new Date().toISOString();
	const logEntry = `${timestamp} - ${status}\n`;

	try {
		await appendFile(logFile, logEntry);
		console.log("Log saved:", logEntry.trim());
	} catch (err) {
		console.error("Error writing to log file:", err);
	}
}