---
Source:
  - https://youtube.com/watch?v=T-Py51gPdAA
---
index.js
```javascript
// do while loop = do something,
//                             then check the condition,
//                             repeat if condition is true

let userName;

//Allows us to not need to assign variable
//Ensures that the code is run at least once
do{
    userName = window.prompt("Enter your name");
}while(userName == "")

console.log("Hello", userName);
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
`Hello Julian`