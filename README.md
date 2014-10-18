#primesieve

A compact (bitfield) primesieve in JavaScript together with all the functions to use it

##Author(s)
Christoph Zurnieden <czurnieden@gmx.de>

##Installation

```shell
$ git clone https://github.com/czurnieden/primesieve.git
$ cd primesieve
$ npm install -g
```
There is also a Unix (or newer Macs) dependant CLI version in `./bin` which
gets not installed by default, yet.

##Version

0.0.1 Initial publication

##Description

This library implements a primesieve with a bitfield in an `UInt32Array` (or a
normal `Array` if `UInt32Array` is not available). That means that the memory
used is about the size of the biggest prime evaluated. E.g.: if the highest
prime evaluated is `7927` the memory used is about `ceil(7927/32)*8 = 1984`
bytes large.

That is only an approximation because EMAScript offers no direct memory control.

The largest prime available would be at least `2147483647` on a 32-bit systems
and a wee bit more on 64-bit systems but no guarantee for the latter.

Please be aware that **that** sieve would be 2 gigabytes large.

Further optimizations can be done by ignoring all even numbers (except the even
primes), maybe all multiples of 3, too. If you need such large sieves regularily
and in JavaScript: feel free to ask the author.

##Usage

The usage is like with any other node/browser modul:
```javascript
var sieve = require('primesieve');
var array_of_first_five_primes = sieve.primes(5);
```

This programm offers ten functions which are in alphabetical order:

<dl>
<dt>`fill(amount)` </dt>
<dd>
Build a prime sieve up to the amount `amount`. Allows for skipping of the
automated adapting of the sieve-size if `amount` is chosen high enough.

Returns:  `undefined` in case of an error

See also: `grow(amount)`
</dd>
<dt>`grow(amount)` </dt>
<dd>
Grows the prime sieve by the amount `amount`. It just builds a new primesieve with
a different limit (if higher then the already existing limit) for now. Mostly
used internally.

Returns:  `undefined` in case of an error

See also: `fill(amount)`
</dd>
<dt>`isSmallPrime(number)` </dt>
<dd>
Tests if `number` is a prime. Automatically builds a sieve if `number` is larger
then the existing sieve.

Returns: `true` or `false` if `number` is a prime or not, respectively or
`undefined` in case of an error.

See also: `Primesieve.raiseLimit(limit)`
</dd>

</dd>
<dt>`nextPrime(number)` </dt>
<dd>
Searches for the nearest prime larger than `number`. Automatically builds a
sieve if `number` is larger then the existing sieve.

Returns: `Number` or `undefined` in case of an error
</dd>

<dt>`precPrime(number)` </dt>
<dd>
Searches for the nearest prime smaller than `number`. Does **not** automatically
build a sieve if `number` is larger then the existing sieve. Should it?

Returns: *Number` or `undefined` in case of an error
</dd>


<dt>`primePiApprox(number)` </dt>
<dd>
The approximated result (upper bound) of the prime counting function for
`number`

Returns: `Number` or `undefined` in case of an error
</dd>

<dt>`primePi(number)` </dt>
<dd>
The exact result of the prime counting function for `number`.  Automatically
builds a sieve if `number` is larger then the existing sieve.

Returns: `Number` or `undefined` in case of an error
</dd>

<dt>`primeRange(low,high)` </dt>
<dd>
Calculates the range of primes between `low` and `high`. It will detect if 
`low` and `high` are reversed and reruns itself with the arguments reversed.
Automatically builds a sieve if `number` is larger then the existing sieve.

Returns: `Array` or `undefined` in case of an error
</dd>
<dt>`primes(number)` </dt>
<dd>
Calculates primes up to and including `number`. Automatically builds a sieve if
`number` is larger then the existing sieve.

Returns: `Array` or `undefined` in case of an error
</dd>
<dt>`raiseLimit(number)` </dt>
<dd>
This module `primesieve` has a limit for the maximum size for the automatic
sieve building. It is pre-defined at `0x800000` which is one megabyte. This
function can raise it.

Returns: `undefined` in case of an error
</dd>

<dt>`sterror()` </dt>
<dd>
An error number to string conversion. The following errors are used:
<ol>
<li>"Success"</li>
<li>"Argument not an integer"</li>
<li>"Argument too low"</li>
<li>"Argument too high"</li>
<li>"Prime wanted is higher than the limit"</li>
<li>"Unknown error"</li>
</ol>
The numbers of the list correspond to the error numbers.

Returns: `String`

See also: `error`
</dd>
<dt>`error` </dt>
<dd>
Variable holding the error number. For a table of errors see `strerror()`
</dd>
</dl>

##Example

With `node.js`

```javascript
var p = require('primesieve');
function primorial(n,result){
  var primes, ret, primepi;

  // checks of arguments ommitted for brevity

  primepi = p.primePi(n);
  if(typeof primepi === 'undefined'){
    return p.strerror();
  }

  primes = p.primes(primepi);
  if(typeof primes === 'undefined'){
    return p.strerror();
  }

  ret = 1;
  for(var i = 0; i < primepi; i++){
    ret *= primes[i];
  }
  result[0] = ret;
  return p.strerror();
}
```

With a browser (tested in Firefox 33.0.0)

```javascript
// the modul must be included somewhere or just put on top
var p = primesieve;

function primorial(n,result){
  var primes, ret, primepi;

  // checks of arguments ommitted for brevity

  primepi = p.primePi(n);
  if(typeof primepi === 'undefined'){
    return p.strerror();
  }

  primes = p.primes(primepi);
  if(typeof primes === 'undefined'){
    return p.strerror();
  }

  ret = 1;
  for(var i = 0; i < primepi; i++){
    ret *= primes[i];
  }
  result[0] = ret;
  return p.strerror();
}
```

In a much simpler but frowned upon way:

```javascript
var primorial = eval(p.primes(8).join("*"));
```
Yes, eval is not the devil; it has its uses although not here.

##Test

A test with a `vows` script is implemented. Please run if `vows` is installed:

```shell
npm test
```

Or, if that doesn't work:
```shell
node primesieve-test.js
```

