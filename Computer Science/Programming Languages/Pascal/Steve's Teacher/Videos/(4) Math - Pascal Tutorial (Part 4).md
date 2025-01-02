---
Source:
  - https://youtube.com/watch?v=Jyke7X5Zzy8
Reviewed: false
---
```Pascal
program MyFirstProgram;

var
    x: integer;
    y: double;

begin
    x := 9;
    //x := x / 3;
    y := x / 3; //does not return integer
    writeln(y);
     
    writeln(10 - 5);
    writeln(9 div 3); //only produce an integer and work with integers
    writeln(10*3); //multiplication
    writeln(2 mod 3); //Will give a remainder of 2

    //fizzbuzz can be solved with mod
    // 1 -> 100 //have numbers 1 to 100
    // 3 -> Fizz //say fizz if divisible by 3
    // 5 -> Buzz //say buzz if divisible by 5
    // 3 and 5 -> FizzBuzz //say FizzBuzz if divisible by 3 and 5

end.
```

Output
```
 3.0000000000000000E+000
5
3
30
2
```