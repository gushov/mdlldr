/*jshint bitwise:true, eqeqeq:true, undef:true, browser:true */

(function (namespace) {

  "use strict";

  var exported = namespace || {};

  /*{{OVERRIDES}}*/

  function require(name) {
    return exported[name];
  }

  function _define(name, fn) {
    var module = { exports: {} };
    var exports = module.exports;
    fn(module, exports);
    exported[name] = module.exports;
  }

    _define('sayer', function (module, exports) {

        exports.say = function (msg) {
            $('#out').html(msg)
        };

    });

    _define('Facade', function (module, exports) {

        var sayer = require('sayer');

        module.exports = function (msg) {
            return {
                buzz: function () {
                    sayer.say(msg + 'zzzzz');
                }
            };
        };

    });

}(/*{{NAMESPACE}}*/));
