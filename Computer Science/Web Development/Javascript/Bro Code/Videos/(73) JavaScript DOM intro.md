---
Source:
  - https://youtube.com/watch?v=IXEP7V7ZSZI
Reviewed: false
---
![[Screenshot 2022-12-11 at 8.51.04 PM.png]]

index.js
```javascript
// DOM = Document Object Model (API - Application Programming Interface)
//       An interface for changing the content of a page
//       Arranged in a hierarchical tree

//Entry-point of our DOM
//Will display our DOM and everything in t
// console.log(document);

//Will show all properties of DOM
//console.dir(document)

//Access title of DOM
//console.log(document.title);

//Access URL of DOM
//console.log(document.URL);

//This changes the title of the tab of the webpage
document.title = "Title goes here!"; 

//This will take you to Google.com
//document.location ="http://www.google.com";

//Access to body element
//Change background color of document
document.body.style.backgroundColor = "skyblue";

//Changes an HTML element such as a div tag
document.getElementById("myDiv").innerHTML = "Hello";
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
    <div id= "myDiv"></div>
    <script src="index.js"></script>
</body>
</html>
```

Output on Webpage:
![[Screenshot 2022-12-11 at 8.54.43 PM.png]]