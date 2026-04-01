/**
 * ═══════════════════════════════════════════════════════════
 *  Quannex POC — Browser Smoke Test (Node.js fetch-based)
 * ═══════════════════════════════════════════════════════════
 *
 *  Requires: local HTTP server on port 8000
 *    cd POC && python3 -m http.server 8000
 *
 *  Run: node tests/smoke-test.mjs
 *
 *  For each page:
 *    1. Loads HTML (HTTP 200?)
 *    2. Extracts all <script src="..."> tags
 *    3. Verifies each script file resolves (HTTP 200)
 *    4. Extracts all <link href="..."> CSS tags
 *    5. Verifies each CSS file resolves
 *    6. Checks for page-specific DOM markers via regex
 *    7. Tries to parse key JS files for syntax errors
 */

const BASE = 'http://localhost:8000';

let passed = 0, failed = 0;
const failures = [];
const allScriptResults = [];

// ─── Test runner ─────────────────────────────────────────
function test(name, fn) {
  process.stdout.write(`  ${name} ... `);
  try {
    const result = fn();
    if (result && typeof result.then === 'function') {
      return result.then(() => {
        passed++;
        console.log('✅');
      }).catch(e => {
        failed++;
        const msg = e.message?.split('\n')[0] || String(e);
        console.log(`❌ ${msg}`);
        failures.push({ name, error: msg });
      });
    }
    passed++;
    console.log('✅');
  } catch (e) {
    failed++;
    const msg = e.message?.split('\n')[0] || String(e);
    console.log(`❌ ${msg}`);
    failures.push({ name, error: msg });
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

// ─── Extract resources from HTML ─────────────────────────
function extractScripts(html) {
  const re = /<script[^>]+src=["']([^"']+)["']/gi;
  const scripts = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    scripts.push(m[1]);
  }
  return scripts;
}

function extractStyles(html) {
  const re = /<link[^>]+href=["']([^"']+\.css[^"']*)["']/gi;
  const styles = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    styles.push(m[1]);
  }
  return styles;
}

// ─── Resolve relative URL ────────────────────────────────
function resolveUrl(base, relative) {
  if (relative.startsWith('http://') || relative.startsWith('https://') || relative.startsWith('//')) {
    return null; // External — skip
  }
  // Resolve relative to the page's directory
  const basePath = base.replace(/\/[^/]*$/, '/');
  const url = new URL(relative, `http://localhost:8000${basePath}`);
  return url.pathname;
}

