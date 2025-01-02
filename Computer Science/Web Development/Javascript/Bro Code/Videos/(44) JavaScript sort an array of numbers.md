---
Source:
  - https://youtube.com/watch?v=zNIDX-34lMk
Reviewed: false
---
index.js [^1]
```javascript
let grades = [100, 50, 90, 60, 80, 70];

grades = grades.sort(descendingSort);

grades.forEach(print);

function descendingSort(x, y){
    // 1. < 0 ... a comes first
    // 2. 0 ... nothing will be changed
    // 3. > 0 ... b comes first

    return y - x;
}
function ascendingSort(x, y){
    return x - y;
}
function print(element){
    console.log(element);
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
```
100
90
80
70
60
50
```

## References

[^1]: https://www.youtube.com/watch?v=RsFBsBep-hA