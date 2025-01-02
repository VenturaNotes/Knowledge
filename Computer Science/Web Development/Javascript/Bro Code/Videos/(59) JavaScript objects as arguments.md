---
Source:
  - https://youtube.com/watch?v=TbPA2FXU0kQ
Reviewed: false
---
index.js
```javascript
class Car{

    constructor(model, year, color){
        this.model = model;
        this.year = year;
        this.color = color;
    }
}

const car1 = new Car("Mustang", 2023, "red",);
const car2 = new Car("Corvette", 2024, "blue");
const car3 = new Car("Lambo", 2022, "yellow",);

changeColor(car3, "gold");
displayInfo(car3);

function displayInfo(car){
    console.log(car.model);
    console.log(car.year);
    console.log(car.color);
}
function changeColor(car, color){
    car.color = color;
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
Lambo
2022
gold
```