---
Source:
  - https://youtube.com/watch?v=w-YvEgtTz-g
---
index.js
```Javascript
const title = document.getElementById("myTitle");

//In css, the properties usually have dashes between them
//        such as background-color. However in javascript
//        properties are called by camel case "backgroundColor"

//Changes the background color of the element
//could do "rgb(50, 200, 250" or "blue"
// Can use colored names, rgb values or hexadecimal values
title.style.backgroundColor = "#222222";

//changes color of text
title.style.color = "rgb(50, 200, 250)";

//Changes font
title.style.fontFamily = "consolas";

//changes alignment of text
title.style.textAlign = "center";

//Adds border to text
title.style.border = "2px solid";

//shows how to display it such as "none"
title.style.display = "block";
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
    <h1 id="myTitle">This is my title</h1>
    <script src="index.js"></script>
</body>
</html>
```

Output:
![[Screenshot 2022-12-11 at 9.46.08 PM.png]]