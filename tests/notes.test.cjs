// Synthetic fixtures test filtering; none of these records are shipped in the site.
const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('../public/notes-core.js');
const fixtures = [
  {id:'a', title:'测试 Agent 架构', category:'agent', tags:['架构'], summary:'接口与组合', date:'2026-01-01', url:'https://example.com/a', published:true},
  {id:'b', title:'测试金融笔记', category:'fintech', tags:['阅读'], summary:'阅读记录', date:'2026-02-02', url:'https://example.com/b', published:true},
  {id:'c', title:'测试实践笔记', category:'practice', tags:['架构','动手实践'], summary:'AGENT 实验', date:'2026-03-03', url:'https://example.com/c', published:true},
  {id:'private', title:'PRIVATE_FIXTURE', category:'agent', tags:['架构'], summary:'not public', date:'2026-04-04', url:'https://example.com/private', published:false},
  {id:'unspecified', title:'UNAPPROVED_FIXTURE', category:'agent', tags:[], date:'2026-04-05', url:'https://example.com/unspecified'},
  {id:'unsafe', title:'unsafe', category:'agent', tags:[], date:'2026-04-06', url:'javascript:alert(1)', published:true}
];
const all = {category:'all', tag:'all', query:''};
test('only explicitly public records with safe URLs reach the list', () => {
  assert.deepEqual(core.filterNotes(fixtures, all).map(x => x.id), ['c','b','a']);
});
test('category and tag filters combine', () => {
  assert.deepEqual(core.filterNotes(fixtures, {...all, category:'practice',tag:'架构'}).map(x => x.id), ['c']);
  assert.equal(core.filterNotes(fixtures, {...all, category:'fintech',tag:'架构'}).length, 0);
});
test('search trims whitespace, ignores Latin case, and searches summaries', () => {
  assert.deepEqual(core.filterNotes(fixtures, {...all, query:'  aGeNt  '}).map(x => x.id), ['c','a']);
  assert.deepEqual(core.filterNotes(fixtures, {...all, query:'接口'}).map(x => x.id), ['a']);
});
test('search also matches tags and combines with category', () => {
  assert.deepEqual(core.filterNotes(fixtures, {...all,query:'架构',category:'agent'}).map(x=>x.id), ['a']);
});
test('filtering does not mutate source order or records', () => {
  const before = JSON.stringify(fixtures);
  core.filterNotes(fixtures, {...all,query:'测试'});
  assert.equal(JSON.stringify(fixtures), before);
});
test('credential, script, data, HTTP and whitespace URLs are rejected', () => {
  for (const url of ['javascript:alert(1)','data:text/html,x','http://example.com','https://user:secret@example.com','https://example.com/ a','']) assert.equal(core.safeArticleUrl(url),null);
  assert.equal(core.safeArticleUrl('https://example.com/a'),'https://example.com/a');
});
test('reset selection removes all filters', () => {
  assert.equal(core.hasFilters(all),false);
  assert.equal(core.hasFilters({...all,tag:'架构'}),true);
  assert.equal(core.hasFilters({...all,query:'   '}),false);
});
test('empty data and unmatched filters have honest separate messages', () => {
  assert.equal(core.filterNotes([],all).length,0);
  assert.equal(core.emptyMessage(0,all).title,'笔记正在整理。');
  assert.equal(core.emptyMessage(0,{...all,category:'agent'}).title,'这里还没有公开笔记。');
  assert.equal(core.emptyMessage(3,{...all,query:'missing'}).title,'没有找到匹配的笔记。');
});
