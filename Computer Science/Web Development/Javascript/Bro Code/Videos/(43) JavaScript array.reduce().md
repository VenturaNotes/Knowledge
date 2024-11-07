[Video](https://youtube.com/watch?v=YQ7R6NK-bfA)

index.js
```javascript
//array.reduce() = reduces an array to a single value            

let prices = [5, 10, 15, 20, 25, 30];

//great use for .reduce is to sum up an array of values
let total = prices.reduce(checkOut);

console.log(`The total is: $${total}`);

function checkOut(total, element){
    return total + element;
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
`The total is: $105`