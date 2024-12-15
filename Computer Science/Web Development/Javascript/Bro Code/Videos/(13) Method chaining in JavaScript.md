---
Source:
  - https://youtube.com/watch?v=YIp4fHeO8Rk
---
index.js
```javascript
// method chaining = calling one method after another
//                                   in one continuous line of code

let userName = "bro";

/*
//Without method chaining
let letter = userName.charAt(0);
letter = letter.toUpperCase();
*/

let letter = userName.charAt(0).toUpperCase().trim();


console.log(letter);
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
`B`


