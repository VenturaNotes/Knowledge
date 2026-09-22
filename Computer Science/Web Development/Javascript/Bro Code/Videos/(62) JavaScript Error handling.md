---
Source:
  - https://youtube.com/watch?v=yHdrwSLUPHg
---
index.js
```javascript
// error = object with a description of 
//             something that went wrong

// throw = executes a user-defined error

try{
  let x = window.prompt("Enter a #");
  x = Number(x);

  //throwing user defined error
  if(isNaN(x)) throw "That wasn't a number!";
  if(x == "") throw "That was empty!";

  console.log(`${x} is a number`);
}
catch(error){
  console.log(error);
}
//always exectuse even when something goes wrong
finally{
  console.log("This always executes");
}
```

index.html
```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <script src="index.js"></script>
</body>
</html>
```

Output
Prompt pops up and asks for #. Inserting # gives 
```
5 is a number
This always executes
```
Not entering a number throws an error
```
That wasn't a number!
This always executes
```