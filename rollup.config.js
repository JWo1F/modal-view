const babel = require('rollup-plugin-babel');
const stylus = require('./scripts/stylus');
const localResolve = require('./scripts/local-resolve');
const css = require('rollup-plugin-css-only');
const svgo = require('./scripts/svgo');
const { string } = require('rollup-plugin-string');

const { dependencies } = require('./package.json');

module.exports = {
  input: 'src/library.js',
  external: id => {
    if(/^\./.test(id)) return false;

    return !!dependencies[id.split('/')[0]];
  },
  sourcemap: true,
  output: {
    format: 'cjs',
    file: 'build/bundle.js',
  },
  plugins: [
    // резолвим все зависимости
    localResolve({ extensions: ['.js', '.jsx'] }),

    // включаем загрузку svg как строку
    svgo({  }),
    string({ include: '**/*.svg' }),

    // Обрабатываем стили
    stylus({ }),
    css({ output: 'build/style.css' }),
    
    // обрабатываем JS
    babel({ runtimeHelpers: true }),
  ]
};