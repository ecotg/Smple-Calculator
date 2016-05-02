(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var calculate = require('./scripts/calculator').calculate;

var calcScreen = document.getElementById("calcScreen");
calcScreen.addEventListener('keydown', function(e){
  console.log('onScreen');
  // map enter or = to submit
  if (e.keyCode == 13 || (e.keyCode == 187 && e.shiftKey === false)) {
     e.preventDefault();
     console.log('Asking to submit');
     solve();
  } else {
    if (isValid(e) === false){
      console.log("invalid char: " + e.code);
      console.log(e);
      e.preventDefault();
    }
  }
});

var calcTable = document.getElementById("calcPad");
calcTable.addEventListener("click", function(e) {
  console.log('got an event');
  if (e.target.value != "AC" && e.target.value != "=")  {
    display(e.target.value);
  } else if (e.target.value == "=") {
    solve();
  } else {
    console.log('clearing calc');
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
  console.log('showing :: ' + val);
  var calculator = document.getElementById("calcScreen");
  calculator.value = calculator.value + val;
};

var solve = function() {
  var calculator = document.getElementById("calcScreen");
  var question = calculator.value;
  console.log('Solving:: ' + question.toString());
  clearCalc();

  var ans = calculate(question);
  console.log(ans);
  display(ans);
};

var clearCalc = function() {
  var calculator = document.getElementById("calcScreen");
  calculator.value = "";
};
},{"./scripts/calculator":2}],2:[function(require,module,exports){
var calculate = function (question){
  var m = new RegExp(/\([^)(]+\)/g);
  // replace ** with ^ to make code clearer
  question = question.replace(/\*\*/g, "^");

  question = question.replace(/\s/g, "");
  console.log('standardized q>> ' + question)

  var double = question.match(/[-\+]{2}/g);
  console.log('found doubles?? '+ double);

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
      console.log('subbing ' + double[i] + ' with ' + subbed);
      question = question.replace(double[i], subbed);
    }
  }
  return pedmas(question, m);
};

var pedmas = function (question, m) {
  console.log('in pedmas');
  var solution;
  if (question.match(m) === null) {
    solution = arithmetic(question);
    console.log('finally solving ' + question + ' === ' + solution);
    return solution;
  } else {
    var subQuestion = question.match(m)[0];
    console.log('Recursing for ' + subQuestion);
    solution = arithmetic(subQuestion);
    console.log('Solved ' + subQuestion + ' == ' + solution);

    return pedmas(question.replace(subQuestion, solution), m);
  }
};

var arithmetic = function (question) {
  // remove all paranthesis
  console.log('in arithmetic for ' + question);
  var q = question.replace("(", "").replace(")", "");

  console.log('doing arith for ' + q);
  var multilineRegex = function(regexArray){
    return new RegExp(regexArray.map(
      function(reg){return reg.source; }
    ).join(''));
  }

  var operators = [
    multilineRegex([
      /^[\+-]?\d*\.?\d+\^\d*\.?\d+|\d*\.?\d+/,
      /\^\d*\.?\d+|\d*\.?\d+\^[\+-]?\d*\.?\d+/]
    ),
    multilineRegex([
      /^[\+-]?\d*\.?\d+\/\d*\.?\d+|\d*\.?\d+/,
      /\/\d*\.?\d+|\d*\.?\d+\/[\+-]?\d*\.?\d+/]
    ),
    multilineRegex([
      /^[\+-]?\d*\.?\d+\*\d*\.?\d+|\d*\.?\d+\*/,
      /\d*\.?\d+|\d*\.?\d+\*[\+-]?\d*\.?\d+/]
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
    console.log('what is match >> ' + m);

    while (m !== null){
      console.log('full match :: ' + m[0]);
      // explain using/; "-15+-6".split(/\d+/)
      var op = m[0].split(/\d*\.?\d+/)[1][0];
      console.log('found operand --> ' + op);
      console.log('found arith equation ' + m);
      var solution = operation(op, m[0]);

      if (solution !== null) {
        console.log('Found arith sol ' + solution);
        q = q.replace(m[0], solution);
        console.log('updated arith q ' + q);
        m = q.match(operators[i]);
      } else {
        console.log('arith returned null');
        m = null;
        q = null;
      }
    }
  }
  console.log('found arith solution  ' + q);
  return q;
};

var operation = function (op, question){
  var stop = question.lastIndexOf(op);
  console.log('we found stop ' + stop);

  var q = [question.substring(0, stop), question.substring(stop+1)].map(function(x){
    return  parseFloat(x);
  });
  // remove this once debugged
  if (op == "-"){
    console.log('difference oper');
  } else {
    console.log('non-diff oper : ' + op);
  }
  console.log(' Finding operation for see below ' );
  console.log(q);
  // Check that q.length == 2
  if (op == "+"){
    console.log('add');
    return q[0] + q[1];
  } else if (op == "-"){
    console.log('subtract');
    return q[0] - q[1];
  } else if (op == "*") {
    console.log('multiply');
    return q[0] * q[1];
  } else if (op == "/") {
    console.log('divide');
    return q[0] / q[1];
  } else if (op == "^") {
    console.log('exponenting');
    return exponents(q[0], q[1]);
  } else {
    console.log('unknown');
    return null;
  }
};

var exponents = function (base, power){
  var ans;

  if (power == 0){
    return 1;
  } else if (power == 1) {
    return base;
  } else if (power < 0) {
    ans = 1;
    for (var i = 0; i < -1*power; i++){
      ans = ans * (1 / base);
    }
    return ans;
  } else {
    ans = 1;
    for (var i = 0; i < power; i++){
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
},{}]},{},[1]);
