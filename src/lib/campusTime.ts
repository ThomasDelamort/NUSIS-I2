// The campus runs on Philippine time, so "today" must not depend on the server's timezone.
const CAMPUS_TIME_ZONE = "Asia/Manila";
const CAMPUS_UTC_OFFSET = "+08:00"; // The Philippines has no daylight saving time.

/** Midnight at the start of the current campus day. */
export const startOfCampusDay = (now = new Date()): Date => {
  // en-CA formats dates as YYYY-MM-DD.
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: CAMPUS_TIME_ZONE }).format(now);
  return new Date(`${today}T00:00:00${CAMPUS_UTC_OFFSET}`);
};
