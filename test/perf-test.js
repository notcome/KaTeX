/* eslint-disable no-console */
require('babel-register');
const Benchmark = require('benchmark');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const filename = path.resolve(__dirname, 'screenshotter/ss_data.yaml');
const data = yaml.load(fs.readFileSync(filename, 'utf-8'));

console.log('compiling katex...');
const katex = require('../katex');
console.log('');

const suite = new Benchmark.Suite;

const testsToRun = [
    "AccentsText",
    "ArrayMode",
    "GroupMacros",
    "MathBb",
    "SqrtRoot",
    "StretchyAccent",
    "Units",
];

for (const key of testsToRun) {
    const value = data[key];
    if (typeof value === "string") {
        suite.add(key, () => katex.renderToString(value));
    } else {
        if (value.macros) {
            const options = {
                macros: value.macros,
            };
            suite.add(key, () => katex.renderToString(value.tex, options));
        } else {
            suite.add(key, () => katex.renderToString(value.tex));
        }
    }
}

suite.on('cycle', function(event) {
    console.log(String(event.target));
});

suite.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
});

suite.run({
    async: true,
});
