const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {relativeAsset} = require('./assets.cjs');
const root = path.resolve(__dirname, '..');
const labels = Object.freeze({game: '游戏', tool: '工具', learning: '学习'});
const escape = value => String(value).replace(/[&<>"']/g, character => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[character]));

function exactKeys(value, names, label) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `${label} must be an object`);
  assert.deepEqual(Object.keys(value).sort(), names.slice().sort(), `Unexpected fields in ${label}`);
}
function text(value, min, max, label) {
  assert(typeof value === 'string' && value.trim() === value && value.length >= min && value.length <= max && !/[\u0000-\u001f\ufffd]/u.test(value), `Invalid ${label}`);
}
function validate(data) {
  exactKeys(data, ['schemaVersion', 'verifiedAt', 'works'], 'catalog');
  assert.equal(data.schemaVersion, 1);
  assert(/^\d{4}-\d{2}-\d{2}T/.test(data.verifiedAt) && Number.isFinite(Date.parse(data.verifiedAt)), 'Invalid verification date');
  assert(Array.isArray(data.works) && data.works.length > 0, 'Catalog cannot be empty');
  const ids = new Set(), urls = new Set();
  for (const work of data.works) {
    exactKeys(work, ['id', 'title', 'category', 'summary', 'features', 'access', 'url', 'cover'], 'work');
    assert(/^[a-z][a-z0-9-]{1,49}$/.test(work.id) && !ids.has(work.id), 'Invalid or duplicate work id');
    ids.add(work.id);
    text(work.title, 2, 80, 'title');
    text(work.summary, 8, 160, 'summary');
    assert(Object.hasOwn(labels, work.category), 'Unknown category');
    assert(['public', 'restricted'].includes(work.access), 'Unknown access level');
    assert(Array.isArray(work.features) && work.features.length >= 1 && work.features.length <= 4, 'Invalid features');
    work.features.forEach(feature => text(feature, 1, 30, 'feature'));
    assert.equal(new Set(work.features).size, work.features.length, 'Duplicate features');
    text(work.url, 10, 200, 'URL');
    const url = new URL(work.url);
    assert(url.protocol === 'https:' && !url.username && !url.password && !url.search && !url.hash && !/\s/.test(work.url), 'Unsafe work URL');
    const canonical = url.href.replace(/\/$/, '');
    assert(!urls.has(canonical), 'Duplicate work URL');
    urls.add(canonical);
    exactKeys(work.cover, ['src', 'small', 'width', 'height', 'smallWidth', 'alt'], 'cover');
    for (const key of ['src', 'small']) assert(/^assets\/images\/[a-z0-9-]+\.webp$/.test(relativeAsset(work.cover[key])), 'Cover must be a local WebP');
    for (const key of ['width', 'height', 'smallWidth']) assert(Number.isInteger(work.cover[key]) && work.cover[key] >= 100 && work.cover[key] <= 2400, 'Invalid cover dimensions');
    assert(work.cover.smallWidth < work.cover.width, 'Small image must be smaller');
    text(work.cover.alt, 10, 160, 'cover alt');
    assert(work.cover.alt.includes('概念封面') && work.cover.alt.includes('非实际'), 'Concept artwork must not imply a screenshot');
  }
  assert(data.works.some(work => work.id === 'yourwar'), 'Hero work is missing');
  assert(data.works.some(work => work.id === 'agent-journey' && work.access === 'restricted'), 'Learning entry must retain its access boundary');
  return data;
}
function loadCatalog() { return validate(JSON.parse(fs.readFileSync(path.join(root, 'data/works.json'), 'utf8'))); }
function renderCard(work, index) {
  const e = escape, restricted = work.access === 'restricted', cover = work.cover;
  const search = [work.title, work.summary, labels[work.category], ...work.features].join(' ');
  return `        <li class="work-card" data-work-id="${e(work.id)}" data-work-category="${e(work.category)}" data-work-search="${e(search)}">
          <article aria-labelledby="work-${e(work.id)}-title">
            <figure class="work-cover"><img src="./${e(cover.small)}" srcset="./${e(cover.small)} ${cover.smallWidth}w, ./${e(cover.src)} ${cover.width}w" sizes="(max-width: 680px) calc(100vw - 40px), (max-width: 980px) calc((100vw - 96px) / 2), (max-width: 1374px) calc((100vw - 120px) / 3), 407px" width="${cover.width}" height="${cover.height}" alt="${e(cover.alt)}" loading="lazy" decoding="async"><figcaption class="concept-label">概念封面 · 非实际截图</figcaption><span class="work-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span></figure>
            <div class="work-body">
              <div class="work-meta"><span>${labels[work.category]}</span><span class="work-access${restricted ? ' is-restricted' : ''}">${restricted ? '受限访问' : '公开作品'}</span></div>
              <h3 id="work-${e(work.id)}-title">${e(work.title)}</h3>
              <p class="work-summary">${e(work.summary)}</p>
              <ul class="work-features" aria-label="作品特色">${work.features.map(feature => `<li>${e(feature)}</li>`).join('')}</ul>
              <div class="work-bottom"><p id="work-${e(work.id)}-notice" class="work-notice">${restricted ? '需要已有访问权限；此处仅展示目录信息。' : '在独立站点体验，新标签页打开。'}</p><a class="work-link" href="${e(work.url)}" target="_blank" rel="noopener noreferrer" aria-describedby="work-${e(work.id)}-notice" aria-label="${restricted ? '打开受限入口' : '访问作品'}：${e(work.title)}（新标签页）">${restricted ? '打开受限入口' : work.category === 'game' ? '开始试玩' : '打开作品'}<img src="./assets/icons/arrow-up-right.svg" width="20" height="20" alt="" class="icon-accent"></a></div>
            </div>
          </article>
        </li>`;
}
function blocks(data) {
  const works = data.works, counts = Object.fromEntries(Object.keys(labels).map(key => [key, works.filter(work => work.category === key).length]));
  const restricted = works.filter(work => work.access === 'restricted').length;
  const hero = works.find(work => work.id === 'yourwar');
  const learning = works.find(work => work.id === 'agent-journey');
  return {
    'hero-project': `        <div class="hero-project-copy"><h2>YourWar</h2><p>3D 战争沙盘 · 自由布阵</p></div>
        <a class="circle-link" href="${escape(hero.url)}" target="_blank" rel="noopener noreferrer" aria-describedby="external-notice" aria-label="试玩 ${escape(hero.title)}，外部入口，新标签页打开"><img src="./assets/icons/arrow-up-right.svg" width="28" height="28" alt=""></a>`,
    gallery: `      <div class="gallery-heading"><div><p class="eyebrow" lang="en">THE WORK INDEX / 01—${String(works.length).padStart(2, '0')}</p><h2 id="explore-title">想法落地，<br>就有了这些作品。</h2></div><div class="gallery-intro"><p>喜欢游戏，就开一局。<br>对工具与 AI 感兴趣，也有得逛。</p><p class="gallery-count"><strong>${String(works.length).padStart(2, '0')}</strong><span>个作品<br>${counts.game} 游戏 · ${counts.tool} 工具 · ${counts.learning} 学习</span></p></div></div>
      <div class="gallery-guide"><span>快速了解我：交互游戏、生活工具、人机协作。</span><a href="#about">关于我<img class="icon-light" src="./assets/icons/arrow-right.svg" width="18" height="18" alt=""></a></div>
      <div class="works-controls" data-works-controls hidden><div class="work-filters" data-work-filters role="group" aria-label="按作品分类筛选"><button type="button" data-work-category="all" aria-pressed="true">全部 <span>${works.length}</span></button>${Object.entries(labels).map(([key, label]) => `<button type="button" data-work-category="${key}" aria-pressed="false">${label} <span>${counts[key]}</span></button>`).join('')}</div><form class="work-search" role="search" aria-label="搜索作品"><label for="work-search" class="sr-only">搜索作品名称、简介或特色</label><img class="icon-light" src="./assets/icons/magnifying-glass.svg" width="18" height="18" alt=""><input type="search" id="work-search" name="work-q" placeholder="搜索作品或玩法" maxlength="120" autocomplete="off"></form></div>
      <div class="works-status-row"><p id="works-results-status" class="results-status" role="status" aria-live="polite">显示 ${works.length} / ${works.length} 个作品</p><button class="clear-filters" type="button" data-work-reset hidden>清除筛选</button></div>
      <noscript><p class="no-script-note">以下是完整作品目录。启用 JavaScript 后可以按分类和关键词筛选。</p></noscript>
      <ul class="works-grid" aria-label="Sites 作品目录" aria-describedby="works-results-status">
${works.map(renderCard).join('\n')}
      </ul>
      <div class="works-empty" id="works-empty" hidden><p class="eyebrow" lang="en">TRY ANOTHER IDEA</p><h3>没有找到这个作品。</h3><p>换个关键词，或清除筛选再逛一逛。</p><button class="button" type="button">查看全部作品</button></div>
      <div class="gallery-footnote"><p>${works.length - restricted} 个公开作品 · ${restricted} 个受限入口。封面均为概念创作，不是产品截图。</p><p>目录核对于 <time datetime="${data.verifiedAt.slice(0, 10)}">${data.verifiedAt.slice(0, 10).replace(/-/g, '.')}</time></p></div>
      <div class="chapter-end"><p>保持好奇，持续动手。</p><a href="#notes">也看看我的学习记录 ↓</a></div>`,
    'profile-works': `${works.length} 个作品 · 游戏 / 工具 / 学习`,
    'legacy-notes': `      <details class="legacy-notes"><summary>已有学习日志与访问说明</summary><div><p>「${escape(learning.title)}」为受限站点，需要已有访问权限。这里不展示或复制日志正文。</p><a href="${escape(learning.url)}" target="_blank" rel="noopener noreferrer">打开受限学习日志<span class="sr-only">（需要访问权限，新标签页）</span><img class="icon-light" src="./assets/icons/arrow-up-right.svg" width="18" height="18" alt=""></a></div></details>`
  };
}
function renderDocument(html, data) {
  validate(data);
  for (const [name, content] of Object.entries(blocks(data))) {
    const start = `<!-- generated:${name}:start -->`, end = `<!-- generated:${name}:end -->`;
    assert.equal(html.split(start).length, 2, `Missing or repeated ${name} start marker`);
    assert.equal(html.split(end).length, 2, `Missing or repeated ${name} end marker`);
    const startIndex = html.indexOf(start) + start.length, endIndex = html.indexOf(end);
    assert(startIndex <= endIndex, `Invalid ${name} region`);
    html = html.slice(0, startIndex) + '\n' + content + '\n      ' + html.slice(endIndex);
  }
  return html;
}
function generate(verify = false) {
  const file = path.join(root, 'public/index.html'), current = fs.readFileSync(file, 'utf8');
  const generated = renderDocument(current, loadCatalog());
  if (verify) assert.equal(current, generated, 'Generated work directory is stale: run npm run generate');
  else fs.writeFileSync(file, generated, 'utf8');
  return generated;
}
if (require.main === module) { generate(process.argv.includes('--check')); console.log('Works catalog is valid and synchronized.'); }
module.exports = {validate, loadCatalog, renderCard, renderDocument, generate, blocks, labels};
