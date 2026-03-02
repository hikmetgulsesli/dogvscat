/**
 * Tests for Dog vs Cat Card Display UI
 * Story US-002
 */

const fs = require('fs');
const path = require('path');

// Test suite
function runTests() {
  const tests = [];
  
  function test(name, fn) {
    try {
      fn();
      tests.push({ name, passed: true });
    } catch (e) {
      tests.push({ name, passed: false, error: e.message });
    }
  }
  
  function assert(condition, message) {
    if (!condition) throw new Error(message || 'Assertion failed');
  }
  
  const publicDir = __dirname;
  const css = fs.readFileSync(path.join(publicDir, 'style.css'), 'utf8');
  const html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
  const js = fs.readFileSync(path.join(publicDir, 'app.js'), 'utf8');
  
  // Test 1: Two cards displayed side by side on desktop
  test('Cards use grid layout with two columns', () => {
    assert(css.includes('grid-template-columns: 1fr 1fr'), 'Should have 2-column grid');
  });
  
  // Test 2: Cards stack vertically on mobile
  test('Cards stack on mobile (max-width: 640px)', () => {
    assert(css.includes('@media (max-width: 640px)'), 'Should have mobile breakpoint');
    assert(css.match(/640px[\s\S]*?grid-template-columns:\s*1fr/), 'Should stack to 1 column on mobile');
  });
  
  // Test 3: Dog image loads from Dog CEO API
  test('Dog image fetches from Dog CEO API', () => {
    assert(js.includes('dog.ceo/api/breeds/image/random'), 'Should use Dog CEO API');
  });
  
  // Test 4: Cat image loads from Cataas API
  test('Cat image fetches from Cataas API', () => {
    assert(js.includes('cataas.com/cat'), 'Should use Cataas API');
  });
  
  // Test 5: Loading spinner exists
  test('Loading spinner/skeleton exists', () => {
    assert(html.includes('spinner'), 'Should have spinner element');
    assert(html.includes('dog-spinner') && html.includes('cat-spinner'), 'Should have spinners for both cards');
  });
  
  // Test 6: Images have proper aspect ratio
  test('Images have 4:3 aspect ratio', () => {
    assert(css.includes('aspect-ratio: 4 / 3') || css.includes('aspect-ratio: 4/3'), 'Should have 4:3 aspect ratio');
  });
  
  // Test 7: Design tokens are applied
  test('Design tokens from Stitch are used', () => {
    assert(css.includes('--font-heading'), 'Should use heading font variable');
    assert(css.includes('--font-body'), 'Should use body font variable');
    assert(css.includes('Sora'), 'Should use Sora font');
    assert(css.includes('Nunito Sans'), 'Should use Nunito Sans font');
  });
  
  // Test 8: Responsive layout
  test('Layout is responsive', () => {
    assert(css.includes('@media') && css.includes('max-width'), 'Should have responsive breakpoints');
  });
  
  // Print results
  console.log('\n=== Test Results ===\n');
  let passed = 0;
  let failed = 0;
  
  tests.forEach(t => {
    if (t.passed) {
      console.log('✓', t.name);
      passed++;
    } else {
      console.log('✗', t.name);
      console.log('  Error:', t.error);
      failed++;
    }
  });
  
  console.log(`\n${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
