import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import autoprefixer from 'autoprefixer'

import fs from 'fs-extra';
import makeImportsRelative from './rollup-plugins/rollup-plugin-make-imports-relative/make-imports-relative';
import pathVariables from './rollup-plugins/rollup-plugin-path-variables/path-variables';

import replace from '@rollup/plugin-replace';
import dotenv from 'dotenv';

const production = !process.env.ROLLUP_WATCH;
const buildStandalone = process.env.npm_lifecycle_script.includes(
  'ROLLUP_STANDALONE=true'
);
const forLocalTomcat = process.env.npm_lifecycle_script.includes(
  'ROLLUP_LOCAL=true'
);

const ENV_PATH = production && !buildStandalone ? (forLocalTomcat ? `.env.dev`:`.env.production`) : `.env`;
const env = dotenv.config({ path: ENV_PATH }).parsed;
env.production = production
env.buildStandalone = buildStandalone
env.forLocalTomcat = forLocalTomcat
console.log({ ENV_PATH, env });

function serve() {
  let server;
  console.log("START!", {server})
  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn(
        'npm',
        ['run', 'start', '--', '--dev'],
        {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        }
      );
      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}

/**
 * copy public folder to src and src it from there
 */
function copyPublicToSrc() {
  fs.emptyDirSync('../src');
  fs.copySync('public', '../src');
}

/**
 * create symlinks to src-svelte/public in order for serve command
 * to have access to root lib folder
 */
function ensureLibFolderInBuild() {
  const src = fs.realpathSync('../lib');
  const dest = '../src/lib';

  if (!production) {
    if (fs.existsSync(dest) && fs.realpathSync(dest) != fs.realpathSync(src)) {
      fs.removeSync(dest);
    }

    if (!fs.existsSync(dest)) {
      fs.ensureSymlinkSync(src, dest);
    }
  }
}

function updateTFJSUrl() {
  const idx = '../src/index.html';
  fs.readFile(idx, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    const result = data.replace(/%%SERVE-URL%%/g, production ? '..' : '../lib');
  
    fs.writeFile(idx, result, 'utf8', function (err) {
       if (err) return console.log(err);
    });
  });
}

fs.ensureDirSync('../lib');
copyPublicToSrc();
ensureLibFolderInBuild();
updateTFJSUrl();

const createSourceMap = !production

export default {
  input: 'src/main.ts',
  output: {
    sourcemap: createSourceMap,
    format: 'esm',
    name: 'app',
    file: '../src/static/index.js',
  },
  plugins: [
    json(),
    replace({
      // stringify the object     
      process: JSON.stringify({
        env
      }),
    }),
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: (css) => {
        css.write('index.css');
      },
      preprocess: sveltePreprocess({
        scss: {
          includePaths: ['src', 'node_modules'],
        },
        postcss: {
          plugins: [autoprefixer],
        },
      }),
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    pathVariables({
      // Define a directory width prefix `@`
      '@root': './src',
      // Define a lib
      // "tfjs": "../lib/tribefire-1.0.0/",
    }),
    makeImportsRelative({ useLocalLibFolder: !production || buildStandalone }),
    resolve({
      browser: true,
      dedupe: ['svelte', 'svelte/transition', 'svelte/internal'],
    }),
    commonjs(),
    typescript({ sourceMap: createSourceMap }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `src` directory and refresh the
    // browser on changes when not in production
    !production && livereload('../src'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
