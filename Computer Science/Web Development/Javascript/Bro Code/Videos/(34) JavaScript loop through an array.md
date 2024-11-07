[Video](https://youtube.com/watch?v=AKuTs0hYj6Q)

index.js
```javascript
let prices = [5, 10, 15, 20, 25];

/*
//going from 0th index to last
for(let i = 0; i < prices.length; i+=1){
    console.log(prices[i]);
}

for (let i = prices.length - 1; i >= 0; i-=1){
    console.log(prices[i]);
}
*/

//for of statement
for(let price of prices){
    console.log(price);
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
    <script src="index.js"></script>
</body>
</html>
```

Output
```
5
10
15
20
25
```