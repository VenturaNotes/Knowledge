[Video](https://youtube.com/watch?v=TK0xDoQ4UKA)

tutorial.ts
```typescript
//function displays list of colors

/*
let displayColors = function(){
    console.log(message);
    for (let i in arguments){
        console.log(arguments[i]);
    }
}
*/

/*
displayColors('Red');
displayColors('Red', 'Blue');
displayColors('Red', 'Blue', 'Green');

//Returns
//Red
//Red, Blue
//Red, Blue, Green
//Even though there is an error?
*/

/*

let message = "List of Colors";

//Expected 0 arguments but got 1
displayColors(message, 'Red');
displayColors(message, 'Red', 'Blue');
displayColors(message, 'Red', 'Blue', 'Green');

//Returns
// List of Colors
// List of Colors
// Red
// List of Colors
// List of Colors
// Red
// Blue
// List of Colors
// List of Colors
// Red
// Blue
// Green

*/

/*

//Rest parameter represents an indefinite 
//number of arguments as an array

//colors is going to convert list of arguments into array
//then iterate through array within for loop
//Can add any number of parameters without affecting
//the for loop
//Won't be printing duplicate values
let displayColors = function(message, ...colors){
    console.log(message);

    // ["Red", "Blue", "Red"]
    //console.log(colors)

    //Arguments will always include the first argument

    for (let i in colors){
        console.log(colors[i]);
    }
}

let message = "List of Colors";

displayColors(message, 'Red');
displayColors(message, 'Red', 'Blue');
displayColors(message, 'Red', 'Blue', 'Green');

//Returns
// List of Colors
// Red
// List of Colors
// Red
// Blue
// List of Colors
// Red
// Blue
// Green

*/
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
