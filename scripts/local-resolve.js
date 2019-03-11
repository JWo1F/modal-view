const { statSync } = require('fs');
const path = require('path');

module.exports = function localResolver(options) {
  if(options === undefined) options = { extensions: ['.js'] };

  return {
    resolveId(importee, importer) {
      if (!importer || importee.indexOf('./') === -1) return null;

      let where;
      let isDirectory;

      for(const ext of ['', ...options.extensions]) {
        try {
          where = path.resolve(path.dirname(importer), importee + ext);
          isDirectory = statSync(where).isDirectory();
          break;
        } catch(err) {
          where = undefined;
          isDirectory = undefined;
        }
      }

      if(!where) return null;

      for(const ext of ['', ...options.extensions]) {
        if(!isDirectory) {
          try {
            if(statSync(where + ext).isFile()) {
              return where + ext;
            }
          } catch(err) {
            // nothing
          }
        } else {
          try {
            if(statSync(path.join(where, 'index' + ext)).isFile()) {
              return path.join(where, 'index' + ext);
            }
          } catch(err) {
            // nothing
          }
        }
      }

      return null;
    },
  };
}