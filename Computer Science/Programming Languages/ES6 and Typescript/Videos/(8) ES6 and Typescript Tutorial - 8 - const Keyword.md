---
Source:
  - https://youtube.com/watch?v=QS-c5aQS_Mw
Reviewed: false
---
tutorial.ts
```typescript
//const keyword used to create read-only named constants
//const declarations are block-scoped and not hoisted
//value must be mandatorily set due with const declaration
//can't be changed at later point with the same scope

let num1;

//const declarations must be initialized (below is wrong)
//const num2;

const num2 = 10;

//There is a catch when creating an object with the const keyword

const obj1 = {
    name:"Joatmon"
};
console.log(obj1.name)

//Left-hand side of assigment expression cannot be a constant. (below is wrong)
//obj1 = {};


//You cannot assign a new object
//However, you can assign a new value to a 
//property of the object
obj1.name = "Chandler";
console.log(obj1.name);
```

index.html
```HTML
<html>
    <head>
        <script type="text/javascript" src="scripts/tutorial.js">

        </script>
    </head>
</html>
```

Output:
`Joatman`
`Chandler`


