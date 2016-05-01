var calc_table = document.getElementById("calc_values");

console.log('Found a table')
console.log(calc_table);
calc_table.addEventListener("click", function(e) {
  console.log('got an event');
  if (e.target.value != "AC" && e.target.value != "=") {
    console.log(e.target);
    display(e.target.value);
  } else if (e.target.value == "=") {
    var calculator = document.getElementById("calcInput");
    var expression = calculator.value;
    console.log('Gotta calculate ' + expression);
    solve(expression);
  } else {
    console.log('clearing calc');
    clearcalc();
  }
});

var display = function(val) {
  console.log('showing :: ' + val)
  var calculator = document.getElementById("calcInput");
  calculator.value = calculator.value + val;
};

var pedmas = function(question, m) {
  if (question.match(m) == null) {
    var solution = arithmetic(question);
    console.log('finally solving ' + question + ' === ' + solution);
    return solution;
  } else {
    var subQuestion = question.match(m);
    var solution = arithmetic(subQuestion);
    console.log('Solved ' + subQuestion + ' == ' + solution);
    console.log('Recursing for ' + question.replace(subQuestion, solution));
    // switch from int to string
    return pedmas(question.replace(subQuestion, solution), m);
  }
};

var exponents = function(base, power){
  if (power == 0){
    return 1;
  } else if (power == 1) {
    return base;
  } else if (power < 0) {
    var ans = 1;
    for (var i = 0; i <= -1*power; i++){
      ans = ans * (1 / base);
    }
    return ans;
  } else {
    var ans = 1;
    for (var i = 0; i <= power; i++){
      ans = ans * base;
    }
    return ans;
  }
};

var operation = function(op, question){
  var q = question.split(op).map(function (x){
    return parseInt(x);
  });
  console.log(' Finding operation for ' + question.join());
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
    console.log('divide')
    return q[0] / q[1];
  } else if (op == "^") {
    console.log('exponenting')
    return exponents(q[0], q[1])
  } else {
    console.log('unknown')
    return null;
  }
};

var arithmetic = function(question) {
  // remove all paranthesis
  var q = question.replace("(", "").replace(")", "");
  // replace ** with ^ to make code clearer
  q = q.replace(/\*\*/g, "^");
  //remove all whitespace;
  q = q.replace(/\s/g, "");

  console.log('doing arith for ' + question);

  var operators = new RegExp("\\d+\\^\\d+|\\d+\\*\\d+|\\d+/\\d+|\\d+\\+\\d+|\\d+-\\d+");
  var m = question.match(operators);
  console.log('what is match >> ' + m)

  while (m != null){
    var op = m[0].split(/\d+/)[1];
    console.log('found arith equation ' + m);
    var solution = operation(op, m[0].split(op));

    if (solution != null) {
      question = question.replace(m[0], solution)
      m = question.match(operators);
    } else {
      console.log('arith returned null')
      m = null;
      question = null;
    }
  }

  console.log('found arith solution  ' + question);
  return question
};

var solve = function(question) {
  console.log('Solving:- ' + question);

  clearCalc();

  var m = new RegExp(/\([^)(]+\)/g);
  var ans = pedmas(question, m);
  console.log(ans);
  display(ans);
};

var clearCalc = function() {
  var calculator = document.getElementById("calcInput");
  calculator.value = "";
};
