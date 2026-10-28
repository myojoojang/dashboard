import test from 'node:test';
import assert from 'node:assert/strict';
import { formatChartDate } from '../src/utils/formatChartDate';

test('chart dates stay in UTC across daylight-saving transitions', () => {
  assert.match(formatChartDate(Date.parse('2026-10-25T00:30:00Z')), /25 Oct 2026.*00:30/);
  assert.match(formatChartDate(Date.parse('2026-10-25T01:30:00Z')), /25 Oct 2026.*01:30/);
});

test('chart dates handle midnight and year rollover without shifting a day', () => {
  assert.match(formatChartDate(Date.parse('2026-12-31T23:59:00Z')), /31 Dec 2026.*23:59/);
  assert.match(formatChartDate(Date.parse('2027-01-01T00:00:00Z')), /01 Jan 2027.*00:00/);
});
