const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('index.html','utf8');
const js = fs.readFileSync('src/app.js','utf8');
test('game JavaScript parses', () => assert.doesNotThrow(() => new vm.Script(js)));
test('HTML references external assets and closes', () => {assert.match(html, /src\/styles\.css/);assert.match(html,/src\/app\.js/);assert.match(html,/<\/html>/);});
test('core game features retained', () => {for(const feature of ['decode','biobuzz','compile','startMatch']) assert.ok(js.includes(feature), feature)});
