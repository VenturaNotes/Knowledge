## Synthesis

### How `launchd` Shuts Down a Process
- When you run `launchctl kickstart -k`, macOS uses a two-stage shutdown:
	1. Stage 1 (`SIGTERM` / Signal 15) — "Polite Quit":  
		- [ ] What does `SIGTERM` mean?
		- macOS sends Signal 15 to the script and starts a 5-second countdown.
			- [ ] Is it macOS or MacOS?
	2. Stage 2 (`SIGKILL` / Signal 9) — "Force Quit":  
		- If the script doesn't completely close before the 5-second timer runs out (because it was waiting inside the external `/bin/sleep` command), macOS escalates to Signal 9 to force-close it and launch the new instance.
			- [ ] How does the `bin/sleep` command work?
- [ ] What is the difference between `launchd` and `launchctl`?
### Applications
- `-15` and `-9` are completely normal for background shell scripts that use `sleep`. It mainly tells you whether the previous process exited before or after the 5-second timeout.
### Example
```
launchctl list | grep obsidiansentinel

3006    -9      com.julianventura.obsidiansentinel
```
- In this instance, the process was force quit since the `sleep` did not end faster than 5-seconds when Signal 15 was called
## Source [^1]
- 
## References

[^1]: 