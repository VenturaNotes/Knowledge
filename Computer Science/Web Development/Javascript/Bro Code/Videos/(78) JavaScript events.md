---
Source:
  - https://youtube.com/watch?v=ntJUB5ptpIw
---
index.js
```javascript
//An event is some action that the user or
//the browser does. Many HTML elements contain event attributes

//const element = document.getElementById("myButton");
//const element = document.body;
//const element = document.getElementById("myText");
const element = document.getElementById("myDiv");

//Able to set the onclick attribute in js
//This is one event attribute
//Make sure not to invoke it. It's a callback
//element.onclick = doSomething;

//When the web browser loads, do something
//could also place this in the body of the html code
//element.onload = doSomething;

//activates when an element has been changed
//element.onchange = doSomething;


//Does something when mouse moves over element
//element.onmouseover = doSomething;
//element.onmouseout = doSomethingElse;

//Holding down of mouse button
element.onmousedown = doSomething;

//Letting go of mouse button
element.onmouseup = doSomethingElse;

function doSomething(){
    //alert("You did something!");
    element.style.backgroundColor = "red";
}
function doSomethingElse(){
    //alert("You did something!");
    element.style.backgroundColor = "lightgreen";
}
```

index.html
```html
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
    <button id="myButton">button</button>
    <input id="myText">
    <div id="myDiv"></div>
    <script src="index.js"></script>
</body>
</html>
```

style.css
```CSS
#myDiv{
    background-color: lightgreen;
    width: 100px;
    height: 100px;
}
```

Output:
![[Screenshot 2022-12-11 at 9.52.52 PM.png]]
- Holding down on square turns red and letting go turns back to green