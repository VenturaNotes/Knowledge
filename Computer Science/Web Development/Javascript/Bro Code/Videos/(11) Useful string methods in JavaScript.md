[Video](https://youtube.com/watch?v=bwqy8RZxrS4)


index.js
```javascript
// useful string properties & methods

let userName = "Bro Code";
let phoneNumber = "123-456-7890";

//length of string
//console.log(userName.length);

//index of first character
//console.log(userName.charAt(0));

//first index of character o
//console.log(userName.indexOf("o"));

//last occurrence of o
//console.log(userName.lastIndexOf("o"));

//gets rid of empty spaces before
//userName = userName.trim();

//Makes string all uppercase
//userName = userName.toUpperCase();

//Makes string all lowercase
//userName = userName.toLowerCase();

//replaces all dashes with spaces
phoneNumber = phoneNumber.replaceAll("-", "");

console.log(phoneNumber);
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
`1234567890`