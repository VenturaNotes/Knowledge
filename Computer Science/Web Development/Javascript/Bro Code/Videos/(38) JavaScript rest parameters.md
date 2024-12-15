---
Source:
  - https://youtube.com/watch?v=YOI6CEVmQyM
---
index.js
```javascript
// rest parameters = represents an indefinite number
// ...                             of parameters
//                                (packs arguments into an array)

let a = 1;
let b = 2;
let c = 3;
let d = 4;
let e = 5;

console.log(sum(a, b, c, d, e));

function sum(a,b,...numbers){
    let total = 0;
    for(let number of numbers){
        total += number
    }
    return total
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
`12`

