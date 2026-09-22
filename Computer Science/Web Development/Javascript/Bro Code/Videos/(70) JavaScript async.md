---
Source:
  - https://youtube.com/watch?v=0Xm9PsqcFnA
---
index.js
```javascript
// async = makes a function return a Promise
// await = makes a function wait for a Promise


async function loadFile(){
  let fileLoaded = true;

  if(fileLoaded){
      return "File loaded";
  }
  else{
      throw "File NOT loaded";
  }
}

loadFile().then(value => console.log(value))
               .catch(error => console.log(error));



///Alternative Method
async function loadFile(){
  let fileLoaded = true;

  if(fileLoaded){
      return Promise.resolve("File loaded");
  }
  else{
      throw Promise.reject("File NOT loaded");
  }
}

loadFile().then(value => console.log(value))
               .catch(error => console.log(error));
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
File Loaded
File Loaded
```