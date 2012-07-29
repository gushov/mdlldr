/*jshint evil: false, bitwise:false, strict: false, undef: true, white: false, node:true */

var modC = require('../modC');
var modL = require('../../packD/modL');

module.exports = {
  id: 'm',
  mama: function () {
    return 's' + modC.mama() + modL.yo();
  }
};
