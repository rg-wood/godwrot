import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import copy from 'rollup-plugin-copy'
import pkg from './package.json' assert { type: 'json' }

export default {
  plugins: [
    resolve(),
    terser({
      ecma: 2021,
      module: true,
      warnings: true,
    }),
    copy({
      targets: [
        {
          src: 'index.html',
          dest: 'dist/',
          transform: (contents, filename) => contents.toString().replace('__VERSION__', pkg.version)
        },
        { src: 'node_modules/skeleton-css/**/*', dest: 'dist/vendor/skeleton-css' }
      ]
    })
  ],
  input: {
    'vellum-doc': 'node_modules/vellum-doc/vellum-doc.js',
    'vellum-random-table': 'node_modules/vellum-random-table/vellum-random-table.js',
    'vellum-dice': 'node_modules/vellum-dice/vellum-dice.js',
  },
  output: {
    dir: 'dist/components',
  },
  preserveEntrySignatures: 'strict',
};
