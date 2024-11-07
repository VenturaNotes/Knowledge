[Video](https://youtube.com/watch?v=TgDlIZVQeHw)

index.js
```javascript
//function = Define code once, and use it many times.
//                   To perform some code, call the function name.

//will inovke or call function
startProgram();

function startProgram(){
    let userName = "Bro";
    let age = 21;
    
    //userName and age are the arguments
    //order matters
    happyBirthday(userName, age);
}

function happyBirthday(userName, age){
    console.log("Happy birthday to you!");
    console.log("Happy birthday to you!");
    console.log("Happy birthday dear", userName);
    console.log("Happy birthday to you!");
    console.log("You are", age,"years old!");
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
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <label id="myRectangle"></label>
    <script src="index.js"></script>
</body>
</html>
```

Output
![[Screenshot 2022-11-26 at 11.53.34 AM.png|300]]

