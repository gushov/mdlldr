/*jshint evil: false, bitwise:false, strict: false, undef: true, white: false, node:true */

var modC = require('./modC');

module.exports = {
  id: 'd',
  yo: function () {
    return modC.mama();
  }
};
