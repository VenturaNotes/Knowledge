---
Source:
  - https://youtube.com/watch?v=gti8w3LNpcA
---
index.js
```javascript
// inheritance = a child class can inherit all the 
//                        methods and properties from another class

class Animal{

  alive = true;

  eat(){
      console.log(`This ${this.name} is eating`);
  }
  sleep(){
      console.log(`This ${this.name} is sleeping`);
  }
}

class Rabbit extends Animal{

  name = "rabbit";

  run(){
      console.log(`This ${this.name} is running`);
  }
}
class Fish extends Animal{

  name = "fish";

  swim(){
      console.log(`This ${this.name} is swimming`);
  }
}
class Hawk extends Animal{

  name = "hawk";

  fly(){
      console.log(`This ${this.name} is flying`);
  }
}

const rabbit = new Rabbit();
const fish = new Fish();
const hawk = new Hawk();

console.log(rabbit.alive);
rabbit.eat();
rabbit.sleep();
rabbit.run();
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
true
This rabbit is eating
This rabbit is sleeping
This rabbit is running
```