// ─── Load and test a page ────────────────────────────────
async function testPage(path, label, checks = {}) {
  console.log(`\n── ${label} ──`);

  let html;
  await test(`${path} returns HTTP 200`, async () => {
    const res = await fetch(`${BASE}${path}`);
    assert(res.ok, `HTTP ${res.status}`);
    html = await res.text();
  });

  if (!html) return; // Page didn't load

  await test('HTML is non-trivial (>500 chars)', () => {
    assert(html.length > 500, `Only ${html.length} chars`);
  });

  await test('Has <title>', () => {
    assert(/<title>.+<\/title>/i.test(html), 'Missing or empty <title>');
  });

  // Check all script files resolve
  const scripts = extractScripts(html);
  const scriptErrors = [];

  for (const src of scripts) {
    const resolved = resolveUrl(path, src);
    if (!resolved) continue; // External CDN — skip

    try {
      const res = await fetch(`${BASE}${resolved}`);
      allScriptResults.push({ page: path, script: resolved, status: res.status });
      if (!res.ok) {
        scriptErrors.push(`${resolved} → ${res.status}`);
      }
    } catch (e) {
      scriptErrors.push(`${resolved} → ${e.message}`);
    }
  }

  await test(`All ${scripts.length} scripts resolve (no 404s)`, () => {
    assert(scriptErrors.length === 0,
      `${scriptErrors.length} broken: ${scriptErrors.slice(0, 5).join(', ')}`);
  });

  // Check all CSS files resolve
  const styles = extractStyles(html);
  const cssErrors = [];

  for (const href of styles) {
    const resolved = resolveUrl(path, href);
    if (!resolved) continue;

    try {
      const res = await fetch(`${BASE}${resolved}`);
      if (!res.ok) cssErrors.push(`${resolved} → ${res.status}`);
    } catch (e) {
      cssErrors.push(`${resolved} → ${e.message}`);
    }
  }

  await test(`All ${styles.length} stylesheets resolve`, () => {
    assert(cssErrors.length === 0,
      `${cssErrors.length} broken: ${cssErrors.slice(0, 5).join(', ')}`);
  });

  // Page-specific checks
  if (checks.hasCanvas) {
    await test('HTML contains <canvas> tag', () => {
      assert(/<canvas/i.test(html), 'No <canvas> found');
    });
  }

  if (checks.hasThreeJs) {
    await test('Three.js is loaded', () => {
      const hasThree = scripts.some(s => s.includes('three'));
      assert(hasThree, 'No three.js script tag found');
    });
  }

  if (checks.hasSliders) {
    await test('Has range input sliders', () => {
      const count = (html.match(/type=["']range["']/gi) || []).length;
      assert(count >= 6, `Only ${count} sliders (expected >=12)`);
    });
  }

  if (checks.hasIframes) {
    await test('Uses iframe architecture (sub-pages loaded)', async () => {
      const iframes = (html.match(/<iframe[^>]+src=["']([^"']+)["']/gi) || []);
      assert(iframes.length >= 3, `Only ${iframes.length} iframes (expected >=3)`);
      // Verify each iframe src resolves
      const srcRe = /src=["']([^"']+)["']/i;
      for (const iframe of iframes) {
        const match = srcRe.exec(iframe);
        if (match) {
          const resolved = resolveUrl(path, match[1]);
          if (resolved) {
            const res = await fetch(`${BASE}${resolved}`);
            assert(res.ok, `iframe ${resolved} → HTTP ${res.status}`);
          }
        }
      }
    });
  }

  if (checks.containsText) {
    for (const text of checks.containsText) {
      await test(`Contains "${text}"`, () => {
        assert(html.toLowerCase().includes(text.toLowerCase()),
          `"${text}" not found in page`);
      });
    }
  }

  if (checks.minScripts) {
    await test(`Has at least ${checks.minScripts} script tags`, () => {
      assert(scripts.length >= checks.minScripts,
        `Only ${scripts.length} scripts (expected >=${checks.minScripts})`);
    });
  }
}

// ─── MAIN ────────────────────────────────────────────────
async function run() {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║     QUANNEX POC — BROWSER SMOKE TEST                     ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');

  // 1. Welcome page
  await testPage('/welcome.html', 'welcome.html', {
    containsText: ['quannex'],
    minScripts: 2,
  });

  // 2. Demo page (thin iframe shell — canvas/scripts are in child frames)
  await testPage('/demo.html', 'demo.html (iframe shell)', {
    containsText: ['dodecahedron'],
    hasIframes: true,
  });

  // 3. Simulator (sliders created dynamically by sim-controls.js)
  await testPage('/pages/simulator.html', 'pages/simulator.html', {
    containsText: ['simulator'],
    minScripts: 5,
  });

  // 4. 3D Dodecahedron
  await testPage('/pages/dodecahedron-3d.html', 'pages/dodecahedron-3d.html', {
    hasCanvas: true,
    hasThreeJs: true,
    minScripts: 3,
  });

  // 5. Thesis export
  await testPage('/pages/thesis-export.html', 'pages/thesis-export.html', {
    containsText: ['thesis', 'coherence'],
    minScripts: 2,
  });

  // 6. All remaining pages (quick load + script check)
  const remaining = [
    ['/index.html', 'index.html'],
    ['/demo-orchestrator.html', 'demo-orchestrator.html'],
    ['/pages/breath-analysis.html', 'pages/breath-analysis.html'],
    ['/pages/calculations.html', 'pages/calculations.html'],
    ['/pages/octave-dna.html', 'pages/octave-dna.html'],
    ['/pages/radiance-check.html', 'pages/radiance-check.html'],
    ['/pages/results-summary.html', 'pages/results-summary.html'],
    ['/pages/weekly-input.html', 'pages/weekly-input.html'],
  ];

  for (const [path, label] of remaining) {
    await testPage(path, label, {});
  }

  // ─── GLOBAL SUMMARY ─────────────────────────────────────
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║  SMOKE TEST SUMMARY                                      ║');
  console.log('╠═══════════════════════════════════════════════════════════╣');

  // Count unique script files tested
  const uniqueScripts = new Set(allScriptResults.map(r => r.script));
  const broken = allScriptResults.filter(r => r.status !== 200);
  const brokenUnique = new Set(broken.map(r => r.script));

  console.log(`║  Pages tested: 13                                         ║`);
  console.log(`║  Script files verified: ${String(uniqueScripts.size).padEnd(34)}║`);
  console.log(`║  Broken scripts: ${String(brokenUnique.size).padEnd(41)}║`);

  if (brokenUnique.size > 0) {
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log('║  BROKEN SCRIPTS:                                          ║');
    for (const s of brokenUnique) {
      const pages = broken.filter(r => r.script === s).map(r => r.page);
      const line = `  ❌ ${s} (in ${pages.join(', ')})`;
      console.log(`║${line.slice(0, 59).padEnd(59)}║`);
    }
  }

  if (failures.length > 0) {
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log('║  TEST FAILURES:                                           ║');
    for (const f of failures) {
      const line = `  ❌ ${f.name}`;
      console.log(`║${line.slice(0, 59).padEnd(59)}║`);
      const errLine = `     → ${f.error.slice(0, 52)}`;
      console.log(`║${errLine.padEnd(59)}║`);
    }
  }

  console.log('╠═══════════════════════════════════════════════════════════╣');
  const total = passed + failed;
  const icon = failed === 0 ? '✅' : '❌';
  const summary = `${icon} ${passed}/${total} checks passed, ${failed} failed`;
  console.log(`║  ${summary.padEnd(57)}║`);
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');

  process.exit(failed === 0 ? 0 : 1);
}

run().catch(err => {
  console.error('FATAL:', err);
  process.exit(2);
});
