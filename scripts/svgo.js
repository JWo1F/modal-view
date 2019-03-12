const Svgo = require('svgo');
const { createFilter } = require('rollup-pluginutils');

module.exports = function(options) {
  if(options === undefined) options = {};

  const filter = createFilter('**/*.svg');
  const plugins = [{ removeViewBox: false }];
  const svgo = new Svgo({ plugins });

  return {
    async transform(code, id) {
      if(!filter(id)) return null;

      const result = await svgo.optimize(code, { path: id });

      return {
        code: result.data,
        id,
        map: {
          mappings: ''
        }
      };
    }
  };
};