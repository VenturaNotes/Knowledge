[Video](https://youtube.com/watch?v=FtcW2PfbJSQ)

index.js
```javascript
//array.forEach() = executes a provided callback function
//                              once for each array element

let students = ["spongebob", "patrick", "squidward"];

//exectuse code for each element
students.forEach(capitalize);
students.forEach(print);

function capitalize(element, index, array){
    //The element.substring takes the first index inclusively and then
    //returns the rest of the string
    array[index] = element[0].toUpperCase() + element.substring(1);
}

function print(element){
    console.log(element);
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
Spongebob
Patrick
Squidward
```