var sinon = require('sinon');
var sharemodule = require('../lib/mdlldr');

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

exports['test model'] = {

  setUp: function(done) {
    done();
  },

  tearDown: function(done) {
    done();
  },

  'create model': function(test) {

    var mongo = lilmodel.model({
      eats: 'mongobites',
      treats: 'nonnon'
    });

    var mgo = mongo.create();

    test.equal(mgo.eats, 'mongobites');
    test.equal(mgo.treats, 'nonnon');

    test.done();
  }

};
