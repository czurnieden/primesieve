var primesieve = (function() {
    "use strict";
    var Primesieve = {};
    var primelimit = 0;
    var buffer;
    var primesieve;
    var primesizelimit = 0x800000; // 1 megabyte

    // works with normal arrays, too
    if (typeof Uint32Array === 'undefined') Uint32Array = Array;

    // 30*log(113)/113 see also http://oeis.org/A209883
    var LN_113 = 1.25505871293247979696870747618124469168920275806274;
    // Rosser, J. B. and Schoenfeld, L. "Approximate Formulas for Some
    // Functions of Prime Numbers." Illinois J. Math. 6, 64-97, 1962
    // http://projecteuclid.org/DPubS?service=UI&version=1.0&verb=Display&handle=euclid.ijm/1255631807
    var approx_pi = function(limit){
        // Math.ceil(5*x/(4*Math.log(x))) // would be more exact for large x
        return Math.ceil( (LN_113 * limit) / Math.log(limit) ) + 2;
    };
    var approx_limit = function(prime_pi){
        if(prime_pi < 10){
          return 30;
        }
        // see first term of expansion of li(x)-li(2)
        return Math.ceil( prime_pi * ( Math.log( prime_pi * Math.log( prime_pi))));
    };
    var isInt = function(x) {
        if (isNaN(x)) {
            return false;
        }
        if (x > -9007199254740992 && x < 9007199254740992 && Math.floor(
                x) == x) {
            return true;
        }
    };
    var clear = function(where) {
        primesieve[where >>> 5] &= ~((1 << (31 - (where & 31))) );
    };
    var get = function(where) {
        return ((primesieve[where >>> 5] >>> ((31 - (where & 31)))) & 1);
    };
    var nextset = function(from) {
        while (from < primelimit && !get(from)) {
            from++;
        }
        if (from === primelimit && !get(from)) {
            return -1;
        }
        return from;
    };
    var prevset = function(from) {
        while (from >= 0 && !get(from)) {
            from--;
        }
        if (from == 0 && !get(from)) {
            return -1;
        }
        return from;
    };
    var fillsieve = function(n) {
        var k, r, j;
        n = n + 1;
        primelimit = n - 1;
        k = Math.ceil(n / 32);
        buffer = new ArrayBuffer(k * 4);
        primesieve = new Uint32Array(buffer);
        while (k--) {
            primesieve[k] = 0xffffffff;
        }
        clear(0);
        clear(1);
        for (k = 4; k < n; k += 2) {
            clear(k);
        }
        r = Math.floor(Math.sqrt(n));
        k = 0;
        while (k < n) {
            k = nextset(k + 1);
            if (k > r || k < 0) {
                break;
            }
            for (j = k * k; j < n; j += 2 * k) {
                clear(j);
            }
        }
    };
    var E_SUCCESS = 0;
    var E_ARG_NO_INT = 1;
    var E_ARG_TOO_LOW = 2;
    var E_ARG_TOO_HIGH = 3;
    var E_ABOVE_LIMIT = 4;
    Primesieve.error = 0;
    Primesieve.strerror = function(){
        var strerrors = [
            "Success",
            "Argument not an integer",
            "Argument too low",
            "Argument too high",
            "Prime wanted is higher than the limit ",
            "Unknown error"
                        ];
        var e = Primesieve.error;
        if(e == 0){
            return strerrors[ 0 ];
        }
        if(e < 0 || e > strerrors.length - 1){
            return strerrors[ strerrors.length - 1 ];
        }
        if(e == E_ABOVE_LIMIT){
            return strerrors[ E_ABOVE_LIMIT ] + primesizelimit;
        } else {
            return strerrors[e];
        }
    };
    Primesieve.isSmallPrime = function(prime) {
        if (!isInt(prime)) {
            Primesieve.error = E_ARG_NO_INT;
            return undefined;
        } else if (prime < 2 ) {
            Primesieve.error = E_ARG_TOO_LOW;
            return undefined;
        }
        if (prime > primelimit) {
            Primesieve.grow(prime + 100);
            if(Primesieve.error ==  E_ABOVE_LIMIT){
                return undefined;
            }
        }
        Primesieve.error = E_SUCCESS;
        if (get(prime) == 1) {
            return true;
        }
        return false;
    };
    Primesieve.nextPrime = function(prime) {
        if (!isInt(prime)) {
            Primesieve.error = E_ARG_NO_INT;
            return undefined;
        }
        if (prime < 0) {
            return 2;
        }
        if (prime > primelimit) {
            Primesieve.grow(prime + 100);
            if(Primesieve.error ==  E_ABOVE_LIMIT){
                return undefined;
            }
        }
        Primesieve.error = E_SUCCESS;
        return nextset(prime);
    };
    Primesieve.precPrime = function(prime) {
        if (!isInt(prime)) {
            Primesieve.error = E_ARG_NO_INT;
            return undefined;
        } else if (prime < 2 ) {
            Primesieve.error = E_ARG_TOO_LOW;
            return undefined;
        }
        Primesieve.error = E_SUCCESS;
        return prevset(prime);
    };
    Primesieve.primePi = function(prime) {
        var k = 0;
        var ct = 0;

        if (!isInt(prime)) {
            Primesieve.error = E_ARG_NO_INT;
            return undefined;
        } else if (prime < 2 ) {
            Primesieve.error = E_ARG_TOO_LOW;
            return undefined;
        }

        if (prime > primelimit) {
            Primesieve.grow(prime + 100);
            if(Primesieve.error ==  E_ABOVE_LIMIT){
                return undefined;
            }
        }
        while (k < prime) {
            k = nextset(k + 1);
            if (k > primelimit || k < 0 || k > prime) {
                break;
            }
            ct++;
        }
        Primesieve.error = E_SUCCESS;
        return ct;
    };
    Primesieve.primePiApprox = function(prime) {
        if (!isInt(prime)) {
            Primesieve.error = E_ARG_NO_INT;
            return undefined;
        } else if (prime < 2 ) {
            Primesieve.error = E_ARG_TOO_LOW;
            return undefined;
        }
        Primesieve.error = E_SUCCESS;
        return approx_pi(prime);
    };
    Primesieve.primeRange = function(low, high) {
        var down = 0,
            up = 0,
            ret = [],
            i = 1;

        if (!isInt(low) || !isInt(high)) {
            Primesieve.error = E_ARG_NO_INT;
            return undefined;
        } else if (low < 0 ) {
            Primesieve.error = E_ARG_TOO_LOW;
            return undefined;
        } else if ( low > high ) {
            /* try again, maybe just a fluke */
            return Primesieve.primeRange(high,low);
        }

        if(primelimit < high){
             Primesieve.grow(high + 100);
            if(Primesieve.error ==  E_ABOVE_LIMIT){
                return undefined;
            }
        }
        down = nextset(low);
        up = prevset(high);
        ret[0] = down;
        if (down == up) {
            return ret;
        }
        while (down < up) {
            down = nextset(down + 1);
            if (down > high || down < 0) {
                break;
            }
            ret[i++] = down;
        }
        Primesieve.error = E_SUCCESS;
        return ret;
    };
    Primesieve.primes = function(prime) {
        var ret, k, count, limit,i;
        limit = approx_limit(prime);

        if (!isInt(prime)) {
            Primesieve.error = E_ARG_NO_INT;
            return undefined;
        } else if (prime < 2) {
            Primesieve.error = E_ARG_TOO_LOW;
            return undefined;
        }

        if(primelimit < limit){
            Primesieve.grow(limit);
            if(Primesieve.error ==  E_ABOVE_LIMIT){
                return undefined;
            }
        }
        ret = [];
        k = 0;
        i = 0;
        count = prime;
        while (count--) {
            k = nextset(k + 1);
            if (k > primelimit || k < 0) {
                break;
            }
            ret[i++] = k;
        }
        Primesieve.error = E_SUCCESS;
        return ret;
    };
    Primesieve.grow = function(alot) {
        if (!isInt(alot)) {
            Primesieve.error = E_ARG_NO_INT;
            return undefined;
        } else if (alot < 2) {
            Primesieve.error = E_ARG_TOO_LOW;
            return undefined;
        } else if (alot > primesizelimit) {
            Primesieve.error = E_ABOVE_LIMIT;
            return undefined;
        } else if(alot > primelimit){
            Primesieve.error = E_SUCCESS;
            fillsieve(alot);
        } /* else {
           Do nothing for now
        }*/
    };
    Primesieve.fill = Primesieve.grow;
    Primesieve.raiseLimit = function(raise) {
        if (!isInt(raise)) {
            Primesieve.error = E_ARG_NO_INT;
            return undefined;
        } else if (raise < 2) {
            Primesieve.error = E_ARG_TOO_LOW;
            return undefined;
        } else if (raise > primesizelimit) {
            Primesieve.error = E_SUCCESS;
            primesizelimit = raise;
        }
    };
    return Primesieve;
})(/* You may place a start-size here */);

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = primesieve;
} else {
    if (typeof define === 'function' && define.amd) {
        define([], function() { return primesieve; });
    } else {
        window.primesieve = primesieve;
    }
}
