---
Source:
  - https://youtube.com/watch?v=qSieWVc2a7U
Reviewed: false
---
index.js
```javascript
document.getElementById("submitButton").onclick = function(){

    let temp;

    if(document.getElementById("cButton").checked){
        temp = document.getElementById("textBox").value;
        temp = Number(temp);
        temp = toCelsius(temp);
        document.getElementById("tempLabel").innerHTML = temp + "°C";
    }
    else if(document.getElementById("fButton").checked){
        temp = document.getElementById("textBox").value;
        temp = Number(temp);
        temp = toFahrenheit(temp);
        document.getElementById("tempLabel").innerHTML = temp + "°F";
    }
    else{
        document.getElementById("tempLabel").innerHTML = "Select a unit";
    }
}

function toCelsius(temp){
    return (temp - 32) * (5/9);
}

function toFahrenheit(temp){
    return temp * 9 / 5 + 32;
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

    <!-- Adding HTML elements to our DOM (Document)-->
    <label>Enter a temperature:</label><br>
    <input type="text" id="textBox"><br>

    <label>convert to:</label><br>
    <!-- Con only select 1 button because they're 
    in the same group "unit". If different, you could
    select them both.-->
    <input type="radio" id="cButton" name="unit">
    <label>Celsius</label><br>
    <input type="radio" id="fButton" name="unit">
    <label>Fahrenheit</label><br>

    <button type="button" id="submitButton">submit</button><br>
    
    <label id="tempLabel"></label>

    <script src="index.js"></script>
</body>
</html>
```

Output
![[Screenshot 2022-11-26 at 12.41.06 PM.png|200]]
