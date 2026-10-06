(function () {
  'use strict';
  var data = window.NIGHT_LAB_NOTES;
  var core = window.NightLabNotes;
  var notebook = document.getElementById('notes');
  if (!data || !core || !notebook) return;
  var list = document.getElementById('note-list');
  var empty = document.getElementById('notes-empty');
  var status = document.getElementById('notes-results-status');
  var input = document.getElementById('note-search');
  var clear = document.getElementById('clear-filters');
  if (!list || !empty || !status || !input || !clear) return;
  var state = {category:'all', tag:'all', query:''};
  var total = core.publishedNotes(data.articles).length;
  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function articleNode(article) {
    var node = element('li', 'note-entry');
    var meta = element('div', 'note-entry-meta');
    var category = data.categories.find(function (item) { return item.id === article.category; });
    meta.appendChild(element('span', '', category ? category.label : article.category));
    var date = element('time', '', article.date);
    date.dateTime = article.date;
    meta.appendChild(date);
    node.appendChild(meta);
    node.appendChild(element('h3', '', article.title));
    node.appendChild(element('p', 'note-entry-summary', article.summary));
    node.appendChild(element('p', 'note-entry-tags', article.tags.map(function (tag) { return '#' + tag; }).join('  ')));
    var link = element('a', '', '阅读笔记');
    link.href = core.safeArticleUrl(article.url);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', '阅读：' + article.title + '（外部入口，新标签页）');
    var icon = element('img', 'icon-accent');
    icon.src = './assets/icons/arrow-up-right.svg';
    icon.alt = '';
    icon.width = 18;
    icon.height = 18;
    link.appendChild(icon);
    node.appendChild(link);
    return node;
  }
  function render() {
    var items = core.filterNotes(data.articles, state);
    var fragment = document.createDocumentFragment();
    items.forEach(function (article) { fragment.appendChild(articleNode(article)); });
    list.replaceChildren(fragment);
    empty.hidden = items.length > 0;
    var message = core.emptyMessage(total, state);
    document.getElementById('empty-title').textContent = message.title;
    document.getElementById('empty-description').textContent = message.description;
    status.textContent = total === 0 ? (core.hasFilters(state) ? '当前筛选下暂无公开笔记' : '尚无公开笔记') : '显示 ' + items.length + ' 篇公开笔记';
    notebook.querySelectorAll('[data-category]').forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.category === state.category)); });
    notebook.querySelectorAll('[data-tag]').forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.tag === state.tag)); });
    clear.hidden = !core.hasFilters(state);
  }
  notebook.querySelector('.category-filters').addEventListener('click', function (event) {
    var button = event.target.closest('button[data-category]');
    if (!button) return;
    state.category = button.dataset.category;
    render();
  });
  notebook.querySelector('.tag-filters').addEventListener('click', function (event) {
    var button = event.target.closest('button[data-tag]');
    if (!button) return;
    state.tag = button.dataset.tag;
    render();
  });
  input.addEventListener('input', function () { state.query = input.value; render(); });
  notebook.querySelector('.search-form').addEventListener('submit', function (event) { event.preventDefault(); });
  clear.addEventListener('click', function () {
    state = {category:'all', tag:'all', query:''};
    input.value = '';
    render();
    input.focus({preventScroll:true});
  });
  render();
  notebook.querySelector('[data-js-controls]').hidden = false;
})();
(function () {
  'use strict';
  var navLinks = Array.from(document.querySelectorAll('[data-nav]'));
  function activate(id) {
    navLinks.forEach(function (link) {
      if (link.dataset.nav === id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  navLinks.forEach(function (link) { link.addEventListener('click', function () { activate(link.dataset.nav); }); });
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) activate(entry.target.dataset.navSection); });
    }, {rootMargin:'-12% 0px -60% 0px', threshold:0});
    document.querySelectorAll('[data-nav-section]').forEach(function (section) { observer.observe(section); });
  }
})();
