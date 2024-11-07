[Video](https://youtube.com/watch?v=_LZZoHzkivc)

index.js
```javascript
// closure =  A function with preserved and private data.
//                   Gives you access to an outer function’s scope,
//                   from an inner function.

document.getElementById("loginButton").onclick = login();

//userInbox = 420.69;

function login(){
    let userName = "Bro";
    let userInbox = 1;

    function alertUser(){
        alert(`${userName} you have ${userInbox} new messages!`);
        userInbox = 0;
    }

    return alertUser;
}
```

- Why isn't alertUser returned like alertUser()?

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
    <button id="loginButton">login</button>
    <script src="index.js"></script>
</body>
</html>
```

Output
An alert pops up displaying # of messages when clicking the login button