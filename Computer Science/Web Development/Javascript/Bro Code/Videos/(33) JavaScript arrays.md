[Video](https://youtube.com/watch?v=C0qhgTbtkS0)

index.js
```javascript
// array = think of it as a variable 
//              that can store multiple values

//each value in array is known as an element
let fruits = ["apple", "orange", "banana"];

//replaces the 3rd element with coconut
//fruits[2] = "coconut";

//fruits.push("lemon");      //add an element
//fruits.pop();                     //removes last element
//fruits.unshift("mango"); //add element to beginning
//fruits.shift();                   //removes element from beginning

//let length = fruits.length; //number of elements in array
//let index = fruits.indexOf("kiwi"); //finds index of kiwi (-1)

console.log(fruits);
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
`(3) ['apple', 'orange', 'banana']`
