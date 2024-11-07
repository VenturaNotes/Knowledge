[Video](https://youtube.com/watch?v=X9-j31qT1TQ)

index.js
```javascript
// .addEventListener(event, function, useCapture)
// You can add many event handlers to one element.
// Even the same event that invokes different functions

const innerDiv = document.getElementById("innerDiv");
const outerDiv = document.getElementById("outerDiv");

innerDiv.addEventListener("click", changeBlue);

//by changing this to true, we handle the outerdiv first
//      before the innerDiv. This is a way to specify which
//      one has preference. Allows for outer element to be handled first
outerDiv.addEventListener("click", changeBlue, true);

function changeBlue(){
    alert(`You selected ${this.id}`);
    this.style.backgroundColor = "lightblue"
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
    <div id="outerDiv">
    <div id="innerDiv"></div>
    <div>
    <script src="index.js"></script>
</body>
</html>
```

style.css
```
#innerDiv{
    background-color: lightgreen;
    width: 100px;
    height: 100px;
    border: 1px solid;
}
#outerDiv{
    background-color: lightgreen;
    width: 200px;
    height: 200px;
}
```

Output:
![[Screenshot 2022-12-11 at 9.58.41 PM.png]]
Clicking on the inner square will turn both blue. Clicking on the outer square will only turn the outer square blue but the outer square is below the inner square meaning you'll still be able to see the inner square

