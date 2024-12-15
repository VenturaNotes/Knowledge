---
Source:
  - https://youtube.com/watch?v=dvpKScnKOHw
---
tutorial6.ts
```typescript
/*
In ES2015, we have a new keyword "let" for declaring variables
"let" declaration is not hoisted and are block-scoped
A block is any section of code in curly braces (such as if, else, for, while, etc.)

*/

//Let works in this instance
function greetPerson(name){
    let greet;
    if (name === "Chandler"){
        greet = "Hello Chandler";
    }else{
        greet = "Hi there";
    }
    console.log(greet);
}
greetPerson("Chandler");

var a=1;
var b=2;
if(a === 1){
    var a=10;
    let b = 20;
    console.log(a);
    console.log(b);
}

console.log(a);
console.log(b);

/*
Result:
a = 10
b = 20

//It's 10 because var is functional scope
a = 10
//It's 2 because the console can't read the "let"
//keyword within the if block
b = 2

You cannot use "let" keyword until it is declared

You cannot redeclare block-scoped variable (let) but you
can for functional scoped variable (var)

"let" has been introduced to replace "var" in the long run
the long
*/
```

index.html
```HTML
<html>
    <head>
        <script type="text/javascript" src="scripts/tutorial6.js">

        </script>
    </head>
</html>
```


