#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════
 *  Quannex POC — Unified Test Runner
 * ═══════════════════════════════════════════════════════════
 *
 *  One command, all test suites:
 *    node tests/run-all.js
 *
 *  Suites:
 *    1. phi-math.test.js       — 127 tests (PHI constants, identities, normalization)
 *    2. integration.test.mjs   — 55 tests  (real CSV → engine pipeline, all 4 companies)
 *    3. excel-parser.test.mjs  — 42 tests  (xlsx round-trip through ExcelMeasurementParser)
 *    4. smoke-test.mjs         — 77 checks (HTTP load all 13 pages, verify 122 scripts + CSS)
 *
 *  NOTE: Suite 4 (smoke test) requires a local HTTP server on port 8000:
 *    cd POC && python3 -m http.server 8000
 *  If the server isn't running, the smoke test will fail but other suites still run.
 *
 *  Exit code: 0 if all green, 1 if any suite fails.
 */

const { execSync } = require('child_process');
const path = require('path');

const SUITES = [
  { name: 'PHI Math Constants',    file: 'phi-math.test.js' },
  { name: 'Integration (Engine)',   file: 'integration.test.mjs' },
  { name: 'Excel Parser Round-Trip', file: 'excel-parser.test.mjs' },
  { name: 'Data Validator',          file: 'data-validator.test.mjs' },
  { name: 'Still-Point Proximity',  file: 'still-point.test.js' },
  { name: 'AAG Diagnostic',          file: 'aag.test.js' },
  { name: 'AvG Diagnostic',          file: 'avg.test.js' },
  { name: 'Spectral Analyzer',       file: 'spectral.test.js' },
  { name: 'Edge Analyzer (Adv)',     file: 'edge-analyzer.test.mjs' },
  { name: 'Vertex Analyzer (Adv)',   file: 'vertex-analyzer.test.mjs' },
  { name: 'Browser Smoke Test',     file: 'smoke-test.mjs', needsServer: true },
];

const testDir = __dirname;
let totalPassed = 0;
let totalFailed = 0;
const results = [];

console.log('');
console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║        QUANNEX POC — UNIFIED TEST RUNNER                 ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('');

// Check if HTTP server is running for smoke test
let serverAvailable = false;
try {
  execSync('node -e "fetch(\'http://localhost:8000\').then(()=>process.exit(0)).catch(()=>process.exit(1))"', {
    timeout: 5000, encoding: 'utf-8',
  });
  serverAvailable = true;
} catch { /* server not running */ }

for (const suite of SUITES) {
  const filePath = path.join(testDir, suite.file);
  const label = `Suite: ${suite.name} (${suite.file})`;
  console.log(`── ${label} ──`);

  // Skip server-dependent suites if no server
  if (suite.needsServer && !serverAvailable) {
    results.push({ name: suite.name, passed: 0, failed: 0, status: 'SKIP' });
    console.log(`   ⏭️  SKIPPED (no HTTP server on localhost:8000)\n`);
    continue;
  }

  try {
    const output = execSync(`node "${filePath}"`, {
      cwd: path.join(testDir, '..'),
      encoding: 'utf-8',
      timeout: 30000,
    });

    // Extract pass/fail counts from output
    // Format A: "127 passed, 0 failed"  (unit tests)
    // Format B: "77/77 checks passed, 0 failed"  (smoke test)
    const resultMatch = output.match(/(\d+)\s+passed,\s+(\d+)\s+failed/)
      || output.match(/(\d+)\/\d+\s+checks?\s+passed,\s+(\d+)\s+failed/);
    if (resultMatch) {
      const passed = parseInt(resultMatch[1], 10);
      const failed = parseInt(resultMatch[2], 10);
      totalPassed += passed;
      totalFailed += failed;
      results.push({ name: suite.name, passed, failed, status: failed === 0 ? 'PASS' : 'FAIL' });
      console.log(`   ✅ ${passed} passed, ${failed} failed\n`);
    } else {
      // No parseable result line — assume success if no error thrown
      results.push({ name: suite.name, passed: '?', failed: 0, status: 'PASS' });
      console.log(`   ✅ Completed (couldn't parse counts)\n`);
    }
  } catch (err) {
    // Suite threw an error or returned non-zero exit
    const output = (err.stdout || '') + (err.stderr || '');
    const resultMatch = output.match(/(\d+)\s+passed,\s+(\d+)\s+failed/)
      || output.match(/(\d+)\/\d+\s+checks?\s+passed,\s+(\d+)\s+failed/);
    if (resultMatch) {
      const passed = parseInt(resultMatch[1], 10);
      const failed = parseInt(resultMatch[2], 10);
      totalPassed += passed;
      totalFailed += failed;
      results.push({ name: suite.name, passed, failed, status: 'FAIL' });
      console.log(`   ❌ ${passed} passed, ${failed} failed\n`);
    } else {
      totalFailed += 1;
      results.push({ name: suite.name, passed: 0, failed: '?', status: 'FAIL' });
      console.log(`   ❌ CRASHED\n`);
      // Print last few lines of output for diagnosis
      const lines = output.trim().split('\n').slice(-5);
      lines.forEach(l => console.log(`      ${l}`));
      console.log('');
    }
  }
}

// Summary
console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║  SUMMARY                                                 ║');
console.log('╠═══════════════════════════════════════════════════════════╣');
for (const r of results) {
  const icon = r.status === 'PASS' ? '✅' : r.status === 'SKIP' ? '⏭️' : '❌';
  const line = `${icon} ${r.name}: ${r.passed} passed, ${r.failed} failed`;
  console.log(`║  ${line.padEnd(55)} ║`);
}
console.log('╠═══════════════════════════════════════════════════════════╣');
const overall = totalFailed === 0 ? '✅ ALL GREEN' : `❌ ${totalFailed} FAILURES`;
const totalLine = `${overall} — ${totalPassed} passed, ${totalFailed} failed`;
console.log(`║  ${totalLine.padEnd(55)} ║`);
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('');

process.exit(totalFailed === 0 ? 0 : 1);
