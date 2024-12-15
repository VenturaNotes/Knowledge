---
Source:
  - https://youtube.com/watch?v=Q8rvWnOD9nQ
---
index.js
```javascript
let fruits = ["banana", "apple", "orange", "mango"];


//alphabetical order
fruits = fruits.sort();

//reverse alphabetical order
//fruits = fruits.sort().reverse();

for(let fruit of fruits){
    console.log(fruit);
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
apple
banana
mango
orange
```