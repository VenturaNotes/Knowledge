---
Source:
  - https://youtube.com/watch?v=S4eeJ87n02A
---
index.js
```javascript
// ! NOT logical operator
// typically used to reverse a condition's boolean value
// true -> false  false -> true

let temp = 15;
let sunny = false;

if(!(temp > 0)){
    console.log("It's cold outside");
}
else{
    console.log("It's warm outside");
}

if(!sunny){
    console.log("It's cloudy outside");
}
else{
    console.log("It's sunny outside");
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
`It's warm outside`
`It's cloudy outside`
