const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const core = require('../public/works-core.js');
const {validate, loadCatalog, renderCard, generate} = require('../scripts/works.cjs');
const data = loadCatalog();
const projection = work => ({category: work.category, search: [work.title, work.summary, ...work.features].join(' ')});
const select = state => data.works.filter(work => core.matches(projection(work), state));

test('verified inventory includes all ten distinct works and retains both access boundaries', () => {
  assert.deepEqual(data.works.map(work => work.id).sort(), [
    'agent-journey', 'ai-collaboration', 'cloudrush-runner', 'mistbound-letters', 'moonlit-immortal',
    'pocket-arcade', 'roommate-housekeeper', 'starfall-creature-isles', 'yunque-sanguo', 'yourwar'
  ].sort());
  assert.deepEqual(['game', 'tool', 'learning'].map(category => select({category}).length), [7, 2, 1]);
  assert.equal(data.works.filter(work => work.access === 'public').length, 8);
  assert.deepEqual(data.works.filter(work => work.access === 'restricted').map(work => work.id).sort(), ['agent-journey', 'cloudrush-runner']);
});
test('empty, whitespace and single-character searches have deterministic results', () => {
  assert.equal(select({query: ''}).length, 10);
  assert.equal(select({query: '   '}).length, 10);
  assert.deepEqual(select({query: '雾'}).map(work => work.id), ['mistbound-letters']);
  assert.equal(core.hasFilters({category: 'all', query: '  '}), false);
});
test('case-insensitive and full-width search combines with categories and finds feature tags', () => {
  assert.deepEqual(select({category: 'game', query: ' ｙＯｕＲｗＡｒ '}).map(work => work.id), ['yourwar']);
  assert.deepEqual(select({category: 'tool', query: '费用'}).map(work => work.id), ['roommate-housekeeper']);
  assert.deepEqual(select({category: 'game', query: '精灵'}).map(work => work.id), ['starfall-creature-isles']);
  assert.deepEqual(select({category: 'game', query: '坐骑'}).map(work => work.id), ['cloudrush-runner']);
  assert.equal(select({category: 'tool', query: '精灵'}).length, 0);
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
test('cover paths, concepts and restricted states cannot be silently weakened', () => {
  const invalid = structuredClone(data); invalid.works[0].cover.src = '../secret.webp';
  assert.throws(() => validate(invalid));
  invalid.works[0] = structuredClone(data.works[0]); invalid.works[0].cover.alt = 'This is a real screenshot.';
  assert.throws(() => validate(invalid), /must not imply a screenshot/);
  for (const id of ['agent-journey', 'cloudrush-runner']) {
    const open = structuredClone(data); open.works.find(work => work.id === id).access = 'public';
    assert.throws(() => validate(open), /access boundary/);
  }
});
test('restricted game and learning cards disclose access requirements before their link', () => {
  for (const id of ['agent-journey', 'cloudrush-runner']) {
    const work = data.works.find(work => work.id === id);
    const card = renderCard(work, data.works.indexOf(work));
    assert(card.includes('受限访问'));
    const noticeIndex = card.indexOf('需要已有访问权限');
    const linkIndex = card.indexOf('class="work-link"');
    assert(noticeIndex >= 0 && noticeIndex < linkIndex);
    assert(card.includes('打开受限入口'));
    assert(!card.includes('开始试玩'));
    assert(card.includes(`href="${work.url}"`));
  }
});
test('arcade title and catalog copy consistently describe the verified thirteen-game edition', () => {
  const arcade = data.works.find(work => work.id === 'pocket-arcade');
  assert.equal(arcade.title, '口袋游乐场 · 十三款即玩小游戏');
  assert(arcade.features.includes('十三款小游戏'));
  assert(!/十款|十种/.test(JSON.stringify(arcade)));
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
  assert.equal((html.match(/class="work-card"/g) || []).length, 10);
  assert(html.includes('THE WORK INDEX / 01—10'));
  assert(html.includes('7 游戏 · 2 工具 · 1 学习'));
  assert(html.includes('显示 10 / 10 个作品'));
  assert(html.includes('8 个公开作品 · 2 个受限入口'));
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
