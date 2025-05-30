---
Source:
  - https://youtube.com/watch?v=YYXdXT2l-Gg
Reviewed: false
---
- Install python and setup development environment
- Steps for installing Python on Mac
	- Python is pre-installed on mac
	- Open terminal
	- Type:`python --version`
		- You want python 3
	- Go to https://www.python.org/downloads
		- Download latest version of python 3
	- Python folder will be downloaded to your applications with an IDLE.app
	- Go to terminal again and type: `python3 --version` to check if installed
	- Can create an alias if you want to be able to use the `python` command with python3
		- Can add a line to a .bash profile file
			- Allows us to associate `python` command with python3
	- Type in terminal
		- `nano ~/.bash_profile`
			- nano: an easy editor for beginners 
			- the `~` means home directory
		- In the bash file, there is a path variable being set for Python 3.6 which allows the python3 command to work
		- To add an alias do
			- `alias python=python3` 
				- at the end of file
			- `control + x` 
				- to close
			- `y` 
				- to save what we did
			- `enter` 
				- to keep same file name
	- Back in terminal, doing `python --version` now lets us use python 3 and shows us the version installed on our system
		- alia not necessary but using the `python` command can make things simpler
- Steps for installing Python on Windows
	- Get command prompt by going to start, search for `cmd` and it opens it
		- You can change the font size by right-clicking the command prompt window, going to properties, font and change size to something greater (such as 12x16)
	- Type in `python --version` in command prompt
		- Most likely will get python is not recognized error
	- Go to https://www.python.org/downloads and download python 3
		-  Make sure during installation, "Add Python 3.6 to PATH" is checked positive
			- Allows us to prevent going to the advanced system settings and setting the path manually
			- Will allow python to work in command prompt
		- Then click "install now"
	- Type into a new command prompt: `python --version`
		- It should show `Python <version number>"
	- Click "Start" and "All programs", you'll find the "Python 3.6" folder
		- In folder, you have a program called IDLE
- Open Terminal
	- type in `python`
		- Will open an interactive prompt
		- Shows that we're using python 3.6
	- Allows us to write 1 line of python at a time
	- can type `print('Hello World')`
		- This will print out Hello World in the command prompt
	- doing `x = 10` pressing enter and then `print(x)`, you will print the # 10
	- Interactive prompt is great for testing python commands
		- We actually want a python file where we can write multiple lines and run an entire script
	- To exist prompt, type `exit()`
- Open IDLE.app in the Python folder in Applications
	- To make font larger in IDLE, you can go to preferences and change the size to 18 in the Fonts/Tabs default tab
	- By default, it is just another interactive prompt to write 1 line at a time
		- The 3 arrows `>>>` indicates this
	- To create a file, go to file, new file
		- This will create a file where we can actually write a script in python with multiple lines
			```python
			print("Hello World")
			```
		- Save this file by clicking on file -> Save and name it `intro.py` saved on Desktop
- To run script, go to terminal, type in `python Desktop/intro.py` to access the directory where the python script is in
	- It will print out "Hello World"
- Script with in-line comment
```python
# Print Welcome Message
print("Hello World")
```
- Running the above script will ignore the comment
- Can use plain-text editors if you want to write python code
	- Can use command-line editors such as vim or emacs
	- 1 popular editor is https://wwwsublimetext.com
	- Another is https://www.atom.io
	- You can run python directly in the editor.
		- Tools -> Build
- A popular IDE is JetBrains PyCharm
	- Helps with debugging and running an application
- Can use the IDLE application or command line to run scripts
- Or you could use text editors