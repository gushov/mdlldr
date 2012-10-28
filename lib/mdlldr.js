/*jshint evil: false, bitwise:false, strict: false, undef: true, white: false, node:true */

/**
 * mdlldr parses node module bundles for browser use
 */

var fs = require('fs');
var path = require('path');
var async = require('async');
var _ = require('lil_');

function parse(modules, next) {

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

function read(filePath, name, next) {

  fs.readFile(filePath, 'utf8', function (err, moduleJs) {

    var matchRequire = /require\(['\"][^\"']+['\"]\)/g;
    var matchRequireName = /require\(['\"]([^\"']+)['\"]\)/;
    var currentPath = path.dirname(name);
    var deps = [];

    _.each(moduleJs.match(matchRequire), function (requireStatement) {

      var name = requireStatement.match(matchRequireName)[1];
      var isRelative = name.indexOf('.') !== -1;
      var resolved = isRelative ? path.join(currentPath, name) : name;
      deps.push(resolved);

    });

    next(err, moduleJs, deps);

  });

}

function load(names, modulePath, overrides, next) {

  var loaded = {};
  var modules = [];

  var q = async.queue(function (task, done) {

    var name = task.replace('.js', '');
    var filePath = path.join(modulePath, name + '.js');

    if (loaded[name] || overrides[name]) {
      return done();
    }

    read(filePath, name, function (err, moduleJs, deps) {

        q.push(deps);
        loaded[name] = true;
        modules.unshift({ name: name, js: moduleJs });
        return done();

    });

  }, 1);

  q.drain = function () {
    parse(modules, next);
  };

  q.push(names);

}

module.exports = {

  run: function (moduleNames, modulePath, overrides, next) {

    load(moduleNames, modulePath, overrides, function (err, modulesJs) {

      if (err) { return next(err); }
      next(err, modulesJs);

    });

  },

  write: function (mount, jsString, done) {
    fs.writeFile(mount, jsString, 'utf8', done);
  }

};
