export const formatDateTime = (isoString) => {
  if (!isoString) return "—";

  const date = new Date(isoString);
  return date.toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Converts a timestamp in seconds into a date and time string.
export const getDateAndDayFromTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);

  const formattedDate = date.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${formattedDate}`;
};

// Converts a timestamp in seconds into a date string.
export const getDateFromTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);

  const formattedDate = date.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return `${formattedDate}`;
};

// Converts a timestamp in seconds into a time string.
export const getTimeFromTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);

  const formattedTime = date.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  //    second: "2-digit",
  return `${formattedTime}`;
};

// Calculates the difference in hours and minutes between two given timestamps.
export const calculateHoursDifference = (startTimestamp, endTimestamp) => {
  if (!startTimestamp || !endTimestamp) return null;

  const start = new Date(startTimestamp * 1000);
  const end = new Date(endTimestamp * 1000);

  const diffInMilliseconds = end - start;

  // Calculate hours and minutes
  const totalMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Ensure two-digit format for hours and minutes
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
};

// Formats a decimal hour into a time string in the format "HH:mm".
export function formatTimeDecimal(decimalHours) {
  const hours = Math.floor(decimalHours); // Parte entera: horas
  const minutes = Math.round((decimalHours - hours) * 60); // Parte decimal: minutos
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`; // Formato HH:MM
}

export function formatSecondsToHHMMSS(seconds) {
  if (!seconds || isNaN(seconds)) return "00:00:00";

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [String(hrs).padStart(2, "0"), String(mins).padStart(2, "0"), String(secs).padStart(2, "0")].join(":");
}