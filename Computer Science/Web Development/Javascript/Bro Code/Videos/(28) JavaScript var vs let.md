---
Source:
  - https://youtube.com/watch?v=A2x75iOqidA
---
index.js
```javascript
// variable scope = where a variable is accessible

// let = variables are limited to block scope {}
// var = variables are limited to a function(){}

//global varialbe = is declared outside any function
// (if gloabal, var will CHANGE browser's window properties)

//var name = "Bro"
//Unintentionally changed window's property of 'name' to "Bro"
//you can check this by typing 'window' in console and
//checking its properties
//let name = "Bro" : will not change the window property "name"

for(let i = 1; i <= 3; i+=1){
    //console.log(i);
}
for(var i = 1; i <= 3; i+=1){
    //console.log(i);
}

console.log(i);
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
`4`