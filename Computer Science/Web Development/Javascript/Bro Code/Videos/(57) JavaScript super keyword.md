[Video](https://youtube.com/watch?v=wvVFTjn4QcE)

index.js
```javascript
// super = Refers to the parent class. 
//               Commonly used to invoke constructor of a parent class

class Animal{
    
  constructor(name, age){
      this.name = name;
      this.age = age;
  }
}
class Rabbit extends Animal{

  //Inheriting (extends) constructor must call
  //"super" before using "this" and before returning 
  //even if "this" isn't used
  constructor(name, age, runSpeed){
      //super must be invoked if there
      //is nothing super to call
      //super();
      super(name, age);
      this.runSpeed = runSpeed;
  }
}
class Fish extends Animal{

  constructor(name, age, swimSpeed){
      super(name, age);
      this.swimSpeed = swimSpeed;
  }
}
class Hawk extends Animal{

  constructor(name, age, flySpeed){
      super(name, age);
      this.flySpeed = flySpeed;
  }
}

const rabbit = new Rabbit("rabbit", 1, 40);
const fish = new Fish("fish", 2, 80);
const hawk = new Hawk("hawk", 3, 200);

console.log(rabbit.name);
console.log(rabbit.age);
console.log(rabbit.runSpeed);
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
rabbit
1
40
```