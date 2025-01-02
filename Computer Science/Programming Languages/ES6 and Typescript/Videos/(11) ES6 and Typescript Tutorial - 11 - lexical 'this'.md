---
Source:
  - https://youtube.com/watch?v=0T5M3agKEnk
Reviewed: false
---
tutorial.ts
```typescript
/*
var employee = {
    id: 1,
    greet: function(){
        console.log(this.id)
    }
};
employee.greet();
//output is 1
*/


/*
var employee = {
    id: 1,
    greet: function(){
        //moved console into timer function so it's
        //called after 1 second
        //When you have a function, it's going to create
        //it's own context for the "this" keyword
        //"this" keyword is bound to the setTimeout function()
        //it does not have context of outer function
        setTimeout(function(){console.log(this.id)},1000);
    }
};
employee.greet();
//returns undefined
*/

/*
var employee = {
    id: 1,
    greet: function(){
        var self = this;
        //by creating another variable, we are saving the 
        //context of "this" keyword for the setTimeout function
        //Arrow functions give us an easier solution
        setTimeout(function(){console.log(self.id)},1000);
    }
};
employee.greet();
//returns 1
*/

//arrow functions reduce amount code we write
//arrow functions also solve problem using 
//"this" keyword inside of function
var employee = {
    id: 1,
    greet: function(){
        //Arrow function does not create its own "this"
        //"this" will refer to its parent
        //Great for execution-context
        setTimeout(() => {console.log(this.id)},1000);
    }
};
employee.greet();
//returns 1
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


