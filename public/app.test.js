/**
 * Tests for Dog vs Cat Voting App
 * Story US-003: Vote Functionality
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
  
  // === US-003 Tests: Vote Functionality ===
  
  // Test 1: Vote button exists under each card
  test('Vote button under dog card', () => {
    assert(html.includes('dog-btn') && html.includes('onclick="vote(\'dog\')"'), 'Should have dog vote button');
  });
  
  test('Vote button under cat card', () => {
    assert(html.includes('cat-btn') && html.includes('onclick="vote(\'cat\')"'), 'Should have cat vote button');
  });
  
  // Test 2: Vote counter displays below each image
  test('Vote counter elements exist', () => {
    assert(html.includes('id="dog-votes"'), 'Should have dog votes counter element');
    assert(html.includes('id="cat-votes"'), 'Should have cat votes counter element');
    assert(html.includes('id="total-votes"'), 'Should have total votes counter element');
  });
  
  // Test 3: Vote function increments counter
  test('Vote function increments votes', () => {
    assert(js.includes('votes[type]++'), 'Should increment vote count');
    assert(js.includes('function vote(type)'), 'Should have vote function');
  });
  
  // Test 4: localStorage persistence
  test('Votes persist in localStorage', () => {
    assert(js.includes('localStorage.getItem'), 'Should read from localStorage');
    assert(js.includes('localStorage.setItem'), 'Should write to localStorage');
    assert(js.includes('STORAGE_KEY'), 'Should have storage key constant');
  });
  
  // Test 5: Load votes from localStorage on init
  test('Initial vote counts load from localStorage', () => {
    assert(js.includes('loadVotesFromStorage'), 'Should have loadVotesFromStorage function');
    assert(js.includes('loadVotesFromStorage()') && js.includes('init()'), 'Should call loadVotesFromStorage in init');
  });
  
  // Test 6: Visual feedback - button animation
  test('Button animation on vote', () => {
    assert(js.includes('animateButton') || js.includes('transform: scale(0.95)'), 'Should have button press animation');
  });
  
  // Test 7: Visual feedback - counter animation
  test('Counter animation on vote', () => {
    assert(js.includes('animateCounter'), 'Should have counter animation function');
    assert(js.includes('scale(1.3)') || js.includes('scale(1.2)'), 'Should scale counter on vote');
  });
  
  // Test 8: Vote display updates correctly
  test('Vote display updates', () => {
    assert(js.includes('updateVoteDisplay'), 'Should have updateVoteDisplay function');
    assert(js.includes('dogVotesEl.textContent') && js.includes('catVotesEl.textContent'), 'Should update vote elements');
  });
  
  // Test 9: Vote type validation
  test('Vote function validates type', () => {
    assert(js.includes("type !== 'dog'") && js.includes("type !== 'cat'"), 'Should validate vote type');
  });
  
  // Test 10: Reduced motion support
  test('Reduced motion media query exists', () => {
    assert(css.includes('prefers-reduced-motion'), 'Should support reduced motion preference');
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
