/*jshint bitwise:true, eqeqeq:true, undef:true, browser:true */

(function (context) {

  "use strict";

  var exported = {};

  /*_OVERRIDES_*/

  var require = context.mdlldr = function(name) {
    return exported[name];
  };

  function _define(name, fn) {
    var module = { exports: {} };
    var exports = module.exports;
    fn(module, exports);
    exported[name] = module.exports;
  }

  /*_WRAPPED_MODULES_*/

}(this));
