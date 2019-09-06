import resolve from 'rollup-plugin-node-resolve'

export default {
  input: ['assets/scripts/vellum.js'],
  output: {
    file: 'dist/html/scripts/vellum.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    resolve()
  ]
}
