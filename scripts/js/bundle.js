(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var calculate = function (question){

  if (validOp(question) == false){
    return 'Error';
  }

  var m = new RegExp(/\([^)(]+\)/g);
  // replace ** with ^ to make code clearer
  question = question.replace(/\*\*/g, "^");
  question = question.replace(/\s/g, "");

  var double = question.match(/[-\+]{2}/g);

  var sub = function (item){
    if (item == "++"){
      return "+";
    } else if (item == "+-" || item == "-+"){
      return "-";
    } else if (item == "--"){
      return "+";
    } else {
      return "";
    }
  };

  if (double !== null){
    for (var i=0; i < double.length; i++){
      var subbed = sub(double[i]);
      question = question.replace(double[i], subbed);
    }
  }
  return pedmas(question, m);
};

var validOp = function (question){
  // i.e 9/4+ or 3+
  var invalid = new RegExp(/[-\+\^\*]$/)

  if (question.match(invalid)){
    return false;
  }

  return true;
}

var pedmas = function (question, m) {
  var solution;
  if (question.match(m) === null) {
    solution = arithmetic(question);
    return solution;
  } else {
    var subQuestion = question.match(m)[0];
    solution = arithmetic(subQuestion);

    return pedmas(question.replace(subQuestion, solution), m);
  }
};

var arithmetic = function (question) {
  var q = question.replace("(", "").replace(")", "");

  var multilineRegex = function(regexArray){
    return new RegExp(regexArray.map(
      function(reg){return reg.source; }
    ).join(''));
  };

  var operators = [
    multilineRegex([
      /^[\+-]?\d*\.?\d+\^\d*\.?\d+|/,
      /\d*\.?\d+\^\d*\.?\d+|/,
      /^[\+-]?\d*\.?\d+\^[\+-]?\d*\.?\d+|/,
      /\d*\.?\d+\^[\+-]?\d*\.?\d+/]
    ),
    multilineRegex([
      /^[\+-]?\d*\.?\d+\/\d*\.?\d+|/,
      /\d*\.?\d+\/\d*\.?\d+|/,
      /^[\+-]?\d*\.?\d+\/[\+-]?\d*\.?\d+|/,
      /\d*\.?\d+\/[\+-]?\d*\.?\d+/]
    ),
    multilineRegex([
      /^[\+-]?\d*\.?\d+\*\d*\.?\d+|/,
      /\d*\.?\d+\*\d*\.?\d+|/,
      /^[\+-]?\d*\.?\d+\*[\+-]?\d*\.?\d+|/,
      /\d*\.?\d+\*[\+-]?\d*\.?\d+/]
    ),
    multilineRegex([
      /^[\+-]?\d*\.?\d+\+\d*\.?\d+|\d*\.?\d+\+/,
      /\d*\.?\d+/]
    ),
    multilineRegex([
      /^[\+-]?\d*\.?\d+-\d*\.?\d+|\d*\.?\d+-\d*/,
      /\.?\d+/]
    )
  ];

  for (var i=0; i < operators.length; i++){
    var m = q.match(operators[i]);

    while (m !== null){
      var op = m[0].split(/\d*\.?\d+/)[1][0];
      var solution = operation(op, m[0]);

      if (solution !== null) {
        q = q.replace(m[0], solution);
        m = q.match(operators[i]);
      } else {
        m = null;
        q = null;
      }
    }
  }
  return q;
};

var operation = function (op, question){
  var stop = question.lastIndexOf(op);

  var q = [question.substring(0, stop), question.substring(stop+1)]
            .map(function(x){
    return  parseFloat(x);
  });

  if (op == "+"){
    return q[0] + q[1];
  } else if (op == "-"){
    return q[0] - q[1];
  } else if (op == "*") {
    return q[0] * q[1];
  } else if (op == "/") {
    return q[0] / q[1];
  } else if (op == "^") {
    return exponents(q[0], q[1]);
  } else {
    return null;
  }
};

var exponents = function (base, power){
  var ans,i;

  if (power == 0){
    return 1;
  } else if (power == 1) {
    return base;
  } else if (power < 0) {
    ans = 1;
    for (i = 0; i < -1*power; i++){
      ans = ans * (1 / base);
    }
    return ans;
  } else {
    ans = 1;
    for (i = 0; i < power; i++){
      ans = ans * base;
    }
    return ans;
  }
};

var clearCalc = function () {
  var calculator = document.getElementById("calcScreen");
  calculator.value = "";
};

module.exports.calculate = calculate;
},{}],2:[function(require,module,exports){
window.onload = function() {
  var calculate = require('./calculator').calculate;

  var calcScreen = document.getElementById("calcScreen");
  calcScreen.addEventListener('keydown', function(e){
    if (
      e.keyCode == 13 ||
      (e.keyCode == 187 && e.shiftKey === false)
    ) {
       e.preventDefault();
       solve();
    } else {
      if (isValid(e) === false){
        console.log("invalid char: " + e.code);
        e.preventDefault();
      }
    }
  });

  var calcTable = document.getElementById("calcPad");
  calcTable.addEventListener("click", function(e) {
    if (e.target.value != "AC" && e.target.value != "=")  {
      display(e.target.value);
    } else if (e.target.value == "=") {
      solve();
    } else {
      clearCalc();
    }
  });

  var isValid = function(event){
      var code = event.keyCode;
      if (event.shiftKey === true){
        if ([16,48, 54,56, 57, 187, 190].indexOf(code) != -1){
          return true;
        }
        return false;
      } else {
        if (
          [8,187, 189,190, 191].indexOf(code) != -1 ||
          (code >= 48 && code <= 57 ) ||
          (code >= 37 && code <=40 )
        ){
          return true;
        }
        return false;
      }
  };

  var display = function(val) {
    var calculator = document.getElementById("calcScreen");
    calculator.value = calculator.value + val;
  };

  var solve = function() {
    var calculator = document.getElementById("calcScreen");
    var question = calculator.value;

    clearCalc();

    var ans = calculate(question);
    display(ans);
  };

  var clearCalc = function() {
    var calculator = document.getElementById("calcScreen");
    calculator.value = "";
  };
};
},{"./calculator":1}]},{},[2]);
