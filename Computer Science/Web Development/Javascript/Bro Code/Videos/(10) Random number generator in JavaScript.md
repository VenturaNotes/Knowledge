---
Source:
  - https://youtube.com/watch?v=UZqSpuUJPa0
---
index.js
```javascript
let x;
let y;
let z;

document.getElementById("rollButton").onclick = function(){

    x = Math.floor(Math.random() * 6) + 1;
    y = Math.floor(Math.random() * 6) + 1;
    z = Math.floor(Math.random() * 6) + 1;

    document.getElementById("xlabel").innerHTML = x;
    document.getElementById("ylabel").innerHTML = y;
    document.getElementById("zlabel").innerHTML = z;
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
    <label id="xlabel"></label><br>
    <label id="ylabel"></label><br>
    <label id="zlabel"></label><br>
    <button type="button" id="rollButton">roll</button>
    <script src="index.js"></script>
</body>
</html>
```

Output
![[Screenshot 2022-11-26 at 10.22.39 AM.png]]