[Video](https://youtube.com/watch?v=-gI1jeMhcic)

index.js
```javascript
/*
- The idea behind a module is that it's a file of reusable code
- We can import sections of pre-written code to use whenever
- Great for any general utility values and functions
- Helps to make your code more reusable and maintainable
- Think of modules as separate chapters of a book

*/

// ********************** index.js **********************

//You can import specific functions / variables by naming them
//import {PI, getCircumference, getArea} from "./math_util.js";

//You can import everything using an asterisk
//Must import them using an alias
//This is as if we're creating a separate namespace
//Must precede now with the namespace
import * as MathUtil from "./math_util.js";

console.log(MathUtil.PI);

let circumference = MathUtil.getCircumference(10);
console.log(circumference);

let area = MathUtil.getArea(10);
console.log(area);
```

math_util.js
```javascript
// ********************** math_util.js **********************

//Need to precede variables and functions with "export"
//So that you can obtain them

export const PI = 3.14159;
 
export function getCircumference (radius) {
    return  2 * PI * radius
}
export function getArea (radius) {
    return  PI * radius * radius;
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
    <!-- Need to insert "module" to use it as a module-->
    <script type="module" src="index.js"></script>
</body>
</html>
```

Output:
```
3.14159
62.8318
314.159
```