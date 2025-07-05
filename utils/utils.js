exports.excelDateToJSDate = (serial) => {
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400; // seconds
  const dateInfo = new Date(utcValue * 1000);

  return dateInfo.toISOString().split("T")[0]; // returns "YYYY-MM-DD"
};
