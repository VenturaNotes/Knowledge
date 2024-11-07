[Video](https://youtube.com/watch?v=DXd_jHtOnDM)

index.js
```javascript
//JavaScript toLocaleString() currency

//toLocaleString() = returns a string with a language 
//                                sensitive representation of this number

// number.toLocaleString(locale, {options});


// 'locale' = specify that language (undefined = default set in browser)

// 'options' = object with formatting options
//Currency
//A unit of measurement
//A percent

let myNum = 123456.789;

//whatever language you need, just look up the format code
//then pass that as a string


//123,456.789
//Adds a comma every thousandths place
//myNum = myNum.toLocaleString("en-US"); // US English

//1,23,456.789
//Different number formatting system 
//myNum = myNum.toLocaleString("hi-IN"); // Hindi

//123.456,789
//myNum = myNum.toLocaleString("de-DE"); // standard German

//$123,456.79
//myNum = myNum.toLocaleString("en-US", {style: "currency", currency: "USD"});

//₹1,23,456.79
//myNum = myNum.toLocaleString("hi-IN", {style: "currency", currency: "INR"});

//123.456,79 €
//myNum = myNum.toLocaleString("de-DE", {style: "currency", currency: "EUR"});

//12,345,679%
//myNum = myNum.toLocaleString(undefined, {style: "percent"});

//123,456.789°C
//myNum = myNum.toLocaleString(undefined, {style: "unit", unit: "celsius"});

//console.log(myNum);
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
None
