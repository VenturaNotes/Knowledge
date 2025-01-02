---
Source:
  - https://youtube.com/watch?v=WBiq2j95DP8
Reviewed: false
---
index.js
``` javascript
/* 
   arithmetic expression is a combination of...
   operands (values, variables, etc.)
   operators (+ - * / %)
   that can be evaluated to a value
   ex. y = x + 5;
   x and 5 are operands
   addition sign is operator
*/

let students = 20;

//students = students + 1;
//students = students - 1;
//students = students * 2;
//students = students / 2;
//let extraStudents = students % 2;
//students = students ** 2; //exponentiation

console.log(students);

//This shortcut is known as "augmented assignment operator" 
//students += 1;
//students -= 1;
//students *= 2;
//students /= 2;

/*
    operator precedence
    1. parenthesis ()
    2. exponents
    3. multiplication & division
    4. addition & subtraction
*/

//You can use parathesis for operator precedence
//let result = (1 + 2) * (3 + 4);

//console.log(result);
```

index.html
```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
    <p id="p1"></p>
    <p id="p2"></p>
    <p id="p3"></p>

    <script src="index.js"></script>
</body>
</html>
```

Output:
`20`
