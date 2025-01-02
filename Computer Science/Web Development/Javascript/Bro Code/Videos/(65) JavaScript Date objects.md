---
Source:
  - https://youtube.com/watch?v=ZJ5zvvadFLs
Reviewed: false
---
index.js
```javascript
// The Date object is used to work with dates & times

let date = new Date();
//# of milliseconds to date constructor
//0 is a reference point
//let date = new Date(0);

//year,month, day, hour, minutes, seconds, milliseconds
//let date = new Date(2023, 0, 1, 2, 3, 4, 5);

//string representation
//let date = new Date("January 1, 2023 00:00:00");


console.log(date.getMilliseconds());


/*

//Example,Sunday November 27, 2022

//Gives current year (2022)
let year = date.getFullYear();

//Gets day of month (27)
let dayOfMonth = date.getDate();

//Gets day of year (0 for Sunday)
let dayOfWeek = date.getDay();

//Gets month (10 for November)
let month = date.getMonth();

//hours in military time (0 to 23)
let hour = date.getHours();

//minutes (0 to 59)
let minutes = date.getMinutes();

//seconds (0 to 59)
let seconds = date.getSeconds();

//milliseconds (0 to 999)
let ms = date.getMilliseconds();
*/
/*
//Sets the year of date to 2024
date.setFullYear(2024);

//Sets the month to December
date.setMonth(11);

//Sets the day of month to 31
date.setDate(31);

//Sets hours to 23:00:00
date.setHours(23);

//Sets minutes to 00:01:00
date.setMinutes(1);

//Sets seconds to 00:00:30
date.setSeconds(30);

//Sets milliseconds to 00:00:00
date.setMilliseconds(0);
*/

date = date.toLocaleString();

//11/27/2022, 9:09:41 AM
document.getElementById("myLabel").innerHTML = date;

function formatDate(date){
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    //gives a day format (Ex: 2/7/2022)
    return `${month}/${day}/${year}`
}
function formatTime(date){
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let amOrPm = hours >= 12 ? "pm" : "am";

    //converts military time to standard
    //if hours is 0, then hours = 12
    hours = (hours % 12) || 12;

    return `${hours}:${minutes}:${seconds} ${amOrPm}`
}

let x = 0;

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
    <label id="myLabel"></label>
    <script src="index.js"></script>
</body>
</html>
```

Output
"11/27/2022, 9:23:47 AM" on webpage