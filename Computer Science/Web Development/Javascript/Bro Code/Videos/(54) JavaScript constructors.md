[Video](https://youtube.com/watch?v=9cfgwLIQ2ak)

index.js
```javascript
// constructor = a special method of a class,
//                          accepts arguments and assigns properties

class Student{

  constructor(name, age, gpa){
      this.name = name;
      this.age = age;
      this.gpa = gpa;
  }
  study(){
      console.log(`${this.name} is studying`);
  }
}

const student1 = new Student("Spongebob", 30, 3.2);
const student2 = new Student("Patrick", 35, 1.5);
const student3 = new Student("Sandy", 27, 4.0);

console.log(student1.name);
console.log(student1.age);
console.log(student1.gpa);
student1.study();

console.log(student2.name);
console.log(student2.age);
console.log(student2.gpa);
student2.study();

console.log(student3.name);
console.log(student3.age);
console.log(student3.gpa);
student3.study();
```

- Do other programming languages require that we declare a variable within the class before assigning a "this"?

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
Spongebob
30
3.2
Spongebob is studying
Patrick
35
1.5
Patrick is studying
Sandy
27
4
Sandy is studying
```