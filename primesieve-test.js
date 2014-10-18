var vows = require('vows');
var assert = require('assert');

var p = require('./primesieve');

vows.describe('Primesieve').addBatch({
    'Primes': {
        topic: p.primes(100),

        ' a hundred': function (primes) {
            assert.equal (primes.length, 100);
        },
        'the first': function (primes) {
            assert.equal (primes[0],2);
        },
        'the last': function (primes) {
            assert.equal (primes[primes.length-1],541);
        }
    },
    'Prime range': {
        topic: p.primeRange(50,100),

        'between 50 and 100 ': function (primes) {
            assert.equal (primes.length, 10);
        },
        'the first': function (primes) {
            assert.equal (primes[0],53);
        },
        'the last': function (primes) {
            assert.equal (primes[primes.length-1],97);
        }
    },
    'Prime test 1': {
        topic: p.isSmallPrime(311),

        'is 311 prime': function (primes) {
            assert.isTrue(primes);
        }
    },
   'Prime test 2': {
        topic: p.isSmallPrime(312),
        'is 312 prime': function (primes) {
            assert.isFalse (primes);
        }
    },
   'Next prime': {
        topic: p.nextPrime(500),
        'after 500 ': function (primes) {
            assert.equal (primes,503);
        }
    },
   'Preceding  prime': {
        topic: p.precPrime(500),
        'before 500 ': function (primes) {
            assert.equal (primes,499);
        }
    },
   'Prime pi(n)': {
        topic: p.primePi(1001),
        'Number of primes up to 1001': function (primes) {
            assert.equal (primes,168);
        }
    },
   'Prime primePiApprox(n)': {
        topic: p.primePiApprox(1001),
        'Number of primes up to 1001, approximated': function (primes) {
            assert.equal (primes,184);
        }
    },
   'No error': {
        topic: p.strerror(),
        'should be free of errors': function (primes) {
            assert.equal (primes,'Success');
        }
    },
   'Error: argument too low': {
        topic: (function(){p.primes(-1);return p.strerror();})(),
        'p.primes(-1)': function (primes) {
            assert.equal (primes,'Argument too low');
        }
    },
   'Error: argument higher than safety limit': {
        topic: (function(){p.primePi(0x800001);return p.strerror();})(),
        'p.grow(0x800001)': function (primes) {
            assert.equal (primes,'Prime wanted is higher than the limit 8388608');
        }
    },
   'Error: argument not an integer': {
        topic:  (function(){p.primePi(123.321);return p.strerror();})(),
        'p.primePi(123.321)': function (primes) {
            assert.equal (p.strerror(),'Argument not an integer');
        }
    }
}).export(module);
