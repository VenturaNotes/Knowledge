---
Source:
  - https://youtube.com/watch?v=my3f_sUObhE
---
index.js
```javascript
// A variable is a container for storing data
// A variable behaves as if it was the value that it contains

// Two steps:
// 1. Declaration (var, let, const)
// 2. Assignment  (= assignment operator)

//Var is best practice due to variable scope

//data types are important

//A string is a series of characters
let firstName = "Bro"; //strings
let age = 21; //number
let student = true; //booleans

//This would concatenate "1" to "Bro" giving "Bro1"
//firstName = firstName + 1

//Increases age by 1
//age = age + 1;

console.log("Hello", firstName);
console.log("You are", age, "years old");
console.log("Enrolled:", student);

document.getElementById("p1").innerHTML = "Hello " + firstName;
document.getElementById("p2").innerHTML = "You are " + age + " years old";
document.getElementById("p3").innerHTML = "Enrolled: " + student;
```

index.html
```html
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

Output
![[Screenshot 2022-11-26 at 4.09.15 AM.png|500]]