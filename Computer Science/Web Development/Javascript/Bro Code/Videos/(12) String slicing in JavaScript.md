---
Source:
  - https://youtube.com/watch?v=5CgPaeWy4yQ
---
index.js
```javascript
// slice() extracts a section of a string 
//         and returns it as a new string, 
//         without modifying the original string

let fullName = "Snoop Dogg";
let firstName;
let lastName;

//This is to manually slice a string
//firstName = fullName.slice(0, 3);
//lastName = fullName.slice(4);

firstName = fullName.slice(0, fullName.indexOf(" "));
lastName = fullName.slice(fullName.indexOf(" ") + 1);

console.log(firstName);
console.log(lastName);


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
</head>
<body>
    <script src="index.js"></script>
</body>
</html>
```

Output
`Snoop`
`Dogg`

