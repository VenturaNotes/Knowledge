---
Source:
  - https://youtube.com/watch?v=cHVKLO_JGZ0
---
index.js
```javascript
// Map = object that holds key-value pairs of any data type

const store = new Map([
    ["t-shirt", 20],
    ["jeans", 30],
    ["socks", 10],
    ["underwear", 50]
  ]);
  
  let shoppingCart = 0;

  //returns 20
  //store.get("t-shirt");

  //Adds a hat worth $40
  //store.set("hat", 40);

  ////sets socks to be worth $40
  //store.set("socks", 40); 

  //Deletes hat from the store
  //store.delete("hat");

  //checks if map has pair
  //console.log(store.has("underwear"));

  //returns number of pairs
  //console.log(store.size);
  
  //Iterates through each value of the map
  store.forEach((value, key) => console.log(`${key} $${value}`));
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
t-shirt $20
jeans $30
socks $10
underwear $50
```