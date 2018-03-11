import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import image from 'rollup-plugin-img'
import postcss from 'rollup-plugin-postcss'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  // All the used libs needs to be here
  external: [
    'react',
    'react-dom',
    'react-markdown',
    'react-modal',
    'prop-types',
    'lodash',
    'front-matter',
    'semver-compare',
  ],
  plugins: [
    resolve({
      browser: true,
      extensions: [ '.js', '.jsx' ],
    }),
    postcss(),
    image(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
