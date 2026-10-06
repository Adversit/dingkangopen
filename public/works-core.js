(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.NightLabWorks = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function normalizeQuery(value) {
    return String(value || '').slice(0, 120).normalize('NFKC').trim().toLocaleLowerCase('zh-CN');
  }
  function matches(work, selection) {
    var state = selection || {};
    if (!work || (state.category && state.category !== 'all' && state.category !== work.category)) return false;
    var query = normalizeQuery(state.query);
    var text = String(work.search || '').normalize('NFKC').toLocaleLowerCase('zh-CN');
    return !query || text.indexOf(query) !== -1;
  }
  function hasFilters(selection) {
    return Boolean(selection && ((selection.category && selection.category !== 'all') || normalizeQuery(selection.query)));
  }
  return Object.freeze({normalizeQuery: normalizeQuery, matches: matches, hasFilters: hasFilters});
});
