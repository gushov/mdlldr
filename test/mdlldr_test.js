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

    var moduleNames = ['modA'];
    var modulePath = path.join(__dirname, '/fixtures');

    var myObj = {
      id: 'myobj',
      hi: function () {
        return 'hi';
      }
    };

    mdlldr.run(moduleNames, modulePath, {'myMod': 'myObj'}, function (err, js) {

      if (err) { throw new Error(err); }
      eval(js);

      var modA = this.mdlldr('modA');
      var modB = this.mdlldr('modB');
      var modC = this.mdlldr('packC/modC');
      var modD = this.mdlldr('packD/modD');
      var modE = this.mdlldr('packD/modE');
      var modM = this.mdlldr('packC/packM/modM');
      var modL = this.mdlldr('packD/modL');

      test.equal(modA.id, 'a');
      test.equal(modB.id, 'b');
      test.equal(modC.id, 'c');
      test.equal(modD.id, 'd');
      test.equal(modE.id, 'e');
      test.equal(modM.id, 'm');
      test.equal(modL.id, 'l');
      test.equal(modA.yo(), 'mamamamasmamaslhimamamamasmamaslhi');
      test.equal(modB.yo(), 'mamamamasmamaslhi');

      test.done();

    });

  }

};
