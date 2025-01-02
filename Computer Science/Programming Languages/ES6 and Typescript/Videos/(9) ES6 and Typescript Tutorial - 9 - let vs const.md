---
Source:
  - https://youtube.com/watch?v=kFgb4Hcxer8
Reviewed: false
---
tutorial.ts
```typescript
/*
Use const over let as much as possible
const helps us identify variables that
are getting reassigned when that wasn't our intention

Use let when reassignment is expected
Use const when a new value assignment is not expected
*/

//Can be used in formulas for circumference of a circle
const PI = 3.14;

//Maximum size of array
const MAX_SIZE = 100;

//When trying to swap 2 values
let a = 5;
let b = 10;

a = a+b;
b = a-b;
a = a-b;

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


