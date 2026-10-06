const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {relativeAsset,references,inspect} = require('../scripts/assets.cjs');

test('encoded traversal, absolute paths, and hidden files cannot enter public output',()=>{
  for(const name of ['../secret','%2e%2e/secret','assets/../secret','C:/secret','/secret','assets\\secret','.env','a//b']) {
    assert.throws(()=>relativeAsset(name));
  }
});
test('runtime resources cannot silently load a remote origin or embedded payload',()=>{
  for(const ref of ['https://example.com/x.js','//example.com/x.js','data:text/plain,a','javascript:alert(1)']) assert.throws(()=>relativeAsset(ref));
});
test('responsive images and CSS fonts participate in dependency checking',()=>{
  assert.deepEqual(references('<img src="./a.webp" srcset="./a.webp 400w, ./b.webp 800w"><script src="./app.js"></script>',"@font-face{src:url('./font.woff2')}"),['a.webp','b.webp','app.js','font.woff2']);
});
test('unlisted files are rejected before publication',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'homepage-deploy-check-'));
  try {
    fs.writeFileSync(path.join(dir,'index.html'),'<meta name="viewport" content="width=device-width">');
    fs.writeFileSync(path.join(dir,'styles.css'),'body{}');
    fs.writeFileSync(path.join(dir,'private.txt'),'fixture');
    assert.throws(()=>inspect(dir,['index.html','styles.css']),/reviewed allowlist/);
  } finally {
    for(const file of ['index.html','styles.css','private.txt']) fs.unlinkSync(path.join(dir,file));
    fs.rmdirSync(dir);
  }
});
test('a missing image blocks publishing even when HTML exists',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'homepage-deploy-check-'));
  try {
    fs.writeFileSync(path.join(dir,'index.html'),'<meta name="viewport" content="width=device-width"><img src="missing.webp">');
    fs.writeFileSync(path.join(dir,'styles.css'),'body{}');
    assert.throws(()=>inspect(dir,['index.html','styles.css']),/Missing runtime asset/);
  } finally {
    for(const file of ['index.html','styles.css']) fs.unlinkSync(path.join(dir,file));
    fs.rmdirSync(dir);
  }
});
