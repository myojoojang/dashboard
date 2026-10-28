const utcDateFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export function formatChartDate(timestampMs: number): string {
  return utcDateFormatter.format(timestampMs);
}

const utcDateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

export function formatChartTimestamp(timestampMs: number): string {
  return utcDateTimeFormatter.format(timestampMs);
}
