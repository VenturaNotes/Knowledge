---
Source:
  - https://youtube.com/watch?v=wifUq0fDqew
---
index.js
```javascript
// arrow function expression = compact alternative to a traditional function expression
//      =>

//Example 1:
const greeting = userName => console.log(`Hello ${userName}`);
greeting("Bro"); //Hello Bro

//Example 2:
const percent = (x,y) => x / y * 100;
console.log(`${percent(45,50)}`); //90%

//Example 3
const grades = [100, 50, 90, 60, 80, 70];

grades.sort((x, y) => y - x);
grades.forEach((element) => console.log(element));

//You would need to pass in a callback
//if arrow function expressions not used

//with no arguments, you can just have a set
//of ()

//If 1 argument, don't need parenthesis

//If 2 or more arguments, need set of parenthesis

//You need curly braces {} if your function 
//uses more than 1 statement
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
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <script src="index.js"></script>
</body>
</html>
```

Output
```
Hello Bro
90
100
90
80
70
60
50
```