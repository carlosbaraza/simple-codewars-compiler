# Simple compiler for CodeWars kata

I took some time off work and I decided to find some non-work related
challenge. [This Codewars kata](https://www.codewars.com/kata/5265b0885fda8eac5900093b) was an interesting challenge, because
I had never written a compiler.

Learning about Parse trees and ASTs was interesting. I recommend anyone
passionate about coding to try this challenge out.

# Pass 1

Build a Parse tree and AST in one pass.

# Pass 2

Simplify AST reducing constant expressions

# Pass 3

Compile down to a simple machine code.

# Machine simulator

All the compiled code would be run against the following machine:

```javascript
// "IM n"     // load the constant value n into R0
// "AR n"     // load the n-th input argument into R0
// "SW"       // swap R0 and R1
// "PU"       // push R0 onto the stack
// "PO"       // pop the top value off of the stack into R0
// "AD"       // add R1 to R0 and put the result in R0
// "SU"       // subtract R1 from R0 and put the result in R0
// "MU"       // multiply R0 by R1 and put the result in R0
// "DI"       // divide R0 by R1 and put the result in R0

function simulate(asm, args) {
  var r0 = undefined;
  var r1 = undefined;
  var stack = [];
  asm.forEach(function(instruct) {
    var match = instruct.match(/(IM|AR)\s+(\d+)/) || [0, instruct, 0];
    var ins = match[1];
    var n = match[2] | 0;

    if (ins == "IM") {
      r0 = n;
    } else if (ins == "AR") {
      r0 = args[n];
    } else if (ins == "SW") {
      var tmp = r0;
      r0 = r1;
      r1 = tmp;
    } else if (ins == "PU") {
      stack.push(r0);
    } else if (ins == "PO") {
      r0 = stack.pop();
    } else if (ins == "AD") {
      r0 += r1;
    } else if (ins == "SU") {
      r0 -= r1;
    } else if (ins == "MU") {
      r0 *= r1;
    } else if (ins == "DI") {
      r0 /= r1;
    }
  });
  return r0;
}

module.exports = { simulate };
```
