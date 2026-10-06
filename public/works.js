(function () {
  'use strict';
  var core = window.NightLabWorks;
  var section = document.getElementById('explore');
  if (!core || !section) return;
  var controls = section.querySelector('[data-works-controls]');
  var filters = section.querySelector('[data-work-filters]');
  var form = section.querySelector('.work-search');
  var input = document.getElementById('work-search');
  var status = document.getElementById('works-results-status');
  var empty = document.getElementById('works-empty');
  var reset = section.querySelector('[data-work-reset]');
  var cards = Array.from(section.querySelectorAll('[data-work-id]'));
  if (!controls || !filters || !form || !input || !status || !empty || !reset || !cards.length) return;
  var state = {category: 'all', query: ''};
  function render() {
    var count = 0;
    cards.forEach(function (card) {
      var visible = core.matches({category: card.dataset.workCategory, search: card.dataset.workSearch}, state);
      card.hidden = !visible;
      if (visible) count += 1;
    });
    filters.querySelectorAll('[data-work-category]').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.workCategory === state.category));
    });
    status.textContent = '显示 ' + count + ' / ' + cards.length + ' 个作品';
    empty.hidden = count > 0;
    reset.hidden = !core.hasFilters(state);
  }
  function clearFilters() {
    state = {category: 'all', query: ''};
    input.value = '';
    render();
    input.focus({preventScroll: true});
  }
  filters.addEventListener('click', function (event) {
    var button = event.target.closest('button[data-work-category]');
    if (!button || !filters.contains(button)) return;
    state.category = button.dataset.workCategory;
    render();
  });
  input.addEventListener('input', function () { state.query = input.value; render(); });
  form.addEventListener('submit', function (event) { event.preventDefault(); });
  reset.addEventListener('click', clearFilters);
  empty.querySelector('button').addEventListener('click', clearFilters);
  render();
  controls.hidden = false;
})();
