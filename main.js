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