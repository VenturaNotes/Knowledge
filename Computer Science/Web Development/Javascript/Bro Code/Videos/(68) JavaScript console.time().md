[Video](https://youtube.com/watch?v=-6X32oZzK2E)

index.js
```javascript
// console.time() = Starts a timer you can use to 
//                               track how long an operation takes
//                              Give each timer a unique name.

//start
//Will track how long a synchronous operation takes
console.time("Response time");

alert("CLICK THE OK BUTTON!");
//setTimeout(() => console.log("HELLO!"), 3000);

//end
console.timeEnd("Response time");
```

index.html
```
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

Output
An alert pops up on webpage, and you need to click ok. Your time is tracked for how long it takes to press "OK"
`Response time: 67552.30688476562 ms`