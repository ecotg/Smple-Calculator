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

module.exports.calculate = calculate;