provide('packD/modL', function (require, module, exports) {

/*jshint evil: false, bitwise:false, strict: false, undef: true, white: false, node:true */

var myMod = require('myMod');

module.exports = {};

}, true);
provide('packC/packM/modM', function (require, module, exports) {

/*jshint evil: false, bitwise:false, strict: false, undef: true, white: false, node:true */

var modC = require('../modC');
var modL = require('../../packD/modL');

module.exports = {};

}, true);
provide('packC/modC', function (require, module, exports) {

/*jshint evil: false, bitwise:false, strict: false, undef: true, white: false, node:true */

module.exports = {};

}, true);
provide('packD/modE', function (require, module, exports) {

/*jshint evil: false, bitwise:false, strict: false, undef: true, white: false, node:true */

var modC = require('../packC/modC');
var modM = require('../packC/packM/modM');

module.exports = {};

}, true);
provide('packD/modD', function (require, module, exports) {

/*jshint evil: false, bitwise:false, strict: false, undef: true, white: false, node:true */

var modE = require('./modE');

module.exports = {};

}, true);
provide('modB', function (require, module, exports) {

/*jshint evil: false, bitwise:false, strict: false, undef: true, white: false, node:true */

var modD = require('./packD/modD');

module.exports = {};

}, true);
provide('modA', function (require, module, exports) {

/*jshint evil: false, bitwise:false, strict: false, undef: true, white: false, node:true */

var modB = require('./modB');
var modD = require('./packD/modD');

module.exports = {};

}, true);
