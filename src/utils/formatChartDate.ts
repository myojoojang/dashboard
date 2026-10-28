const dateFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export function formatChartDate(timestamp: number): string {
  return dateFormat.format(timestamp);
}

const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

export function formatChartTimestamp(timestamp: number): string {
  return dateTimeFormat.format(timestamp);
}
