/*jshint evil: false, bitwise:false, strict: false, undef: true, white: false, node:true */

/**
 * mdlldr parses node module bundles for browser use
 */

var fs = require('fs');
var path = require('path');

  /**
   * Read the bootstrap file and replace the overrides
   * @param {Object} overrides Map of module names to global browser var names ie { underscore: '_' }
   * @param {Function} next Next callback function
   */
  function parseBootstrap(overrides, next) {

    var bootstrapPath = path.join(__dirname, '../resources', '/bootstrap.js');

    //Pull in the bootstrap js that defines 'define' and 'require' in the browser
    fs.readFile(bootstrapPath, 'utf8', function (err, js) {

      var overrideJs = '';

      if (overrides) {

        Object.keys(overrides).forEach(function (dependency) {
          overrideJs += 'exported.' + dependency + ' = ' + overrides[dependency] + ';\n';
        });

        js = js.replace('/*_OVERRIDES_*/', overrideJs);

      }

      next(err, js);

    });

  }

  /**
   * Parse node modules into AMD style defines
   * @param {Array} modules Array of objects with node name and node js
   * @param {Function} next Next callback function
   */
  function parseModules(modules, next) {

    var wrapperPath = path.join(__dirname, '../resources', '/wrapper.js');
    var js = '';

    fs.readFile(wrapperPath, 'utf8', function (err, wrapper) {

      modules.forEach(function (module) {
        js += wrapper
          .replace('/*_MODULE_NAME_*/', module.name)
          .replace('/*_MODULE_JS_*/', module.js);
      });

      next(null, js);

    });

  }

  /**
   * Read module files and required module files
   * @param {Array} moduleNames An array of module names
   * @param {String} modulePath Root path to look for node modules in
   * @param {Object} overrides Map of module names to global browser var names ie { underscore: '_' }
   * @param {Function} next Next callback function
   */
  function loadModules(moduleNames, modulePath, overrides, next) {


    var name, filePath;
    var loaded = {};
    var modules = [];
    var matchRequire = /require\(['\"][^\"']+['\"]\)/g;
    var matchRequireName = /require\(['\"]([^\"']+)['\"]\)/;

    function readModule(moduleName, cb) {

      name = moduleName.replace('.js', '');

      if (!loaded[name] && !overrides[name]) {

        filePath = path.join(modulePath, name + '.js');

        fs.readFile(filePath, 'utf8', function (err, moduleJs) {
          cb(err, moduleJs, path.dirname(name));
        });

      } else {
        cb();
      }

    }

    function moduleRead(err, moduleJs, currentPath) {

      var i, requireStatements, requireName, resolvedName;

      //If there are errors stop
      if (err) { return next(err); }

      if (moduleJs) {

        //Find require statements
        requireStatements = moduleJs.match(matchRequire);

        if (requireStatements) {

          //Push required modules onto the back of the modules names array
          for (i = 0; i < requireStatements.length; i += 1) {
            requireName = requireStatements[i].match(matchRequireName)[1];
            resolvedName = requireName.indexOf('.') !== -1 ?
              path.join(currentPath, requireName) : requireName;
            moduleNames.push(resolvedName);
          }

        }

        //Shift the module name and source onto the front of the array
        modules.unshift({ name: name, js: moduleJs });
        loaded[name] = true;

      }

      //If there are more modules keep reading otherwise we are done
      if (moduleNames.length > 0) {
        readModule(moduleNames.shift(), moduleRead);
      } else {
        parseModules(modules, next);
      }
    }

    readModule(moduleNames.shift(), moduleRead);

  }


module.exports = {

  /**
   * Run sharemodule and call next with resulting Javascript
   * @param {Array} moduleNames Array of moudle names to expose to browser
   * @param {String} modulePath Root path to look for node modules in
   * @param {Object} config Configuration Object
   * @param {Object} overrides Map of module names to global browser var names ie { underscore: '_' }
   * @param {Function} next Next callback function
   */
  run: function (moduleNames, modulePath, overrides, next) {

    var modulesJs;

    function bootstrapParsed(err, bootstrapJs) {
      next(err, bootstrapJs.replace('/*_WRAPPED_MODULES_*/', modulesJs));
    }

    function modulesLoaded(err, js) {

      //If there errors stop
      if (err) { return next(err); }

      modulesJs = js;
      parseBootstrap(overrides, bootstrapParsed);

    }

    loadModules(moduleNames, modulePath, overrides, modulesLoaded);

  },

  /**
   * Writes node modules to static bundle at mount
   * @param {String} mount Mount point to serve bundle on or write static files to
   * @param {String} jsString Stringified js
   * @param {Function} done Callback called when function completes
   * @example mdlldr.write(mount, jsString, done)
   */
  write: function (mount, jsString, done) {

    fs.writeFile(mount, jsString, 'utf8', function (err) {
      done(err);
    });

  }

};
