import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import tsc from 'node-typescript-compiler';

const cliArgs = process.argv.slice(2);
const isWatchMode = cliArgs.includes('-w') || cliArgs.includes('--watch');

const srcFilePath = path.resolve('./src/variables/variables.ts');
const tmpDir = path.join(os.tmpdir(), 'svelte-demo-app');
let fileCounter = 0;

function formatValue(value) {
  if (typeof value === 'object') {
    if (!value) {
      throw 'null values are not allowed';
    }

    if (value.units) {
      return value.value + value.units;
    }

    return value.value;
  }

  return value;
}

function transformFile() {
  let outDir = path.join(tmpDir, 'variables-' + fileCounter++);

  // console.log('transformFile to\n', outDir);

  tsc
    .compile({ module: 'commonjs', outDir }, [srcFilePath])
    .then(() => import(path.join(outDir, 'variables.js')))
    .then((compiled) => {
      const variables = compiled.default.default;
      // console.log(path.join(outDir, 'variables.js'));
      // console.log({ variables });

      const scssVariables = Array.from(Object.entries(variables))
        .map(([key, value]) => `$${key}: ${formatValue(value)};`)
        .join('\n');

      const cssVariables = Array.from(Object.entries(variables))
        .map(([key, value]) => `  --${key}: ${formatValue(value)};`)
        .join('\n');

      fs.writeFileSync(
        path.resolve('./src/styles/variables.scss'),
        `/*
* DO NOT EDIT THIS FILE MANUALLY
* TO CHANGE VARIABLES EDIT "src/variables/variables.ts"
*/

// SCSS variables
${scssVariables}

// CSS variables
:global(:root) {
${cssVariables}
}`
      );
    });
}

if (isWatchMode) {
  transformFile();
  console.log('watching file: ', srcFilePath);
  fs.watchFile(srcFilePath, (curr, prev) => {
    if (curr.mtime != prev.mtime) {
      transformFile();
    } else console.log('mtimes are equal');
  });
} else {
  transformFile();
}

// setInterval(() => console.log('timer'), 2000);
