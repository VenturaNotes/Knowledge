[Video](https://youtube.com/watch?v=STEfmxQjO2Q)

- What is JavaScript?
	- A web-based interpreted programming language
		- Add interactive behavior to webpages
		- Build web and mobile applications
		- Create command line tools
		- develop games
- Important Notes
	- Javascript $\ne$ Java
		- Bath languages were developed around the same time
	- Knowing HTML & CSS is helpful, but not necessary
- What you'll need:
	- Web browser (javascript runs in a web browser)
		- Chrome, Firefox, safari or internet explorer
	- Text editor
		- VS code, sublime text, replit.com (online text editor), notepad (not typically used)
- In VScode, download "Live Server" extension
	- Every time you save js file, it'll update current web browser right away to reflect any changes
- Create 3 files
	- index.html (landing page)
		- type "`!` + tab" to get default DOCTYPE
			- Generates sample text used to create a webpage
		- Right click on this file and press "Open with Live Server"
			- The window is a representation of the HTML file
			- You can easily go to console by right clicking -> inspect -> console tab
	- index.js
	- style.css

I get warnings below when showing console
![[Screenshot 2022-11-26 at 3.44.19 AM.png]]
- To fix this, I need to disable the options in settings -> sources 
	- "Enable Javascript source maps"
	- "Enable CSS source maps" [^1]
- Also make sure some extensions don't interfere with your work

index.js
```javascript
//Displays output to console on website
console.log("I like pizza!");
console.log("It's really good!");

//This creates an alert box making a pop-up
window.alert("I REALLY LOVE PIZZA!");

//This is a comment
/*
    This
    is
    a
    multiline
    comment
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
    <link rel="'stylesheet" href="style.css">
</head>
<body>
    <script src="index.js"></script>
</body>
</html>
```

style.css (blank intentionally)
```CSS
```

Output
![[Screenshot 2022-11-26 at 4.02.38 AM.png|500]]

## References

[^1]: https://stackoverflow.com/questions/61339968/error-message-devtools-failed-to-load-sourcemap-could-not-load-content-for-chr#:~:text=go%20to%20Settings.-,Then%2C%20look%20for%20Sources,Enable%20JavaScript%20source%20maps%22,-%22Enable%20CSS%20source