const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const core = require('../public/works-core.js');
const {validate, loadCatalog, renderCard, generate} = require('../scripts/works.cjs');
const data = loadCatalog();
const projection = work => ({category: work.category, search: [work.title, work.summary, ...work.features].join(' ')});
const select = state => data.works.filter(work => core.matches(projection(work), state));

test('verified inventory includes all eight distinct works and retains access boundaries', () => {
  assert.equal(data.works.length, 8);
  assert.deepEqual(['game', 'tool', 'learning'].map(category => select({category}).length), [5, 2, 1]);
  assert.equal(data.works.filter(work => work.access === 'public').length, 7);
  assert.equal(data.works.find(work => work.id === 'agent-journey').access, 'restricted');
});
test('empty, whitespace and single-character searches have deterministic results', () => {
  assert.equal(select({query: ''}).length, 8);
  assert.equal(select({query: '   '}).length, 8);
  assert.deepEqual(select({query: '雾'}).map(work => work.id), ['mistbound-letters']);
  assert.equal(core.hasFilters({category: 'all', query: '  '}), false);
});
test('case-insensitive and full-width search combines with categories and finds feature tags', () => {
  assert.deepEqual(select({category: 'game', query: ' ｙＯｕＲｗＡｒ '}).map(work => work.id), ['yourwar']);
  assert.deepEqual(select({category: 'tool', query: '费用'}).map(work => work.id), ['roommate-housekeeper']);
  assert.equal(select({category: 'learning', query: '费用'}).length, 0);
  assert.equal(select({category: 'unknown'}).length, 0);
  assert.equal(core.normalizeQuery('a'.repeat(121)).length, 120);
});
test('filtering never changes canonical data or silently includes private content', () => {
  const before = JSON.stringify(data);
  select({category: 'tool', query: 'AI'});
  assert.equal(JSON.stringify(data), before);
  const privateField = structuredClone(data);
  privateField.works[0].privateNotes = 'not for publication';
  assert.throws(() => validate(privateField), /Unexpected fields/);
});
test('invalid, duplicate and credential-bearing links fail catalog validation', () => {
  for (const url of ['http://example.com', 'javascript:alert(1)', 'https://user:pass@example.com', 'https://example.com/?token=secret']) {
    const bad = structuredClone(data); bad.works[0].url = url;
    assert.throws(() => validate(bad));
  }
  const duplicate = structuredClone(data); duplicate.works[1].url = duplicate.works[0].url;
  assert.throws(() => validate(duplicate), /Duplicate work URL/);
  duplicate.works[1] = structuredClone(duplicate.works[0]);
  assert.throws(() => validate(duplicate), /duplicate work id/);
  assert.throws(() => validate({...data, works: []}), /cannot be empty/);
});
test('cover paths, concepts and restricted learning state cannot be silently weakened', () => {
  const invalid = structuredClone(data); invalid.works[0].cover.src = '../secret.webp';
  assert.throws(() => validate(invalid));
  invalid.works[0] = structuredClone(data.works[0]); invalid.works[0].cover.alt = 'This is a real screenshot.';
  assert.throws(() => validate(invalid), /must not imply a screenshot/);
  const open = structuredClone(data); open.works.find(work => work.id === 'agent-journey').access = 'public';
  assert.throws(() => validate(open), /access boundary/);
});
test('static cards escape source text and keep external link protections', () => {
  const work = structuredClone(data.works[0]); work.title = '<script> & "title"';
  const html = renderCard(work, 0);
  assert(!html.includes('<script>'));
  assert(html.includes('&lt;script&gt; &amp; &quot;title&quot;'));
  assert(html.includes('rel="noopener noreferrer"'));
  assert(html.includes('loading="lazy"'));
  assert(html.includes('srcset='));
});
test('committed prerender supplies all entries without JavaScript and stays in sync', () => {
  const html = generate(true);
  assert.equal((html.match(/class="work-card"/g) || []).length, 8);
  assert.equal((html.match(/class="work-card"[^>]*\bhidden\b/g) || []).length, 0);
  assert(html.includes('data-works-controls hidden'));
  for (const work of data.works) assert(html.includes(`href="${work.url}"`));
  assert(!html.includes('class="arcade-card"'));
  const ids = Array.from(html.matchAll(/\sid="([^"]+)"/g), match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'HTML ids must be unique');
  for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) assert(ids.includes(match[1]), `Missing anchor ${match[1]}`);
});
test('every catalog cover is explicitly approved for public deployment', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../public-files.json'), 'utf8'));
  for (const work of data.works) for (const key of ['src', 'small']) assert(manifest.includes(work.cover[key]), `Missing allowlist entry for ${work.id}`);
  for (const file of ['works-core.js', 'works.js']) assert(manifest.includes(file));
  assert(!manifest.some(file => file.includes('works.json') || file.includes('docs/')));
});
