(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.NightLabNotes = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function safeArticleUrl(value) {
    if (typeof value !== 'string' || /[\s\u0000-\u001f]/.test(value)) return null;
    try {
      var url = new URL(value);
      return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
    } catch (_) { return null; }
  }
  function publishedNotes(items) {
    return (Array.isArray(items) ? items : []).filter(function (item) {
      return item && item.published === true && typeof item.title === 'string' && safeArticleUrl(item.url);
    });
  }
  function filterNotes(items, selection) {
    var state = selection || {};
    var query = String(state.query || '').trim().toLocaleLowerCase('zh-CN');
    return publishedNotes(items).filter(function (item) {
      var tags = Array.isArray(item.tags) ? item.tags : [];
      if (state.category && state.category !== 'all' && item.category !== state.category) return false;
      if (state.tag && state.tag !== 'all' && tags.indexOf(state.tag) === -1) return false;
      var searchable = [item.title, item.summary || '', tags.join(' ')].join(' ').toLocaleLowerCase('zh-CN');
      return !query || searchable.indexOf(query) !== -1;
    }).sort(function (a, b) {
      return String(b.date || '').localeCompare(String(a.date || ''));
    });
  }
  function hasFilters(selection) {
    return selection.category !== 'all' || selection.tag !== 'all' || String(selection.query || '').trim() !== '';
  }
  function emptyMessage(total, selection) {
    if (total === 0 && !hasFilters(selection)) return {title:'笔记正在整理。', description:'目前还没有发布文章。新的理解与实践，会在整理后出现在这里。'};
    if (total === 0) return {title:'这里还没有公开笔记。', description:'这个方向的内容还在整理。可以清除筛选，或以后再来看看。'};
    return {title:'没有找到匹配的笔记。', description:'试试其他关键词、分类或标签，也可以清除筛选查看全部笔记。'};
  }
  return Object.freeze({safeArticleUrl:safeArticleUrl, publishedNotes:publishedNotes, filterNotes:filterNotes, hasFilters:hasFilters, emptyMessage:emptyMessage});
});
