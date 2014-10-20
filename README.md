#primesieve

A compact (bitfield) prime sieve in JavaScript together with all the functions to use it

##Author(s)
Christoph Zurnieden <czurnieden@gmx.de>

##Installation

```shell
$ git clone https://github.com/czurnieden/primesieve.git
$ cd primesieve
$ npm install -g
```
There is also a Unix (or newer Macs) dependent CLI version in `./bin` which
gets not installed by default, yet.

##Version

0.0.3 Corrected error in GIT url<br>
0.0.2 Additional function to get the raw prime sieve.<br>
0.0.1 Initial publication

##Description

This library implements a prime sieve with a bitfield in an `UInt32Array` (or a
normal `Array` if `UInt32Array` is not available). That means that the memory
used is about the size of the biggest prime evaluated. E.g.: if the highest
prime evaluated is `7927` the memory used is about `ceil(7927/32)*8 = 1984`
bytes large.

That is only an approximation because ECMAScript offers no direct memory control.

The largest prime available would be at least `2147483647` on a 32-bit systems
and a wee bit more on 64-bit systems but no guarantee for the latter.

Please be aware that **that** sieve would be 2 gigabytes large.

Further optimizations can be done by ignoring all even numbers (except the even
primes), maybe all multiples of 3, too. If you need such large sieves regularly
and in JavaScript: feel free to ask the author.

##Usage

The usage is like with any other node/browser module:
```javascript
var sieve = require('primesieve');
var array_of_first_five_primes = sieve.primes(5);
```

This program offers ten functions which are in alphabetical order:

<dl>
<dt><code>fill(amount)</code> </dt>
<dd>
Build a prime sieve up to the amount <code>amount</code>. Allows for skipping of the
automated adapting of the sieve-size if <code>amount</code> is chosen high enough.
<br>
Returns: <code>undefined</code> in case of an error
<br>
See also: <code>grow(amount)</code>
</dd>
<dt><code>grow(amount)</code></dt>
<dd>
Grows the prime sieve by the amount <code>amount</code>. It just builds a new prime sieve with
a different limit (if higher then the already existing limit) for now. Mostly
used internally.
<br>
Returns:  <code>undefined</code> in case of an error
<br>
See also: <code>fill(amount)</code>
</dd>
<dt><code>isSmallPrime(number)</code></dt>
<dd>
Tests if <code>number</code> is a prime. Automatically builds a sieve if <code>number</code> is larger then the existing sieve.
<br>
Returns: <code>true</code> or <code>false</code> if <code>number</code> is a prime or not, respectively or <code>undefined</code> in case of an error.
<br>
See also: <code>Primesieve.raiseLimit(limit)</code>
</dd>

</dd>
<dt><code>nextPrime(number)</code> </dt>
<dd>
Searches for the nearest prime larger than <code>number</code>. Automatically builds a
sieve if <code>number</code> is larger then the existing sieve.
<br>
Returns: <code>Number</code> or <code>undefined</code> in case of an error
</dd>

<dt><code>precPrime(number)</code></dt>
<dd>
Searches for the nearest prime smaller than <code>number</code>. Does <strong>not</strong> automatically build a sieve if <code>number</code> is larger then the existing sieve. Should it?
<br>
Returns: <code>Number</code> or <code>undefined</code> in case of an error
</dd>


<dt><code>primePiApprox(number)</code> </dt>
<dd>
The approximated result (upper bound) of the prime counting function for
<code>number</code>
<br>
Returns: <code>Number</code> or <code>undefined</code> in case of an error
</dd>

<dt><code>primePi(number)</code></dt>
<dd>
The exact result of the prime counting function for <code>number</code>. Automatically
builds a sieve if <code>number</code> is larger then the existing sieve.
<br>
Returns: <code>Number</code> or <code>undefined</code> in case of an error
</dd>

<dt><code>primeRange(low,high)</code></dt>
<dd>
Calculates the range of primes between <code>low</code> and <code>high</code>. It will detect if <code>low</code> and <code>high</code> are reversed and reruns itself with the arguments reversed.
Automatically builds a sieve if <code>number</code> is larger then the existing sieve.
<br>
Returns: <code>Array</code> or <code>undefined</code> in case of an error
</dd>
<dt><code>primes(number)</code></dt>
<dd>
Calculates primes up to and including <code>number</code>. Automatically builds a sieve if
<code>number</code> is larger then the existing sieve.
<br>
Returns: <code>Array</code> or <code>undefined</code> in case of an error
</dd>
<dt><code>raiseLimit(number)</code></dt>
<dd>
This module <code>primesieve</code> has a limit for the maximum size for the automatic
sieve building. It is pre-defined at <code>0x800000</code> which is one megabyte. This
function can raise it to the manager.
<br>
Returns: <code>undefined</code> in case of an error
</dd>
<dt><code>sieve()</code></dt>
<dd>
Get the raw prime sieve. This function is not implemented in the CLI version.
<br>
Returns: The raw prime sieve, either an `UInt32Array` or a normal `Array`
</dd>
<dt><code>sterror()</code></dt>
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
<br>
Returns: <code>String</code>
<br>
See also: <code>error</code>
</dd>
<dt><code>error</code></dt>
<dd>
Variable holding the error number. For a table of errors see <code>strerror()</code>
</dd>
</dl>

##Example

With `node.js`

```javascript
var p = require('primesieve');
function primorial(n,result){
  var primes, ret, primepi;

  // checks of arguments omitted for brevity

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
// the module must be included somewhere or just put on top
var p = primesieve;

function primorial(n,result){
  var primes, ret, primepi;

  // checks of arguments omitted for brevity

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
Yes, `eval` is not the devil; it has its uses, although not here.

##Test

A test with a <code>vows</code> script is implemented. Please run if <code>vows</code> is installed:

```shell
npm test
```

Or, if that doesn't work:
```shell
node primesieve-test.js
```

If it still doesn't work with an error raised for not finding <code>vows</code>
despite being installed--install <code>vows</code> again, this time locally, that is, without the <code>-g</code> option. The npm packet manager is a bit peculiar in this regard.

