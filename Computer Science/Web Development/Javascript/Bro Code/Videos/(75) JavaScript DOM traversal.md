[Video](https://youtube.com/watch?v=080xF4VDvjw)

![[Screenshot 2022-12-11 at 9.14.08 PM.png]]
- Family relationships between elements
- Unordered lists of fruit, vegetables and dessert are children of `<body>` which is the parent
	- Since the fruit `ul` is first in the body, it is the firstChild
	- dessert is the lastChild
- By selecting middle list of vegetables, then  the `<body>` element is the parent and the fruit and dessert lists are both siblings
	- Since fruit appears before vegetables, it's considered the `previous sibling`
	- dessert would be considered the `next sibling`
- The unordered list has children too. Each list item is a child of the unordered list
	- This was a quick overview of the family relationships between elements

index.js
```javascript
//These are a few down traversal techniques

//selects the body of the document
//let element = document.body;

let element = document.querySelector("#fruit");
let child = element.firstElementChild;
child.style.backgroundColor = "lightgreen";


/*
//makes each child of list green
let element2 = document.querySelector("#dessert");
let children = Array.from(element2.children);
children.forEach(child => child.style.backgroundColor = "lightgreen")
*/

//Getting this from document.body would return the fruits
//Getting this from "#fruit" would select "apple"
// .firstElementChild

//Getting this from body would return the index.js script
//Getting this from "#fruit" would select "banana"
// .lastElementChild

//Getting this from "#vegetables" would get the entire body
//      of the document
// .parentElement

//Getting this from "#vegetables" would select the desserts list
// .nextElementSibling

//Getting this from "#vegetables" would select pervious list of fruti
// .previousElementSibling

//Getting this from "#fruit" would select "apple"
// .children[0]

//doing element.childern does not have a for each method
//Creating an array for it will allow us to do a forEach()
// Array.from(.children)

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
    <ul id="vegetables">
        <li>carrots</li>
        <li>potatoes</li>
        <li>onions</li>
    </ul>
    <ul id="dessert">
        <li>ice cream</li>
        <li>cake</li>
        <li>pie</li>
    </ul>
    <script src="index.js"></script>
</body>
</html>
```

Output
![[Screenshot 2022-12-11 at 9.27.59 PM.png|300]]