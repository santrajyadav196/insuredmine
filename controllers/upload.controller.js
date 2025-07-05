const path = require("path");
const { Worker } = require("worker_threads");
const CustomError = require("../utils/CustomError");

exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new CustomError("No file uploaded", 400));
    }

    const filePath = path.resolve(req.file.path);
    // console.log(req.file);
    // console.log(filePath);

    const worker = new Worker("./workers/importWorker.js", {
      workerData: { filePath },
    });

    worker.on("message", (msg) => {
      res.status(200).json({ status: "success", message: msg });
    });

    worker.on("error", (err) => {
      next(new CustomError(`Worker error: ${err.message}`, 500));
    });

    worker.on("exit", (code) => {
      if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
    });
  } catch (error) {
    next(error);
  }
};
