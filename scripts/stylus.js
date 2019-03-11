const stylus = require('stylus');
const { createFilter } = require('rollup-pluginutils');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');

const postcss = require('postcss');
const pcModules = require('postcss-modules');
const pcFlexBugs = require('postcss-flexbugs-fixes');
const cssnano = require('cssnano');

module.exports = function(options) {
  if(options === undefined) options = {};
  
  const filter = createFilter(options.include || ['**/*.styl'], options.exclude);
  const cache = {};

  return {
    load(id) {
      if (cache[id]) return cache[id].css + '\n';
      return null;
    },
    resolveId(importee, importer) {
      if(cache[importee]) return importee;
      return null;
    },
    async transform(code, id) {
      if(!filter(id)) return null;

      const filename = `${id}.css`;
      let obj = cache[filename];

      if(!obj) {
        const style = stylus(code);
        const relative = path.relative(process.cwd(), id);

        style.set('filename', relative);
        style.set('sourcemap', {});
        style.define('url', resolver);

        const css = await style.render();
        obj = {};

        const pc = postcss([
          pcModules({
            getJSON: (filename, json) => obj.exportTokens = json
          }), 
          pcFlexBugs(),
          cssnano({
            preset: ['advanced', {
              normalizeWhitespace: false,
              autoprefixer: { add: true },
              zindex: false
            }]
          })
        ]);

        obj.css = (await pc.process(css, { from: id, to: filename })).css;

        cache[filename] = obj;
      }

      return {
        id: filename,
        code: `import ${JSON.stringify(filename)}; export default ${JSON.stringify(obj.exportTokens)};`,
        map: {
          mappings: ''
        }
      };
    }
  };
};

function resolver(file) {
  const url = path.resolve(path.dirname(file.filename), file.val);
  const content = fs.readFileSync(url);
  const uri = `data:${mime.lookup(url)};base64,${content.toString('base64')}`;

  return new stylus.nodes.Return(`url(${uri})`);
}