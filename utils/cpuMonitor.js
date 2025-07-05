const os = require("os");
const { exec } = require("child_process");

// Function to calculate CPU usage
function getCPUUsage() {
  const cpus = os.cpus();

  let idle = 0;
  let total = 0;

  cpus.forEach((core) => {
    for (const type in core.times) {
      total += core.times[type];
    }
    idle += core.times.idle;
  });

  const idlePercent = (idle / total) * 100;
  const usagePercent = 100 - idlePercent;

  return usagePercent.toFixed(2);
}

// Monitor Function
function monitorCPU() {
  setInterval(() => {
    const usage = getCPUUsage();
    console.log(`CPU Usage: ${usage}%`);

    if (usage > 70) {
      console.warn("⚠️ High CPU usage detected! Restarting the server...");

      // PM2 restart (production)
      exec("pm2 restart all", (error, stdout, stderr) => {
        if (error) {
          console.error(`Error restarting server: ${error.message}`);
          return;
        }
        console.log("Server restarted successfully by PM2");
      });
    }
  }, 5000); // check every 5 seconds
}

module.exports = monitorCPU;
