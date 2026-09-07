## Synthesis
- A built-in Zsh command that tells you how the shell interprets any command name you give it (similar to `which` or `type`, but faster and native to Zsh).
	- [ ] How does `which` or `type` work?
- Doing `whence -w` tells Zsh to just print the word type (classification) instead of the path or code. 
	- Examples
		- `whence -w help`
			- Response: `help: none`
				- This is because this command does not exist
		- `whence -w zsh`
			- Response: `zsh: command`
				- Tells us that `zsh` is a command
## Source [^1]
- 
## References

[^1]: 