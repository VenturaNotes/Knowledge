---
Source:
  - https://youtube.com/watch?v=QNq5tUim_0o
---
index.js
```javascript
// break = breaks out of a loop entirely
// continue = skip an iteration of a loop

for(let i = 1; i <= 20; i+=1){
    if(i == 13){
        //break; //only up to 12 would be printed
        //continue; //13 would not be printed
    }
    console.log(i);
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
    <script src="index.js"></script>
</body>
</html>
```

Output
All numbers from 0 to 20 on their own line.

