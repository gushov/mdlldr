/*jshint evil: false, bitwise:false, strict: false, undef: true, white: false, node:true */

var modD = require('./packD/modD');

module.exports = {
  id: 'b',
  yo: function () {
    return modD.yo();
  }
};
