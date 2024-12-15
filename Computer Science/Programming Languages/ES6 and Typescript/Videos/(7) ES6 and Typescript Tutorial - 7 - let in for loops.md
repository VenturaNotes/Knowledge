---
Source:
  - https://youtube.com/watch?v=WiwMkh9_WGw
---
Control + C kills terminal when doing lite-server

tutorial.ts
```typescript

/*
When running the below code, the output is "6" five times

This problem occurs because we are passing the reference
to the variable "i" and not the actual value atm inside
each loop. By the time the setTimer is executed, the for
statement is already executed and incremented to the value
6. This is the exit condition for "for" loop.

To achieve desired result, we need to use IIFE
(Immediately-Invoked Function Expressions, pronounced "iffy")

Now a simple way is to use the "let" keyword. After
one second, we'd get 1, 2, 3, 4, 5.

Can read about closures and IIFE

*/
for(let i=1; i<=5; i++)
{
    setTimeout(function(){console.log(i);},1000)
}

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
