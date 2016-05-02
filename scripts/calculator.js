var calculate = function (question){
  var m = new RegExp(/\([^)(]+\)/g);
  // replace ** with ^ to make code clearer
  question = question.replace(/\*\*/g, "^");

  question = question.replace(/\s/g, "");
  console.log('standardized q>> ' + question);

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
  };

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