---
Source:
  - https://youtube.com/watch?v=ArlN-knSCbs
Reviewed: false
---
index.js
```javascript
document.getElementById("myButton").onclick = function(){

    const myCheckBox = document.getElementById("myCheckBox");
    const visaBtn = document.getElementById("visaBtn");
    const mastercardBtn = document.getElementById("mastercardBtn");
    const paypalBtn = document.getElementById("paypalBtn");
  
    if(myCheckBox.checked){
      console.log("You are subscribed!");
    }
    else{
      console.log("You are NOT subscribed!");
    }
  
    if(visaBtn.checked){
      console.log("You are paying with a Visa!");
    }
    else if(mastercardBtn.checked){
      console.log("You are paying with a Mastercard!");
    }
    else if(paypalBtn.checked){
      console.log("You are paying with PayPal!");
    }
    else{
      console.log("You must select a payment type!");
    }
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

	<!-- This is how you make a comment in HTML -->

    <!-- You can click on the subscribe label 
    to check the box off as well -->
    <label for="myCheckBox">subscribe</label>
    <input type="checkbox" id="myCheckBox"><br>

    <label for="visaBtn">Visa</label>
    <input type="radio" name="card" id="visaBtn">
    <label for="mastercardBtn">MasterCard</label>
    <input type="radio" name="card" id="mastercardBtn">
    <label for="paypalBtn">PayPal</label>
    <input type="radio" name="card" id="paypalBtn"><br>

    <button id="myButton">submit</button>
    <script src="index.js"></script>
</body>
</html>
```

Output
![[Screenshot 2022-11-26 at 10.51.05 AM.png|500]]