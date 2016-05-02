# Smple-Calculator

Design and implement a calculator in Javascript. It shall have the following properties:
- UI implemented using HTML, with the following elements:
1. buttons for the numbers 0-9, the operators +-*/, the parenthesis (), the dot ".", and =
2. common display for the current equation and the result (i.e. like a normal calculator)
- respond to both mouse and keyboard events on the buttons for entering the equation ("enter" maps to "=")
- the current equation must be displayed completely and replaced by the answer when pressing "=" (or enter)
- respect the priority of operators
- don't have the right to use a math library of some sort that magically does it
- don't have the right to use "eval" or new Function etc...