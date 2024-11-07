[Video](https://youtube.com/watch?v=4N-L3Mmzu0Y)

tutorial.ts
```typescript
/*
- Arrow Functions were added to ES2015
- Arrow function provides a short and concise syntax
for writing arrow functions
- Also simplifies behavior of "this" keyword
in javascript

*/
var getRegvalue = function(){
    return 10;
}
console.log(getRegvalue());

//try to avoid var declarations as much as possible
//with arrow functions, you can omit the "function" keyword 
// => is called fat arrow
const getArrowvalue = () => {
    return 10;
}
console.log(getArrowvalue());

//With just a single statement within body of function
//With the fat arrow function
//Left side: parameter list
//Right side: Implicit return value
const getArrowvalue2 = () => 10;
console.log(getArrowvalue2());

//When passing single argument, you can omit parenthesis
const getArrowvalue3 = m => 10*5;
console.log(getArrowvalue3(5));

//With multiple parameters, you need parenthesis
const getArrowvalue4 = (m,bonus) => 10*5+bonus;
console.log(getArrowvalue4(5,50));

//Will return function
//just shorter way of writing javascript functions
console.log(typeof getArrowvalue)

//Need curly braces if you have multiple lines + return
//keyword stated explicitly
const getArrowvalue5 = () => {
    return 10;
}
```

index.html
```html
<html>
    <head>
        <script type="text/javascript" src="scripts/tutorial.js">
        </script>
    </head>
</html>
```


