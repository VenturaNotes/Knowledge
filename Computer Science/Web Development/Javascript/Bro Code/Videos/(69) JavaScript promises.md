---
Source:
  - https://youtube.com/watch?v=-gTS6-E3WRk
Reviewed: false
---
index.js
```javascript
// promise = object that encapsulates the result of an asynchronous operation
//                   let asynchronous methods return values like synchronous methods
//                   "I promise to return something in the future"

//           the STATE is 'pending' then: 'fulfilled' or 'rejected'
//           the RESULT is what can be returned
//           2 parts producing & consuming

// ------------- Example 1 -------------
//Don't need to reject a promise
const promise = new Promise((resolve, reject) => {
 
  let fileLoaded = false;

  if(fileLoaded){
      resolve("File loaded");
  }
  else{
      reject("File NOT loaded");
  }
});

promise.then(value => console.log(value))
            .catch(error => console.log(error));

// ------------- Example 2 -------------
/*
const wait = time => new Promise(resolve => {
  setTimeout(resolve, time);
});

wait(3000).then(() => console.log("Thanks for waiting!"));
*/
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
`File NOT loaded`