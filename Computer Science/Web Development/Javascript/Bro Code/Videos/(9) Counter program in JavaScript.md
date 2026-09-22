---
Source:
  - https://youtube.com/watch?v=dKOT5LcouzQ
---
index.js
```javascript
let count = 0;

document.getElementById("decreaseBtn").onclick = function(){
    count-=1;
    document.getElementById("countLabel").innerHTML = count;
}

document.getElementById("resetBtn").onclick = function(){
    count=0;
    document.getElementById("countLabel").innerHTML = count;
}

document.getElementById("increaseBtn").onclick = function(){
    count+=1;
    document.getElementById("countLabel").innerHTML = count;
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
    <label id="countLabel">0</label><br>
    <button id="decreaseBtn">decrease</button>
    <button id="resetBtn">reset</button>
    <button id="increaseBtn">increase</button>
    <script src="index.js"></script>
</body>
</html>
```

styles.css
```CSS
#countLabel{
    display: block;
    text-align: center;
    font-size: 50px;
}
```

Output:
![[Screenshot 2022-11-26 at 4.39.29 AM.png|500]]