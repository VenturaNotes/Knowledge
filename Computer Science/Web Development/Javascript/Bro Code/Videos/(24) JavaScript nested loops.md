---
Source:
  - https://youtube.com/watch?v=rJKAXuyKZG8
Reviewed: false
---
index.js
```javascript
// nested loop = a loop inside of another loop

let symbol = window.prompt("Enter a symbol to use");
let rows = window.prompt('Enter # of rows');
let columns = window.prompt('Enter # of columns');

//j comes after i in the alphabet
for(let i = 1; i <= rows; i+=1){
    for(let j = 1; j <= columns; j+=1){
        document.getElementById("myRectangle").innerHTML += symbol;
    }
    document.getElementById("myRectangle").innerHTML += "<br>";
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
    <label id="myRectangle"></label>
    <script src="index.js"></script>
</body>
</html>
```

Output:
window.prompt: 6 (asks for symbol)
window.prompt: 5 (asks for rows)
window.prompt: 3 (asks for columns)

666
666
666
666
666

(shown on webpage)