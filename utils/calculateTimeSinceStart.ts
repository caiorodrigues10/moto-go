export function calculateTimeSinceStart(startTime: Date) {
  const startDate = new Date(startTime).getTime();

  const now = new Date().getTime();

  const differenceMs = now - startDate;

  const oneDayMs = 1000 * 60 * 60 * 24;
  const oneHourMs = 1000 * 60 * 60;
  const oneMinuteMs = 1000 * 60;

  const days = Math.floor(differenceMs / oneDayMs);
  const hours = Math.floor((differenceMs % oneDayMs) / oneHourMs);
  const minutes = Math.floor((differenceMs % oneHourMs) / oneMinuteMs);

  return {
    days: days,
    hours: hours,
    minutes: minutes,
  };
}
