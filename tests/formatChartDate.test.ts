import test from 'node:test';
import assert from 'node:assert/strict';
import { formatChartDate, formatChartTimestamp } from '../src/utils/formatChartDate';

test('chart dates stay in UTC across daylight-saving transitions', () => {
  assert.equal(formatChartDate(Date.parse('2026-10-25T00:30:00Z')), '25 Oct 2026');
  assert.equal(formatChartDate(Date.parse('2026-10-25T01:30:00Z')), '25 Oct 2026');
});

test('chart dates handle midnight and year rollover without shifting a day', () => {
  assert.equal(formatChartDate(Date.parse('2026-12-31T23:59:00Z')), '31 Dec 2026');
  assert.equal(formatChartDate(Date.parse('2027-01-01T00:00:00Z')), '01 Jan 2027');
});

test('tooltips retain UTC time while the same coordinate has a date-only axis label', () => {
  const timestamp = Date.parse('2026-10-28T14:30:00Z');

  assert.equal(formatChartDate(timestamp), '28 Oct 2026');
  assert.equal(formatChartTimestamp(timestamp), '28 Oct 2026, 14:30');
});
