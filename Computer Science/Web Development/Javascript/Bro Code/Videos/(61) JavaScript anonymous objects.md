[Video](https://youtube.com/watch?v=ooWY5oiDkDo)

index.js
```javascript
// ananymous objects = Objects without a name
//                     Not directly referenced
//                     Less syntax. No need for unique names

class Card{
  constructor(value, suit){
      this.value = value;
      this.suit = suit;
  }
}

//pretty much storing objects in an array?
let cards = [new Card("A", "Hearts"), 
           new Card("A", "Spades"), 
           new Card("A", "Diamonds"), 
           new Card("A", "Clubs"), 
           new Card("2", "Hearts"), 
           new Card("2", "Spades"), 
           new Card("2", "Diamonds"), 
           new Card("2", "Clubs")];

cards.forEach(card => console.log(`${card.value} ${card.suit}`));
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
```
A Hearts
A Spades
A Diamonds
A Clubs
2 Hearts
2 Spades
2 Diamonds
2 Clubs
```