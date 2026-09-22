---
Source:
  - https://youtube.com/watch?v=k5o7AOwc7sY
---
index.js
```javascript
// 2D array = An array of arrays

let fruits =           ["apples", "oranges", "bananas"];
let vegetables = ["carrots", "onions", "potatoes"];
let meats =         ["eggs", "chicken", "fish"];

let groceryList = [fruits, vegetables, meats];

//first index is row
//second index is column
groceryList[2][2] = "steak";

for(let list of groceryList){
    for(let food of list){
        console.log(food);
    }
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
apples
oranges
bananas
carrots
onions
potatoes
eggs
chicken
steak
```