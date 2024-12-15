---
Source:
  - https://youtube.com/watch?v=w5frxtUbcNU
---
index.js
``` javascript
// async = makes a function return a Promise
// await = makes a function wait for a Promise

/*
Popular alternative to writing consuming code is the "await" keyword

*/

async function loadFile(){

  const promise = new Promise((resolve, reject) => {
    let fileLoaded = true;

    if(fileLoaded){
        resolve("File loaded");
    }
    else{
        reject("File NOT loaded");
    }
  })

  try{
    document.getElementById("myH1").innerHTML = await promise;
  }
  catch(error){
    document.getElementById("myH1").innerHTML = error;
  }
}
loadFile();
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
    <h1 id="myH1"></h1>
    <script src="index.js"></script>
</body>
</html>
```

Output
"File Loaded" as h1 text on webpage.