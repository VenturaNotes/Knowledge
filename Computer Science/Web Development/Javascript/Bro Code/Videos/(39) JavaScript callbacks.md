---
Source:
  - https://youtube.com/watch?v=mzioHfj_Yb8
---
index.js
```javascript
// callback = a function passed as an argument
//                    to another function.
 
//    Ensures that a function is not going
//    to run before a task is completed.
//    Helps us develop asynchronous code.
//    (When one function has to wait for another function)
//    that helps us avoid errors and potential problems
//    Ex. Wait for a file to load

sum(2, 3, displayConsole);

function sum(x, y, callBack){
  let result = x + y;
  //now it invokes the function
  callBack(result);
}

function displayConsole(output){
  console.log(output);
}

function displayDOM(output){
  document.getElementById("myLabel").innerHTML = output;
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
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <label id="myLabel"></label>
    <script src="index.js"></script>
</body>
</html>
```

Output
`5`