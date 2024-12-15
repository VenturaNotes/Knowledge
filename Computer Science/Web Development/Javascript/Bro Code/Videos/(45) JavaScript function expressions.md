---
Source:
  - https://youtube.com/watch?v=IHrqpZI1_yc
---
index.js
```JavaScript
// function expression = function without a name (anonymous function)
//                                        avoid polluting the global scope with names
//                                        write it, then forget about it
// ------------ Example 1 ------------
const greeting = function(){
    console.log("hello");
}
greeting();
// ------------ Example 2 ------------
let count = 0;

//No need to create 2 unique function names

document.getElementById("increaseButton").onclick = function(){
    count+=1;
    document.getElementById("myLabel").innerHTML = count;
}
document.getElementById("decreaseButton").onclick = function(){
    count-=1;
    document.getElementById("myLabel").innerHTML = count;
}

/*

//no need for function below + invoking it
sayHello();
function sayHello(){
    console.log("Hello!");
}

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
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <label id="myLabel">0</label><br>
    <button id="decreaseButton">decrease</button>
    <button id="increaseButton">increase</button>
    <script src="index.js"></script>
</body>
</html>
```

Output:
```
hello
```

![[Screenshot 2022-11-26 at 1.56.46 PM.png|300]]
