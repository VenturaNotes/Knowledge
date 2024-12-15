---
Source:
  - https://youtube.com/watch?v=OVESx3qEKMA
---
index.js
```javascript
// Template literals = delimited with (`) (a backtick)
//                                   instead of double or single quotes
//                                   allows embedded variables and expressions

let userName = "Bro";
let items = 3;
let total = 75;

//console.log("Hello", userName);
//console.log("You have", items, "items in your cart");
//console.log("Your total is $", total);

//using backticks embeds the variables into console
//console.log(`Hello ${userName}`);
//console.log(`You have ${items} items in your cart`);
//console.log(`Your total is $${total}`);

//The <br> adds a line break
let text = 
`Hello ${userName}<br>
You have ${items} items in your cart<br>
Your total is $${total}<br>`;

//console.log(text);
document.getElementById("myLabel").innerHTML = text;
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
    <label id="myLabel"></label>
    <script src="index.js"></script>
</body>
</html>
```

Output:
![[Screenshot 2022-11-26 at 12.17.39 PM.png|300]]