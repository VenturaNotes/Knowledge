---
Source:
  - https://youtube.com/watch?v=hwht8PbHYFM
---
index.js
```javascript
class Car{

  constructor(model, year, color){
      this.model = model;
      this.year = year;
      this.color = color;
  }
  drive(){
      console.log(`You drive the ${this.model}`);
  }
}

const car1 = new Car("Mustang", 2023, "red");
const car2 = new Car("Corvette", 2024, "blue");
const car3 = new Car("Lambo", 2022, "yellow");
const car4 = new Car("Ferrari", 2025, "white");

const cars = [car1, car2, car3, car4];

console.log(cars[0].model);
console.log(cars[1].model);
console.log(cars[2].model);

startRace(cars);

function startRace(cars){
  for(const car of cars){
      car.drive();
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
    <script src="index.js"></script>
</body>
</html>
```

Output
```
You drive the Mustang
You drive the Corvette
You drive the Lambo
You drive the Ferrari
```