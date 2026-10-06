const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {inspect} = require('./assets.cjs');
const {generate} = require('./works.cjs');
const root = path.resolve(__dirname,'..');
const publicFiles = JSON.parse(fs.readFileSync(path.join(root,'public-files.json'),'utf8'));

function check() {
  generate(true);
  const result = inspect(path.join(root,'public'),publicFiles);
  for (const file of ['app.js','notes-core.js','notes-data.js','works-core.js','works.js']) {
    execFileSync(process.execPath,['--check',path.join(root,'public',file)],{stdio:'pipe'});
  }
  return result;
}
if(require.main === module) console.log(JSON.stringify(check(),null,2));
module.exports = {check,root,publicFiles};
