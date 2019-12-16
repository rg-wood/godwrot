import resolve from 'rollup-plugin-node-resolve'

export default {
  input: ['assets/scripts/vellum.js', 'assets/scripts/ink.js'],
  output: {
    dir: 'dist/html/scripts/',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    resolve()
  ]
}
