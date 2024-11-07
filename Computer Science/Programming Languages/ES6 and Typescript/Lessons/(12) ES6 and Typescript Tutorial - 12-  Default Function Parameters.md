[Video](https://youtube.com/watch?v=6eOOh1b03-o)

tutorial.ts
```typescript
/*
- When parameter is not specified for a function during its call
then the value would be undefined
*/

/*

//We can now set default values for parameters
//in parenthesis
let getValue = function(value=10, bonus=5){
    console.log(value+bonus);
};
getValue(); //15 (10+5)
getValue(20); //25 (20+5)
getValue(20,30); //50 (20+30)
//Can specify as undefined 
//if you don't want to define it
getValue(undefined,30); //40 (10+30)
*/

//You can use a parameter to express a default value
//for another parameter

//Can also replace 0.1 with variable/arrow function giving same result
//let percentBonus = 0.1;
//let percentBonus = () => 0.1;
//You would write percentBonus() to replace 0.1 for function call
//
//Can't assign value of bonus to parameter value of value for default
//since we don't know what the value of bonus is.
//Assigning default for params left to right works but not right to left
let getValue = function(value=10, bonus=value*0.1){
    console.log(value+bonus);
    //only takes into consideration the number of parameters passed
    //Will ignore any default values
    console.log(arguments.length);
};

//arguments returns 0
getValue(); //11 (10 + 10*0.1 = 10 + 1)

//arguments returns 1
getValue(20); //22 (20 + 20*0.1 = 20 + 2)

//arcuments returns 2
getValue(20,30); //50 (20+30)

//arguments returns 2
getValue(undefined,30);//40 (10 + 30)
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



