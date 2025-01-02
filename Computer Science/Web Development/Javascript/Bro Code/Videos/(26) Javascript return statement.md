---
Source:
  - https://youtube.com/watch?v=zgZ4lmPrg60
Reviewed: false
---
index.js
```javascript
// return = returns a value back to the place 
//               where you invoked a function

let area;
let width;
let height;

//calculates area of rectangle
width = window.prompt("Enter width");
height = window.prompt("Enter height");

area = getArea(width, height);

console.log("The area is:", area);

//Don't need to specify return type?
function getArea(width, height){
    return width * height;
}
```


html.index
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
    <label id="myRectangle"></label>
    <script src="index.js"></script>
</body>
</html>
```

Output:
window.prompt(): 5
window.prompt(): 6
Console: `The area is: 30`