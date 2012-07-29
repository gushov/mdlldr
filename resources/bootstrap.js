/*jshint bitwise:true, eqeqeq:true, undef:true, browser:true */

(function (ctx) {

  "use strict";

  var defined = {};
  var exported = {};

  /*_OVERRIDES_*/

  function resolve(from, name) {

    if (name.indexOf('.') === -1) {
      return name;
    }

    name = name.split('/');
    from = from ? from.split('/') : [];
    from.pop();

    if (name[0] === '.') {
      name.shift();
    }

    while(name[0] === '..') {
      name.shift();
      from.pop();
    }

    return from.concat(name).join('/');

  }

  function require(path, name) {

    var exports, module;
    name = name ? resolve(path, name) : path;

    if (exported[name]) {
      return exported[name];
    } else {
      exports = exported[name] = {};
      module = { exports: exports };
      defined[name](require.bind(null, name), module, exports);
      return (exported[name] = module.exports);
    }

  }

  function _define(name, fn) {
    defined[name] = fn;
  }

  /*_WRAPPED_MODULES_*/

  ctx.mdlldr = require;

}(this));
