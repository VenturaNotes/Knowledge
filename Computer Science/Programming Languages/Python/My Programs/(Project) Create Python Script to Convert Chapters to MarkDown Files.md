---
tags:
  - status/complete
  - type/project
---

- Copy and paste chapters from textbook to text file
- Insert text file into VS Code Python Folder
- In VS Code, go to Code > Preferences > Settings and type `Execute in File Dir`. Make sure this checkmark is turned on [^1]
	- sys and os directories are different for some reason?
		- `print(sys.path[0])` returns
			- `/Users/julianventura/Desktop/VSCode/Python` (desired path)
		- `print(os.getcwd())` returns
			- `/Users/julianventura/Desktop/VSCode` (undesired path)
		- One solution is to change the terminal directory by doing `cd Python`. This gave us the directory we needed to work with
		- `import os` and `print(os.chdir("Python"))` [^2]
			- This lets me change the directory if it exists in current directory
		- `files = os.listdir(cwd) # Get all the files in that directory`
- How do I want to parse the file?
	- The line must contain words in it
	- Keep reading the line until it contains characters
		- Exceptions
			- 11 wavelets 385
				- Does not contain any dots
			- 12.9.2 The Exponential generating function and the moment generating function
				- Is contained on 2 separate lines (function is)
			- 12.11Exercises
				- There is no space
		- Method
			- [x] Read line by line
				- [x] If there is a dot or number after the letters, stop reading the line
					- [x] If there is neither, continue on from next line and delete when reached when letters or dot reached
				- [x] If the next character in front of a number is a letter instead of a space, make sure to append a space before getting to the letter
				- [x] Erase line by end if there are no letters

Working Code
```python
import re

fo = open("document.txt", "r")
test = open("document_written.txt", "w")
count = 1

def translate_file():
    copied_line = ""
    char_not_found = True
    space_needed = True
    no_next_line = True

    for line in fo.readlines():

        for char in line:
            if not char.isalpha() and char_not_found:
                copied_line += char
            else:
                if char != '.' and not char.isnumeric():
                    char_not_found = False
                    copied_line += char
                else:
                    no_next_line = False
                if len(copied_line) >= 2 and space_needed:
                    space_needed = False
                    if copied_line[-1].isalpha() and copied_line[-2].isnumeric():
                        copied_line = copied_line[:-1] + " " + copied_line[-1:]

        if no_next_line and len(copied_line) > 2:
            copied_line = copied_line[:-1] + " "
            continue
        
        if re.search('[a-zA-Z]', copied_line):
            copied_line = copied_line.rstrip()
            copied_line = "[[(" + copied_line[:copied_line.find(" ")] + ")" + copied_line[copied_line.find(" "):] + "]]\n"
            
            for i in range(copied_line.count(".")):
                copied_line = "\t" + copied_line

            test.write(copied_line)
        
        copied_line = ""
        char_not_found = True
        space_needed = True
        no_next_line = True


translate_file()

fo.close()
test.close()

```

Flaws:
- Can only have a single period in the line
- Line will not end if there are no periods / numbers at the end of line

## References

[^1]: https://stackoverflow.com/questions/56776521/python-in-vscode-set-working-directory-to-python-files-path-everytime#:~:text=17-,Modify%20this%20setting%3A,Execute%20in%20File%20Dir,-Share
[^2]: https://stackoverflow.com/questions/22282760/filenotfounderror-errno-2-no-such-file-or-directory#:~:text=To%20give%20you,s%22%20%25%20(cwd%2C%20files)