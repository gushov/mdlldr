/*jshint evil: true, bitwise:false, strict: false, undef: true, white: false, node:true */

var sinon = require('sinon');
var path = require('path');
var mdlldr = require('../lib/mdlldr');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['test mdlldr'] = {

  setUp: function(done) {
    done();
  },

  tearDown: function(done) {
    done();
  },

  'test load modules': function(test) {

    console.log(' test', __dirname);

    var moduleNames = ['modA'];
    var modulePath = path.join(__dirname, '/fixtures');

    mdlldr.run(moduleNames, modulePath, {}, function (err, js) {
      console.log('js', err, js);
      eval(js);
      //var modA = this.mdlldr('modA');
      //console.log('modA', modA);
      test.done();
    });

    //test.equal(mgo.eats, 'mongobites');
    //test.equal(mgo.treats, 'nonnon');
  }

};
