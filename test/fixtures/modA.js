/*jshint evil: false, bitwise:false, strict: false, undef: true, white: false, node:true */

var modB = require('./modB');
var modD = require('./packD/modD');

module.exports = {
  id: 'a',
  yo: function () {
    return modD.yo();
  }
};
