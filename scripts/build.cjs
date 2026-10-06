const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const {check,root,publicFiles} = require('./check.cjs');
const {filesIn} = require('./assets.cjs');

// ESA runs the same checks before copying any production assets.
const source = check();
execFileSync(process.execPath,['--test','tests/notes.test.cjs','tests/deployment.test.cjs'],{cwd:root,stdio:'inherit'});
const destination = path.resolve(root,'dist');
assert.equal(path.dirname(destination),root,'Output must stay inside this project');
if(fs.existsSync(destination)) {
  for(const name of filesIn(destination)) assert(publicFiles.includes(name)||name==='deployment.json',`Unexpected existing output: ${name}`);
}
for(const name of publicFiles) {
  const output = path.join(destination,name);
  fs.mkdirSync(path.dirname(output),{recursive:true});
  fs.copyFileSync(path.join(root,'public',name),output);
}
let commit = null;
try {
  const value = execFileSync('git',['rev-parse','--verify','HEAD'],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  if(/^[a-f0-9]{40,64}$/.test(value)) commit = value;
} catch { /* Local preparation has no commit yet. Never invent one. */ }
const marker = {schemaVersion:1,gitCommit:commit,...source};
for(const name of publicFiles) assert.deepEqual(fs.readFileSync(path.join(destination,name)),fs.readFileSync(path.join(root,'public',name)));
fs.writeFileSync(path.join(destination,'deployment.json'),JSON.stringify(marker,null,2)+'\n');
console.log(JSON.stringify({status:'built',gitCommit:commit,staticFiles:source.fileCount,totalBytes:source.totalBytes,output:'dist',deploymentMarker:'deployment.json'}));
