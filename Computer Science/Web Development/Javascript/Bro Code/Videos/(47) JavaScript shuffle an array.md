---
Source:
  - https://youtube.com/watch?v=FB39IeZu-GM
---
index.js
```javascript
let cards = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

shuffle(cards);

console.log(cards);
//console.log(cards[0]);
//cards.forEach(card => console.log(card));

function shuffle(array){
  let currentIndex = array.length;

  while(currentIndex != 0){
    //Math.random() returns a number between greater than or
    //      equal to 0 and less than 1

    let randomIndex = Math.floor(Math.random() * array.length);
    currentIndex-=1;

    //swaps 2 indices
    let temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  
  return array;
}
```

- Does this only work for functions?
	- cards.forEach(card => console.log(card))

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
(One Version)
`(13) ['2', '9', '4', 'K', 'J', '6', '3', 'A', '5', 'Q', '8', '7', '10']`
