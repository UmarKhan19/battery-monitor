const fs = require("fs");
const si = require("systeminformation");

let previousPercentage = -1; // Variable to store the previous battery percentage
const batteryData = []; // Array to store battery drainage data

// Function to format the timestamp
function formatTimestamp(timestamp) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  return timestamp.toLocaleString(undefined, options);
}

// Function to convert data to CSV format
function convertToCSV(data) {
  const headers = ["Date", "Time", "Percentage"];
  const rows = data.map((obj) => [
    formatTimestamp(obj.timestamp).split(",")[0], // Extracting date part from the formatted timestamp
    formatTimestamp(obj.timestamp).split(",")[1].trim(), // Extracting time part from the formatted timestamp
    obj.percentage,
  ]);
  const csvArray = [headers, ...rows].map((row) => row.join(","));
  return csvArray.join("\n");
}

// Function to monitor battery drainage
async function monitorBatteryDrainage() {
  while (true) {
    const currentBatteryData = await si.battery();

    // Get the current battery percentage
    const percentage = currentBatteryData.percent;

    // Check if there is a 1% drop in battery percentage
    if (percentage !== previousPercentage) {
      previousPercentage = percentage;

      const timestamp = new Date();
      batteryData.push({ timestamp, percentage });

      console.log(
        `${formatTimestamp(timestamp)}: Battery percentage: ${percentage}%`
      );
    }

    // Sleep for 1 second before checking the battery percentage again
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

// Create a file for battery drainage data
fs.writeFile("battery_drainage.csv", "", (error) => {
  if (error) {
    console.error("Error creating file:", error);
  } else {
    console.log("Battery drainage file created.");
    console.log("Monitoring battery drainage...");
    monitorBatteryDrainage();
  }
});

// Save battery data to CSV file every 10 seconds
setInterval(() => {
  const csvData = convertToCSV(batteryData);
  fs.writeFile("battery_drainage.csv", csvData, (error) => {
    if (error) {
      console.error("Error writing to file:", error);
    }
  });
}, 10000);
