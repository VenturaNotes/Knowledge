[Video](https://youtube.com/watch?v=g5lJlJUcRvw)

index.js
```javascript
// while loop = repeat some code 
//                       while some condition is true
//                       potentially infinite

let userName = "";

//Hitting cancel will return null
//Doing this will make "OK" and "Cancel" not work
while(userName == "" || userName == null){
    userName = window.prompt("Enter your name");
}

console.log("Hello", userName);
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

Output:
- A window prompt will pop up asking for my name (no way to escape)
- Enter "Julian"
- console: `Hello Julian`