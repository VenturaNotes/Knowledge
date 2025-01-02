---
Source:
  - https://youtube.com/watch?v=oDy-NpWWn0I
Reviewed: false
---
index.js
```javascript
/* 
//Changes the background Color of "This is the Menu" to light green

let element = document.getElementById("myTitle");
element.style.backgroundColor = "lightgreen";
*/

/*
//Sees that the orange fruit is checked and prints it to console
//This gets the elements by name

let fruits = document.getElementsByName("fruits");
fruits.forEach(fruit => {
    if(fruit.checked){
        console.log(fruit.value);
    }
})
*/

/*
//This returns an html collection which behaves similarly to an array
////This gets the elements by tag name
//Changes the 0th element's background to lightgreen

let vegetables = document.getElementsByTagName("li");
vegetables[0].style.backgroundColor = "lightgreen";
*/


/*
//Gets an element by the class name and highlights in green

let desserts = document.getElementsByClassName("desserts");
desserts[0].style.backgroundColor = "lightgreen";
*/


/*
//querySelector lets us select an element by id, a class name, 
//        a tag, or an attribute
//if selecting an id, precede the name with a # like "#myTitle"
//if seleting a class name, precede the name with a . like ".desserts"
//        querySelector selects the first element of any group
//First element of the "for" attribute is selected

let element = document.querySelector("[for]");
element.style.backgroundColor = "lightgreen";
*/


//querySelectorAll gets all of the elements
//highlights all elements with the "for" attribute lightgreen

let elements = document.querySelectorAll("[for]");
elements.forEach(element => {
    element.style.backgroundColor = "lightgreen";
})
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

    <h1 id="myTitle">This is the Menu</h1>

    <input type="radio" name="fruits" value="apple">
    <label for="apple">apple</label><br>
    <input type="radio" name="fruits" value="orange" checked="checked">
    <label for="orange">orange</label><br>
    <input type="radio" name="fruits" value="banana">
    <label for="banana">banana</label><br>

    <!-- ul stands for unordered list-->
    <ul>
        <li>carrots</li>
        <li>potatoes</li>
        <li>onions</li>
    </ul>

    <div class="desserts">ice cream</div>
    <div class="desserts">cake</div>
    <div class="desserts">pie</div>
    
    <script src="index.js"></script>
</body>
</html>
```

Output:
![[Screenshot 2022-12-11 at 9.12.13 PM.png|300]]
