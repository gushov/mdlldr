/*jshint evil: false, bitwise:false, strict: false, undef: true, white: false, node:true */

var myMod = require('myMod');

module.exports = {
  id: 'l',
  yo: function () {
    return 's' + this.id + myMod.hi();
  }
};
