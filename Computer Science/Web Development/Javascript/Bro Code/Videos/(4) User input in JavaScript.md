---
Source:
  - https://youtube.com/watch?v=fARJwGqdbKQ
Reviewed: false
---
index.js
``` javascript
// How to accept user input

// EASY WAY with a window prompt

//let username = window.prompt("What's your name?");
//console.log(username);

// DIFFICULT WAY HTML textbox

let username;

document.getElementById("myButton").onclick = function(){
    
    username = document.getElementById("myText").value;
    console.log(username);
    document.getElementById("myLabel").innerHTML = "Hello " + username;
}
```

index.html
``` HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>

    <label id="myLabel">Enter your name:</label><br>
    <input type="text" id="myText"><br>
    <button type="button" id="myButton">submit</button>
    <script src="index.js"></script>

</body>
</html>
```

Output
![[Screenshot 2022-11-26 at 4.17.42 AM.png|500]]