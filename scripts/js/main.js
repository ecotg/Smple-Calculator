window.onload = function() {
  var calculate = require('./calculator').calculate;

  var calcScreen = document.getElementById("calcScreen");
  calcScreen.addEventListener('keydown', function(e){
    if (e.keyCode == 13 || (e.keyCode == 187 && e.shiftKey === false)) {
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