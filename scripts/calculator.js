var calculate = function (question){
  var m = new RegExp(/\([^)(]+\)/g);
  // replace ** with ^ to make code clearer
  question = question.replace(/\*\*/g, "^");

  question = question.replace(/\s/g, "");
  console.log('standardized question ' + question);

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
      console.log('subbing ' + double[i] + ' with ' + subbed);
      question = question.replace(double[i], subbed);
    }
  }
  return pedmas(question, m);
};

var pedmas = function (question, m) {
  var solution;
  if (question.match(m) === null) {
    solution = arithmetic(question);
    console.log('finally solving ' + question + ' === ' + solution);
    return solution;
  } else {
    var subQuestion = question.match(m)[0];
    solution = arithmetic(subQuestion);
    console.log('Solved ' + subQuestion + ' == ' + solution);

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

    while (m !== null){
      var op = m[0].split(/\d*\.?\d+/)[1][0];
      console.log('found arithmetic operand --> ' + op);
      console.log('found arithmetic equation ' + m);
      var solution = operation(op, m[0]);

      if (solution !== null) {
        console.log('Found arithmetic solution ' + solution);
        q = q.replace(m[0], solution);
        console.log('updated question ' + q);
        m = q.match(operators[i]);
      } else {
        console.log('arithmetic equation returned null solution');
        m = null;
        q = null;
      }
    }
  }
  return q;
};

var operation = function (op, question){
  var stop = question.lastIndexOf(op);
  console.log('we found stop ' + stop);

  var q = [question.substring(0, stop), question.substring(stop+1)].map(function(x){
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