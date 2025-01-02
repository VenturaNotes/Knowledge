---
Source:
  - https://youtube.com/watch?v=bHSjfXJBKaY
Reviewed: false
---
index.js
```javascript
// class = a blueprint for creating objects
//              define what properties and methods they have
//              use a constructor for unique properties

class Player{

  score = 0;

  pause(){
      console.log("You paused the game");
  }
  exit(){
      console.log("You exited the game");
  }
}

const player1 = new Player();
const player2 = new Player();
const player3 = new Player();
const player4 = new Player();

player1.score += 1;

console.log(player1.score);
console.log(player2.score);

player1.pause();
player2.exit();
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
1
0
You paused the game
You exited the game
```