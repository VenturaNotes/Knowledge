---
aliases:
  - .zshrc
tags:
  - in-progress
---
## Synthesis

## Organize
### Deconstructing the Name
* **`.` (The Dot):** In macOS and Linux, any file that begins with a period is a hidden file. This prevents your home folder from looking cluttered, though you can still open and edit it directly by name.
	* #question When saying 'by name' does this 
* **`zsh`:** This stands for [[Z Shell]], which is the default command-line interpreter (or "shell") on macOS. It is the program that actually processes the commands you type into your terminal app.
* **`rc`:** This stands for **"run commands"** (or historically, "run control"). In the Unix world, files ending in `rc` are configuration files containing commands that are automatically executed when a specific program starts up.

Therefore, `.zshrc` is literally the **Z Shell Run Commands** file [3.2].

---

### 2. What is its main purpose?
The `.zshrc` file is a shell startup script [3.2]. 

**Every single time** you open a new terminal window, open a new split pane, or start a new interactive terminal session inside an app like Obsidian, your Mac starts a new instance of the Z Shell (`zsh`). Before it displays your username prompt, it silently executes every line of code inside your `.zshrc` file from top to bottom [3.2].

---

### 3. What typically goes inside a `.zshrc` file?
Because it runs automatically on startup, developers use this file to customize their command-line environment [3.2]. Common use cases include:

* **Environment Variables (like `$PATH`):** Telling the shell where to search for executable commands [2.4, 3.2].
* **Aliases:** Creating short triggers for longer commands (e.g., `alias gs="git status"`).
* **Shell Themes & Prompts:** Customizing how your terminal looks (e.g., using Oh My Zsh, custom colors, or displaying your current Git branch).
* **Custom Functions:** Loading custom script logic—like the automatic permission script we wrote to watch your folder.

---

### 4. Why do you have to run `source ~/.zshrc`?
When you make a change to your `.zshrc` file, the active terminal window you are typing in does not know you edited the file on disk [3.2]. The current window only read the file once—when you first opened it. 

To apply your changes without quitting and reopening your terminal app, you run:
```bash
source ~/.zshrc
```
This command tells the active Zsh shell process: *"Read through the `.zshrc` file on disk right now, run the new commands inside it, and update my active terminal environment immediately."* [3.2]
## Source [^1]
- 
## References

[^1]: 