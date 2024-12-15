---
Source:
  - https://youtube.com/watch?v=vc3nuHdCp-A
---
index.js
```javascript
// if statement = a basic form of decision making
//                           if a condition is true, then do something
//                           if not, then don't do it!

let age = 21;

if(age >= 65){
    console.log("You are a senior citizen!");
}
else if(age >= 18){
    console.log("You are an adult!");
}
else if(age < 0){
    console.log("YOU HAVEN'T BEEN BORN YET!");
}
else{
    console.log("You are a child!");
}

/*
let online = false;

if(online){
    console.log("You are online!");
}
else{
    console.log("You are offline!");
}
*/
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
`You are an adult!`