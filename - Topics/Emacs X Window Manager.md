---
aliases:
  - EXWM
---
## Synthesis
- Tool for Linux-based computers that lets you use GNU Emacs as your entire desktop environment.
	- #question What is GNU Emacs?
- Normal vs EXWM
	- A computer uses a "Window Manager" (like Windows, macOS, or GNOME on Linux) to manage your screen. Inside that window manager, you open different apps—like a web browser, Spotify, and maybe Emacs—as separate windows that you can drag around.
		- #question What is GNOME? Is that like a distro? Are Linux distributions the same thing as Linux distros? 
	- With EXWM, Emacs is the window manager. Turning on the computer will have Emacs take over your screen on startup 
- When opening an external application like Google Chrome or Spotify under EXWM, Emacs treats the application like a text document (or "buffer") inside Emacs
	- #question Are buffers text documents?
	- Applications
		- Split your screen so that Chrome is on the left and a text file is on the right, using Emacs commands
			- #comment So this probably means you would have no authentication problems on websites since you are using chrome itself to navigate. 
		- Switch between your web browser and your files using the exact same keyboard shortcuts.
		- Manage all your open apps from a single list, just like you would manage open tabs in a text editor
			- #question What would this list look like?
- Usage 
	1. No Mouse Needed
		- Controls entire operating system + apps using only keyboard shortcuts
			- #question How would you make a keyboard shortcut with the web browser. Would you need to make your own script similar to the `Hello World` shown [[(T) Learning Emacs|here]]?
	2. One System
		- Lets you use existing Emacs configurations and shortcuts to control computer
	3. Infinite Customization
		- Since EXWM is built on Emacs, users can write simple code to customize exactly how their desktop behaves.
## Source [^1]
- 
## References

[^1]: 