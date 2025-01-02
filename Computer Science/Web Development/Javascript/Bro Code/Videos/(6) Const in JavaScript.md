---
Source:
  - https://youtube.com/watch?v=49S8P_MFGOY
Reviewed: false
---
index.js
```javascript
// const = a variable that can't be changed
//Adds some security to our code

//Circumference = 2 * pi * radius
//C = 2(pi)(r)

//prevents variable from being changed
const PI = 3.14159;
let radius;
let circumference;

radius = window.prompt("Enter the radius of a circle");
radius = Number(radius);

//PI = 420.69;

circumference = 2 * PI * radius;

console.log("The circumference is:", circumference);
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
![[Screenshot 2022-11-26 at 4.27.59 AM.png|500]]

Console Output:
`The circumference is: 6.28318`
