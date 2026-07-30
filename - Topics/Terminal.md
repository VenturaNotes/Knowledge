## Synthesis
### Mac's Terminal
- Deletes the entire line from your current cursor position backward to the beginning of the prompt. Will remove a multi-line block of text as well
	- `Control + U` 
- When doing `cd <folder>`, you could `tab` after the `cd` to match a folder you want to enter.
	- The `tab` is case-sensitive
- Pastes message in your clipboard into the file
	- `pbpaste > o-copyFile`
- View text currently saved in clipboard
	- `pbpaste`
- Lets you create a folder within the directory you're currently in
	- `mkdir <folder_name>`
- Great for searching for files within a terminal 
	- `fzf`
- Copy file contents to your clipboard
	- `pbcopy < sample.txt`
- Copy file contents to your clipboard using `fzf`
	- `pbcopy < "$(fzf)"`
		- This ensures that even if the path contains spaces, the file at the result will copy it
		- `pbcopy` stands for pasteboard copy
- Delete word
	- `Command + w`
- Go to brand new empty prompt
	- `Ctrl + C`
- Rename a file
	- `mv old-name.txt new-name.txt`
- Create a directory
	- `mkdir MyNewFolder`
- Copying a git diff within directory on Mac
	- `git diff | pbcopy`
- Copying in the same location: To create an exact duplicate of a folder in the same directory under a new name
	- `cp -R original_folder duplicate_folder`
- (Custom) How to refresh my terminal `.zshrc` commands?
	- `src`
- Check how many shells deep I'm nested in
	- `echo $SHLVL`
- Return to parent shell
	- `exit`
- Your active shell process terminates its own memory and immediately loads a completely fresh zsh process in its place.
	- `exec zsh`
- It would start a new shell inside your current shell (nesting them), meaning your old environment would still be waiting in the background.
	- `zsh`
- Command to jump back to previous folder
	- `cd -`
- Force deleting a folder
	- `rm -rf folder_name`

## Source [^1]
- A point at which data enters or leaves the computer
## Source[^2]
- (1) A data input and/or output device that is connected to a controlling processor to which it is subservient and usually remote. There is a very wide range of terminal types. The VDU is frequently used as a terminal by which a user can input queries or instructions and receive instructions. The information may be in the form of text or it may be mainly graphical. Terminals designed for a particular environment and business activity come under a general heading of application terminals. If the terminal has a built-in capability to store and manipulate data it is classed as an intelligent terminal; without this capability terminals are classed as dumb. 
- (2) (terminal symbol) See GRAMMAR.
## Source[^3]
- A terminal is a device that combines the functions of a computer and display. Terminals come in three forms—dumb, smart, and intelligent—with each one offering different capabilities and uses. Dumb terminals have no processing power or memory and rely on a host computer system to which they are attached. Smart terminals can perform simple functions but send most work back to the host for processing before displaying it on screen or printing it as output. Finally, intelligent terminals can execute software locally without external resources from other systems (i.e., servers). This lets them perform tasks independently while connecting over networks such as Wi-Fi for internet access.
## Source[^4]
- A computer input and output device. It commonly consists of a keyboard and display screen, connected to the computer. Terminals that are distant from the computer and connected to it by a communications link are called remote terminals. Terminals with some computing power, often incorporating a microprocessor, are called intelligent terminals. Specialized terminals have been developed for use in banking and retailing.
## Source[^5]
- (1) Any of the points at which interconnecting leads may be attached to an electronic circuit or device and at which signals may be input or output. 
- (2) A device that provides input/output facilities to a computer, often from a remote location. It may be used interactively and usually contains a keyboard and/or visual display unit. An intelligent terminal contains some local storage and processing ability and can perform simple tasks independently of the main computer.
## Source[^6]
- He does not recommend using "Oh My ZSH". 
	1. Unnecessary bloat (as a plugin manager)
	2. Naming conflict increases difficulty
	3. Unnecessary updates
	4. Potential startup performance hit
## References

[^1]: https://youtu.be/HGYOEeik844?si=7KJaPkDktjARENM4
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^3]: [[(Home Page) Glossary by Capterra]]
[^4]: [[(Home Page) A Dictionary of Business and Management 6th Edition by Oxford Reference]]
[^5]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]
[^6]: https://www.youtube.com/watch?v=21_WkzBErQk #source/noted