---
Source:
  - https://youtube.com/watch?v=Fc6DPYx9aQU
Reviewed: false
---
tutorial.ts
```typescript
//spread operator opposite of rest operator

//rest operator takes variable number of parameters 
//or arguments and puts them into a single array
//rest is to come by

//spread operator takes an array and splits it
//into individual elements
//spread is to split

//rest operator is specified in function declaration
let displayColors = function(message, ...colors){
    console.log(message);
    //console.log(colors);

    for(let i in colors){
        console.log(colors[i]);
    }
}

let message = "List of Colors"

//spread operator is specified during function call
let colorArray = ['Orange', 'Yellow', 'Indigo'];
displayColors(message, ...colorArray);

//Great way to deal with variable number of parameters

//displayColors(message, "Red");
//displayColors(message, "Red", "Blue");
//displayColors(message, "Red", "Blue", "Green");
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



