const { workerData, parentPort } = require("worker_threads");
require("dotenv").config();
const connectDB = require("../config/db");
const importService = require("../services/dataImport.service");

(async () => {
  try {
    await connectDB();

    // ✅ Call your separate service
    await importService.processExcel(workerData.filePath);

    parentPort.postMessage("Data Imported Successfully!");
    process.exit(0);
  } catch (error) {
    parentPort.postMessage(`Error: ${error.message}`);
    process.exit(1);
  }
})();
