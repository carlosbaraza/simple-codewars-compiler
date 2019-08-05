const { simulate } = require("./simulate");
const { Compiler } = require("./index");

describe("compiler", () => {
  describe("pass1", () => {
    it("example 1", () => {
      var prog = "[ x y z ] ( 2 * 3 * x + 5*y - 3*z ) / (1 + 3 + 2*2)";
      var expectedResult = {
        op: "/",
        a: {
          op: "-",
          a: {
            op: "+",
            a: {
              op: "*",
              a: { op: "*", a: { op: "imm", n: 2 }, b: { op: "imm", n: 3 } },
              b: { op: "arg", n: 0 }
            },
            b: { op: "*", a: { op: "imm", n: 5 }, b: { op: "arg", n: 1 } }
          },
          b: { op: "*", a: { op: "imm", n: 3 }, b: { op: "arg", n: 2 } }
        },
        b: {
          op: "+",
          a: { op: "+", a: { op: "imm", n: 1 }, b: { op: "imm", n: 3 } },
          b: { op: "*", a: { op: "imm", n: 2 }, b: { op: "imm", n: 2 } }
        }
      };
      var compiler = new Compiler();
      var result = compiler.pass1(prog);

      expect(result).toEqual(expectedResult);
    });

    it("example 2", () => {
      var prog = "[ x y ] ( x * y ) / 2";
      var expectedAst = {
        op: "/",
        a: { op: "*", a: { op: "arg", n: 0 }, b: { op: "arg", n: 1 } },
        b: { op: "imm", n: 2 }
      };
      var compiler = new Compiler();
      var ast = compiler.pass1(prog);

      expect(ast).toEqual(expectedAst);
    });

    it("example 3", () => {
      var prog = "[ x ] x / 2";
      var expectedAst = {
        op: "/",
        a: { op: "arg", n: 0 },
        b: { op: "imm", n: 2 }
      };
      var compiler = new Compiler();
      var ast = compiler.pass1(prog);

      expect(ast).toEqual(expectedAst);
    });

    it("example 4", () => {
      var prog = "[ x y ] ( x + y * 2 ) / 2";
      var expectedAst = {
        op: "/",
        a: {
          op: "+",
          a: { op: "arg", n: 0 },
          b: { op: "*", a: { op: "arg", n: 1 }, b: { op: "imm", n: 2 } }
        },
        b: { op: "imm", n: 2 }
      };
      var compiler = new Compiler();
      var ast = compiler.pass1(prog);

      expect(ast).toEqual(expectedAst);
    });

    it("example 5", () => {
      var prog = "[ x y z ] 2 * 3 * x + 5*y - 3*z";
      var expectedResult = {
        op: "-",
        a: {
          op: "+",
          a: {
            op: "*",
            a: { op: "*", a: { op: "imm", n: 2 }, b: { op: "imm", n: 3 } },
            b: { op: "arg", n: 0 }
          },
          b: { op: "*", a: { op: "imm", n: 5 }, b: { op: "arg", n: 1 } }
        },
        b: { op: "*", a: { op: "imm", n: 3 }, b: { op: "arg", n: 2 } }
      };
      var compiler = new Compiler();
      var result = compiler.pass1(prog);

      expect(result).toEqual(expectedResult);
    });
  });

  describe("pass2", () => {
    it("example 1", () => {
      var prog = "[ x y z ] ( 2 * 3 * x + 5*y - 3*z ) / (1 + 3 + 2*2)";
      var expectedResult = {
        op: "/",
        a: {
          op: "-",
          a: {
            op: "+",
            a: { op: "*", a: { op: "imm", n: 6 }, b: { op: "arg", n: 0 } },
            b: { op: "*", a: { op: "imm", n: 5 }, b: { op: "arg", n: 1 } }
          },
          b: { op: "*", a: { op: "imm", n: 3 }, b: { op: "arg", n: 2 } }
        },
        b: { op: "imm", n: 8 }
      };
      var compiler = new Compiler();
      var pass1Result = compiler.pass1(prog);
      var pass2Result = compiler.pass2(pass1Result);

      expect(pass2Result).toEqual(expectedResult);
    });
  });
});

// var prog = '[ x y z ] ( 2 * 3 * x + 5*y - 3*z ) / (1 + 3 + 2*2)';
// var t1 = JSON.stringify({"op":"/","a":{"op":"-","a":{"op":"+","a":{"op":"*","a":{"op":"*","a":{"op":"imm","n":2},"b":{"op":"imm","n":3}},"b":{"op":"arg","n":0}},"b":{"op":"*","a":{"op":"imm","n":5},"b":{"op":"arg","n":1}}},"b":{"op":"*","a":{"op":"imm","n":3},"b":{"op":"arg","n":2}}},"b":{"op":"+","a":{"op":"+","a":{"op":"imm","n":1},"b":{"op":"imm","n":3}},"b":{"op":"*","a":{"op":"imm","n":2},"b":{"op":"imm","n":2}}}});
// var t2 = JSON.stringify({"op":"/","a":{"op":"-","a":{"op":"+","a":{"op":"*","a":{"op":"imm","n":6},"b":{"op":"arg","n":0}},"b":{"op":"*","a":{"op":"imm","n":5},"b":{"op":"arg","n":1}}},"b":{"op":"*","a":{"op":"imm","n":3},"b":{"op":"arg","n":2}}},"b":{"op":"imm","n":8}});

// var c = new Compiler();
// Test.expect(c,"Able to construct compiler");

// var p1 = c.pass1(prog);
// Test.expect(JSON.stringify(p1) === t1,"Pass1");

// var p2 = c.pass2(p1);
// Test.expect(JSON.stringify(p2) === t2,"Pass2");

// var p3 = c.pass3(p2);
// Test.expect(simulate(p3,[4,0,0]) === 3,"prog(4,0,0) == 3");
// Test.expect(simulate(p3,[4,8,0]) === 8,"prog(4,8,0) == 8");
// Test.expect(simulate(p3,[4,8,16]) === 2,"prog(4,8,6) == 2");
