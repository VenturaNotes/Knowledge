---
Source:
  - https://youtube.com/watch?v=-LD7ParTS7M
Reviewed: false
---
index.js
```javascript
// = assignment operator
// == comparison operator

//Checks if 2 values are equal
//as well as their data type
// === strict equality operator

let x = "3.14";

//Returns false
if(x === 3.14){
    console.log("That is pi");
}
else{
    console.log("That is NOT pi");
}

//Returns True
if(x == 3.14){
    console.log("That is pi");
}
else{
    console.log("That is NOT pi");
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
    <script src="index.js"></script>
</body>
</html>
```

Output
`That is NOT pi`
`That is pi`