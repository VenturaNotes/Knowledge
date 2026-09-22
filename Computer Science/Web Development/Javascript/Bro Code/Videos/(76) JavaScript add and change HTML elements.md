---
Source:
  - https://youtube.com/watch?v=Ri8LCEfxZag
---
index.js
```javascript
// add/change HTML elements
// .innerHTML (vulnerable to XSS attacks)
// .textContent (more secure)


/*
//The problem with using .innerHTML is that you could assign
//some tags along with some text. If we ran this, we could 
//place a malicious script within the user input which
//is an example of a cross site script attack.
//A script you can write is have a popup that says virus

const nameTag = document.createElement("h1");
nameTag.innerHTML = window.prompt("Enter your name");
document.body.append(nameTag);
*/

//Creates an h1 header tag
//.textContent will parse a script as text rather than
//running it
const nameTag = document.createElement("h1");
nameTag.textContent = "Bro";
document.body.append(nameTag);

const myList = document.querySelector("#fruit");
const listItem = document.createElement("li");
listItem.textContent = "mango";

//Seems like you can only append the item once
//        to the list?

//Appends a list item to end of list
//myList.append(listItem);

//Appends list item to beginning of list
//myList.prepend(listItem);

//Inserts element at index 1
myList.insertBefore(listItem, myList.getElementsByTagName("li")[1]);
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
    <ul id="fruit">
        <li>apple</li>
        <li>orange</li>
        <li>banana</li>
    </ul>
    <script src="index.js"></script>
</body>
</html>
```

Output:
![[Screenshot 2022-12-11 at 9.40.21 PM.png|300]]