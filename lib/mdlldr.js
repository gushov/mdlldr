/*jshint evil: false, bitwise:false, strict: false, undef: true, white: false, node:true */

var fs = require('fs');
var path = require('path');
var url = require('url');

/**
 * sharemodule dynamically serves or writes static node module bundles for browser use
 * @param {String} mount Mount point to serve bundle on or write static files to
 * @param {Array} moduleNames Array of moudle names to expose to browser
 * @param {String} modulePath Root path to look for node modules in
 * @param {Object} overrides Map of module names to global browser var names ie { underscore: '_' }
 */
function sharemodule(mount, moduleNames, modulePath, overrides) {

  /**
   * Send http respone with error or js if successful
   * @param {Error} err Error object if something bad happen
   * @param {String} js The node modules and boiler plate concatenated together
   * @param {Object} res Http response object
   */
  function sendResponse(err, js, res) {

    if (err) {

      res.writeHead(500, err.message);
      res.end();

    } else {

      res.writeHead(200, {
        "Content-Type": "application/javascript",
        "Content-Length": Buffer.byteLength(js)
      });

      res.end(js);

    }

  }

  /**
   * Write js to static file at mount
   * @param {Error} err Error object if something bad happen
   * @param {String} js The node modules and boiler plate concatenated together
   * @param {Function} next Next callback function
   */
  function writeModules(err, js, next) {

    fs.writeFile(mount, js, 'utf8', function (err) {
      next(err);
    });

  }

  /**
   * Read the boilerplate file and replace the overrides
   * @param {Function} next Next callback function
   */
  function parseBoilerPlate(next) {

    //Pull in the boilerplate js that defines 'define' and 'require' in the browser
    fs.readFile(__dirname + "boilerplate.js", 'utf8', function (err, js) {

      var overrideJs = '';

      if (overrides) {

        Object.keys(overrides).forEach(function (dependency) {
          overrideJs += 'exported.' + dependency + ' = ' + overrides[dependency] + ';\n';
        });

        js = js.replace('/*{{OVERRIDES}}*/', overrideJs);

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

    var js = '';

    fs.readFile(__dirname + "wrapper.js", 'utf8', function (err, wrapper) {

      modules.forEach(function (module) {
        js += wrapper
          .replace('/*_SET_MODULE_*/', 'this.exported.' + module.name + ' = obj;\n')
          .replace('/*_MODULE_*/', module.js + '\n');
      });

      next(undefined, js);

    });

  }

  /**
   * Read module files and required module files
   * @param {Array} moduleNames An array of module names
   * @param {Function} next Next callback function
   */
  function loadModules(moduleNames, next) {

    var
      name, filePath,
      loaded = {},
      modules = [],
      matchRequire = /require\(['\"][^\"']+['\"]\)/g,
      matchRequireName = /require\(['\"]([^\"']+)['\"]\)/;

    function readModule(moduleName, cb) {

      name = moduleName.replace('.js', '');

      if (!loaded[name] && !overrides[name]) {

        filePath = path.join(modulePath, name + '.js');
        fs.readFile(filePath, 'utf8', cb);

      } else {
        cb();
      }

    }

    function moduleRead(err, moduleJs) {

      var i, requireStatements;

      //If there are errors stop
      if (err) return next(err);

      if (moduleJs) {

        //Find require statements
        requireStatements = moduleJs.match(matchRequire);

        if (requireStatements) {

          //Push required modules onto the back of the modules names array
          for (i = 0; i < requireStatements.length; i += 1) {
            moduleNames.push(requireStatements[i].match(matchRequireName)[1]);
          }

        }

        //Shift the module name and source onto the front of the array
        modules.unshift({name: name, js: moduleJs});
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

  /**
   * Run sharemodule and call next with resulting Javascript
   * @param {Function} next Next callback function
   */
  function run(next) {

    var modulesJs;

    function boilerplateParsed(err, boilerplateJs) {
      next(err, boilerplateJs + modulesJs);
    }

    function modulesLoaded(err, js) {

      //If there errors stop
      if (err) return next(err);

      modulesJs = js;
      parseBoilerPlate(boilerplateParsed);

    }

    loadModules(moduleNames.slice(0), modulesLoaded);

  }

  return {

    /**
     * Middleware to serve node modules via mount to browser
     * @param {Object} req Http request object
     * @param {Object} res Http response object
     * @param {Object} next Next callback function
     * @example app.use(sharemodule.middleware)
     */
    middleware: function (req, res, next) {

      var reqUrl = url.parse(req.url);

      //Is this request for us? if not pass through
      if (reqUrl.pathname !== mount) return next();

      run(function (err, js) {
        sendResponse(err, js, res);
      });

    },

    /**
     * Writes node modules to static bundle at mount
     * @param {Function} done Callback called when function completes
     * @example sharemodule.writeStaticFile(onDoneCallback)
     */
    writeStaticFile: function (done) {

      run(function (err, js) {
        writeModules(err, js, done);
      });

    }

  };
}

module.exports = sharemodule;
