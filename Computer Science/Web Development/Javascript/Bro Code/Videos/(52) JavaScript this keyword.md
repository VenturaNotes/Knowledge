---
Source:
  - https://youtube.com/watch?v=qaT8vAUTF4o
Reviewed: false
---
index.js
```javascript
// this = reference to a particular object
//           the object depends on the immediate context

//This changes the property of the window
this.name ="myCoolWindow";
console.log(this.name);

const car1 = {
  model:"Mustang",
  color:"red",
  year:2023,

  drive : function(){
      console.log(`You drive the ${this.model}`);
  }
}
const car2 = {
  model:"Corvette",
  color:"blue",
  year:2024,

  drive : function(){
    //this is just a reference to the object we're working with
      console.log(`You drive the ${this.model}`);
  }
}

car1.drive();
car2.drive();
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
    <script src="index.js"></script>
</body>
</html>
```

Output
```
myCoolWindow
You drive the Mustang
You drive the Corvette
```