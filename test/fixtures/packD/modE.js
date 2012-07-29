/*jshint evil: false, bitwise:false, strict: false, undef: true, white: false, node:true */

var modC = require('../packC/modC');
var modM = require('../packC/packM/modM');

module.exports = {
  id: 'e',
  mama: function () {
    return 'mama' + modC.mama() + modM.mama();
  }
};
