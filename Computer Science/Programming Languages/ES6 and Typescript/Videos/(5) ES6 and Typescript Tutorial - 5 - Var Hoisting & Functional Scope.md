---
Source:
  - https://youtube.com/watch?v=izlLVx_dTH0
---
index.html
```HTML
<html>
    <head>
        <script type="text/javascript" src="scripts/tutorial5.js">

        </script>
    </head>
</html>
```

tutorial5.ts
```typescript
//It accepts 'name' as a parameter
function greetPerson(name) {
    /*
    We have 2 declarations of the same variable
    In javascript, it's completely fine because of hoisting
    
    Behind the scenes, javascript is rewritten to have a 
    single declaration of the variable at the top ignoring 
    any duplicate declarations. 

    if (name === "Chandler"){
        var greet = "Hello Chandler";
    }else{
        var greet = "Hi there";
    }

    the definitions of "var greet" above will be
    rewritten below. This is how javascript is
    going to be rewritten

    Any var declaration will be moved to the very top
    of the function. So placing "var greet" at the bottom
    will be moved to the top

    var greet;
    if (name === "Chandler"){
        greet = "Hello Chandler";
    }else{
        greet = "Hi there";
    }


    */
    if (name === "Chandler"){
        var greet = "Hello Chandler";
    }else{
        var greet = "Hi there";
    }
    console.log(greet);

    /*
     A var declaration has a functional scope. Even though
    var is declared inside if block, you can still access
    it in console.log

    The value is going to be accesible within the function.

    Because of hoisting and functional scope, var declaration
    can be a little tricky which is why ES2015 introduced the 
    "let" keyword
    */
}
greetPerson("Chandler");
```

Output:
`Hello Chandler`
