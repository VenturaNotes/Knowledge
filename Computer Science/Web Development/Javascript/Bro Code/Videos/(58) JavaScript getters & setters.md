---
Source:
  - https://youtube.com/watch?v=fvKyf3_8_Vk
Reviewed: false
---
index.js
```javascript
// get = binds an object property to a function 
//          when that property is accessed
// set = binds an object property to a function
//          when that property is assigned a value

class Car{
  constructor(power){
      this._gas = 25;
      //_power is the protected property
      this._power = power;
  }
  get power(){
      return `${this._power}hp`;
  }
  get gas(){
      return `${this._gas}L (${this._gas / 50 * 100}%)`;
  }
  set gas(value){
      if(value > 50){
          value = 50;
      }
      else if(value < 0){
          value = 0;
      }
      this._gas = value;
  }
}

let car = new Car(400);

//Possible but you shouldn't change
//a property with an underscore
//car._gas =500
//console.log(car._gas)

//because there is a setter, you can change
//this value this way
//the setter will ensure the value will
//stay within the parameters
car.gas = 100;

//can still access proprety without "_"
console.log(car.power);
console.log(car.gas);
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
400hp
50L (100%)
```