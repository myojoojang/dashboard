const numberFormat = new Intl.NumberFormat(undefined, { maximumSignificantDigits: 12 });
const compactFormat = new Intl.NumberFormat(undefined, {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function formatNumber(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) {
    return '—';
  }

  return numberFormat.format(value);
}

export function formatCompactNumber(value: number): string {
  if (Math.abs(value) < 1000) {
    return formatNumber(value);
  }

  return compactFormat.format(value);
}

export function formatPercentage(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) {
    return '—';
  }

  return `${value.toFixed(2)}%`;
}
