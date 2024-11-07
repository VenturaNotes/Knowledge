[Video](https://youtube.com/watch?v=j8zDXBSfAAk)

- Need editor to write our code
- Need typescript compiler to transpile our code
- [[npm]] is node-package manager
	- helps manage our dependencies
- Go to nodejs.org and download the latest version which would also install npm
- Steps
	- Create a folder ES2015
	- Open terminal in folder
	- Type `sudo npm install typescript -g`
	- Type `tsc -init` inside the folder
	- Do "Command + Shift + B" and click on the gear icon for "tsc: watch - tsconfig.json"
	- In tsconfig.json
		- Change "sourceMap" to true
			- This is so we have a mapping from the typescript file to the javascript file which will help with debugging
		- Add `"outDir": "scripts/"` in tsconfig.json
			- where all the transpiled javascript files will exist
		- Set "strict" to false
	- Create file demo.ts
	- Do `sudo npm install -g ts-node` in terminal to install ts-node globally so that it can be run from any directory. Also no `sudo npm install -g typescript` after it. [^1]
	- Do Command + shift + b and a new `scripts` folder will pop up + waiting for changes
		- Will get a `demo.js` file and a `demo.js.map` file too
		- ![[Screenshot 2022-11-26 at 7.00.24 AM.png]]
	- Create an index.html file
	- If I opened the html file itself, it would show me "Hello World" in console
	- In the ES2015 folder, type `sudo npm install lite-server -g`
		- This will install globally
	- Type lite-server in the folder of ES2015. This will show the blank page with "hello world" in console
- The shortcut for "inspect" is "Command + Shift + C"

demo.ts
```typescript
console.log("Hello World");
```

index.html
```HTML
<html>
    <head>
        <script type="text/javascript" src="scripts/demo.js">

        </script>
    </head>
</html>
```

## References

[^1]: https://bobbyhadz.com/blog/npm-command-not-found-ts-node#:~:text=alternatively%2C%20you%20can%20install%20ts-node%20globally%20or%20as%20a%20development%20dependency.