import test from 'node:test';
import assert from 'node:assert/strict';
import { buildChartOptions } from '../src/utils/chartOptions';

test('horizontal bars put their category axis on y', () => {
  const options = buildChartOptions('horizontal-bar', false);

  assert.equal(options.indexAxis, 'y');
  assert.deepEqual(options.scales?.y, {
    ticks: {
      maxTicksLimit: 8,
      maxRotation: 0,
    },
    grid: { display: false },
  });
  assert.ok(options.scales?.x);
});

test('vertical bars and lines have category and value axes', () => {
  for (const type of ['bar', 'line'] as const) {
    const options = buildChartOptions(type, true);

    assert.equal(options.indexAxis, undefined);
    assert.ok(options.scales?.x);
    assert.ok(options.scales?.y);
    assert.equal(options.plugins?.legend?.display, true);
  }
});

test('doughnut charts do not get Cartesian axes', () => {
  const options = buildChartOptions('doughnut', false);

  assert.equal(options.scales, undefined);
  assert.equal(options.indexAxis, undefined);
  assert.equal(options.plugins?.legend?.display, false);
});
