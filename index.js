function Compiler() {}

Compiler.prototype.compile = function(program) {
  return this.pass3(this.pass2(this.pass1(program)));
};

Compiler.prototype.tokenize = function(program) {
  // Turn a program string into an array of tokens.  Each token
  // is either '[', ']', '(', ')', '+', '-', '*', '/', a variable
  // name or a number (as a string)
  var regex = /\s*([-+*/\(\)\[\]]|[A-Za-z]+|[0-9]+)\s*/g;
  return program
    .replace(regex, ":$1")
    .substring(1)
    .split(":")
    .map(function(tok) {
      return isNaN(tok) ? tok : tok | 0;
    });
};

function getOpPriority(op) {
  switch (op) {
    case "+":
      return 1;
    case "-":
      return 1;
    case "*":
      return 0;
    case "/":
      return 0;
    default:
      return -1;
  }
}

function findClosingBraketIndex(tokens, initialIndex) {
  let depth = 0;
  for (let i = initialIndex; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === "(") {
      depth++;
    } else if (token === ")") {
      depth--;
    }
    if (depth === 0) return i;
  }
}

function generateAst(args, tokens) {
  if (tokens.length === 1) {
    const token = tokens[0];
    const op = args.includes(token) ? "arg" : "imm";
    const n = args.includes(token) ? args.indexOf(token) : token;
    return { op, n };
  }

  if (
    tokens[0] === "(" &&
    tokens[tokens.length - 1] === ")" &&
    findClosingBraketIndex(tokens, 0) === tokens.length - 1
  ) {
    tokens.splice(0, 1);
    tokens.splice(-1);
  }

  let op = null;
  let opIndex = null;
  let opPriority = -1;
  let depth = 0;

  for (let i = tokens.length - 1; i > 0; i--) {
    const token = tokens[i];

    if (token === "(") {
      depth++;
    } else if (token === ")") {
      depth--;
    } else if (depth === 0) {
      if (getOpPriority(token) > opPriority) {
        op = token;
        opIndex = i;
        opPriority = getOpPriority(token);
      }
    }
  }

  const a = tokens.slice(0, opIndex);
  const b = tokens.slice(opIndex + 1, tokens.length);

  return { op, a: generateAst(args, a), b: generateAst(args, b) };
}

Compiler.prototype.pass1 = function(program) {
  var argTokens = this.tokenize(program);
  var programTokens = argTokens.splice(argTokens.indexOf("]") + 1);

  const args = argTokens.slice(1, -1);

  const ast = generateAst(args, programTokens);

  return ast;
};

Compiler.prototype.pass2 = function(ast) {
  return ast;
};

Compiler.prototype.pass3 = function(ast) {
  // return assembly instructions
};

module.exports = { Compiler };
