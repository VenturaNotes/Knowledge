---
Source:
  - https://youtube.com/watch?v=d8LrQ06j4w8
Reviewed: false
---
index.js
```javascript
//Declaring variables
let a;
let b;
let c;

//Hypotenuse forumla
//c = sqrt(a^2 + b^2)

/*
//Uses window prompts

a = window.prompt("Enter side A");
a = Number(a);

b = window.prompt("Enter side B");
b = Number(b);

c = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));

console.log("Side C:", c);

*/

document.getElementById("submitButton").onclick = function(){

    a = document.getElementById("aTextBox").value;
    a = Number(a);

    b = document.getElementById("bTextBox").value;
    b = Number(b);

    c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

    document.getElementById("cLabel").innerHTML = "Side C: " + c;
}
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

    <label id="aLabel">Side A:</label><br>
    <input type="text" id="aTextBox"><br>
    <label id="bLabel">Side B:</label><br>
    <input type="text" id="bTextBox"><br>
    <button type="button" id="submitButton">submit</button><br>
    <label id="cLabel"></label><br>

    <script src="index.js"></script>
</body>
</html>
```

Output
![[Screenshot 2022-11-26 at 4.36.10 AM.png|500]]