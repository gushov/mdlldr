/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, browser:true, node:true */
/*global assert, refute */

var buster = require("buster");
var fs = require('fs');
var path = require('path');
var mdlldr = require('../lib/mdlldr');

buster.testCase("mdlldr", {

  "should do something": function (done) {

    var moduleNames = ['modA'];
    var modulePath = path.join(__dirname, '/fixtures');

    var myObj = {
      id: 'myobj',
      hi: function () {
        return 'hi';
      }
    };

    var loaded = path.join(modulePath, '/loaded.js');
    var loadedJs = fs.readFileSync(loaded, 'utf8');

    mdlldr(moduleNames, modulePath, {'myMod': 'myObj'}, function (err, js) {
      
      if (err) { throw new Error(err); }
      assert.equals(js, loadedJs);
      done();

    });

  }

});