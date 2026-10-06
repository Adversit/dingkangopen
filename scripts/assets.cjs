const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

function relativeAsset(value) {
  assert.equal(typeof value, 'string', 'Asset path must be a string');
  const decoded = decodeURIComponent(value).replace(/^\.\//,'');
  assert(decoded && !decoded.includes('\\') && !decoded.includes('\0'), 'Invalid asset path');
  assert(!decoded.startsWith('/') && !/^[a-z][a-z\d+.-]*:/i.test(decoded), 'Expected a relative local asset');
  assert(!/[?#]/.test(decoded), 'Asset reference must be an exact local file path');
  assert(decoded.split('/').every(p => p && p !== '.' && p !== '..' && !p.startsWith('.')), 'Unsafe asset path');
  return decoded;
}

function references(html, css) {
  const refs = [];
  for (const tag of html.matchAll(/<(?:img|script|link|source)\b[^>]*>/gi)) {
    const direct = tag[0].match(/\b(?:src|href)="([^"]+)"/i);
    if (direct) refs.push(direct[1]);
    const set = tag[0].match(/\bsrcset="([^"]+)"/i);
    if (set) refs.push(...set[1].split(',').map(candidate => candidate.trim().split(/\s+/)[0]));
  }
  for (const match of css.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/gi)) refs.push(match[1]);
  return [...new Set(refs.map(relativeAsset))];
}

function filesIn(root) {
  assert(!fs.lstatSync(root).isSymbolicLink(), 'Asset directory must not be a link');
  const names = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
      const full = path.join(dir,entry.name);
      assert(!entry.isSymbolicLink(), 'Symbolic links are not allowed in public files');
      if (entry.isDirectory()) walk(full);
      else { assert(entry.isFile()); names.push(path.relative(root,full).split(path.sep).join('/')); }
    }
  }
  walk(root);
  return names.sort();
}

function inspect(root, allowlist) {
  const expected = allowlist.map(relativeAsset).sort();
  assert.equal(new Set(expected).size,expected.length,'Duplicate public file entries');
  assert(expected.includes('index.html'),'Root index.html required');
  assert.deepEqual(filesIn(root),expected,'Public files must match the reviewed allowlist');
  const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
  const css = fs.readFileSync(path.join(root,'styles.css'),'utf8');
  for (const ref of references(html,css)) assert(expected.includes(ref),`Missing runtime asset: ${ref}`);
  assert(!/@import/i.test(css),'External CSS imports are not allowed');
  assert(html.includes('width=device-width'),'Responsive viewport required');
  const hashes = {};
  let bytes = 0;
  for (const name of expected) {
    assert(/\.(html|css|js|webp|woff2|svg|txt)$/.test(name),'Unexpected public file type');
    const data = fs.readFileSync(path.join(root,name));
    assert(data.length <= 2*1024*1024,`Asset too large: ${name}`);
    if (/\.(html|css|js|svg|txt)$/.test(name)) {
      const text = data.toString('utf8');
      assert(!/-----BEGIN [A-Z ]*PRIVATE KEY-----|(?:ghp_|github_pat_)[A-Za-z0-9_]{20,}|\bLTAI[A-Za-z0-9]{12,}/.test(text),'Secret-like material found');
      assert(!/[CG]:[\\/]Users[\\/]|PRIVATE_FIXTURE|DO_NOT_SHIP/.test(text),'Private build material found');
    }
    hashes[name] = {bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex')};
    bytes += data.length;
  }
  assert(bytes <= 5*1024*1024,'Static payload exceeds project size budget');
  return {fileCount:expected.length,totalBytes:bytes,files:hashes};
}
module.exports = {relativeAsset,references,filesIn,inspect};
