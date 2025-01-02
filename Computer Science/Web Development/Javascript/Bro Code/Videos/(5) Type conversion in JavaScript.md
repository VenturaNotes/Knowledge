---
Source:
  - https://youtube.com/watch?v=I68O9oazLbo
Reviewed: false
---
index.js
```javascript
// Type Conversion = change the datatype of a value to another
//                                   (strings, numbers, booleans)

let age = window.prompt("How old are you?");

//Gets data type of variable
//console.log(typeof age);

//This is a number constructor
//Converts string to number
age = Number(age);
age += 1;

console.log("Happy Birthday! You are", age, "years old");

/*
let x;
let y;
let z;

//this will result in NaN
x = Number("pizza");
y = String(3.14);

//Converting empty string to boolean will result in false
//Any boolean not empty is true
//Great way of checking if user typed anything in
z = Boolean("pizza");

console.log(x, typeof x);
console.log(y, typeof y);
console.log(z, typeof z);
*/
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

    <label id="myLabel">Enter your name:</label><br>
    <input type="text" id="myText"><br>
    <button type="button" id="myButton">submit</button>
    <script src="index.js"></script>

</body>
</html>
```

Output:
![[Screenshot 2022-11-26 at 4.23.54 AM.png|500]]
After entering 53, console output:
`Happy Birthday! You are 54 years old`