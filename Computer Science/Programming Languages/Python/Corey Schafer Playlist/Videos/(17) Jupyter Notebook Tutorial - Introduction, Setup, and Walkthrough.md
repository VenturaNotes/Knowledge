---
Source:
  - https://youtube.com/watch?v=HW29067qVWk
Reviewed: false
---
- Run code interactively within a web browser
	- Alongside visualizations and markdown text to explain process of what's going on
	- Evolved from IPython

## Why use Jupyter
- scientific institutions using these notebooks to clearly explain how they got results
- Able to reproduce results within notebooks themselves
- LIGO
	- observatory that detected gravitational waves in late 2015
		- [SIGNAL PROCESSING WITH GW150914 OPEN DATA](https://www.gw-openscience.org/s/events/GW150914/GW150914_tutorial.html#SIGNAL-PROCESSING-WITH-GW150914-OPEN-DATA)
			- The tutorial is no longer maintained but was used in the youtube video
	- They put out some of their research in notebook form
	- Shows how you can replicate some of their processing using their own data
	- Isn't just python code but also some markdown code which is displayed as the instructions and also describes exactly what's going on
	- We see python code, markdown code for description, and charts for visualization
		- They are not static visualizations
		- Can rewrite cells to get different results
		- Allows you to interact with the data

## We will learn how to
- Get Jupyter installed
- Create our own notebooks
- Get setup with different kernels
- Navigate
- Execute code

## Installing
- [[(Video) Download & Install Jupyter Notebook for Python on Mac OS X (2021)|Instructions for Anaconda]]
- On the Jupyter installation page, they recommend installing Jupyter by using the Anaconda python distribution
	- One benefit is that Jupyter comes bundled with that installation
	- If you don't want to use Anaconda
		- They have the pip installation instructions as well

## Starting a Notebook
- Get into an empty directory
	-  `cd ../Jupyter-Demo`
		- Let's say you have a folder called "test1". Inside this folder is 2 more folders called "test2" and "test3". If you're inside the "test2" directory, to get to the "test3" directory, type `../test3`. This will get you out of the "test2" directory into the parent folder "test1", and then into the other folder "test3"
- List all files and directories inside directory
	- `ls -la`
	- If you get a [permission error](https://osxdaily.com/2018/10/09/fix-operation-not-permitted-terminal-error-macos/) such as `ls` to list the files, do this on a mac
		- Apple menu -> System Preferences -> Privacy & Security -> Full Disk Access -> checkmark the Terminal
- Start a server
	- `jupyter notebook`
- Need to leave the terminal running
	- Need to access notebooks in localhost
- Create a new notebook (need a kernel)
	- A kernel is the programming language we want to use
	- New -> Python 3 (ipykernel)
- Help (User interface tour)
	- Untitled
		- Changes the filename for the notebook
	- Notebook Menubar
		- The menubar has menus for actions on the notebook, its cells, and the kernel it communicates with.
	- Notebook Toolbar
		- The toolbar has buttons for the most common actions. Hover your mouse over each button for more information.
	- Mode Indicator
		- The Notebook has two modes: Edit Mode and Command Mode. In this area, an indicator can appear to tell you which mode you are in.
	- Command Mode
		- Right now you are in Command Mode, and many keyboard shortcuts are available. In this mode, no icon is displayed in the indicator area.
		- Blue means command mode
	- Edit Mode
		- Pressing `Enter` or clicking in the input text area of the cell switches to Edit Mode.
		- Notice that the border around the currently active cell changed color. Typing will insert text into the currently active cell.
		- Green highlight means edit mode 
		- There is also a pencil to infer edit mode
			- ![[Screenshot 2022-12-27 at 12.29.14 AM.png]]
	- Back to Command Mode
		- Pressing `Esc` or clicking outside of the input text area takes you back to Command Mode.
	- Kernel Indicator
		- This is the Kernel indicator. It looks like this when the Kernel is idle.
			- ![[Screenshot 2022-12-27 at 12.25.23 AM.png]]
		- The Kernel indicator looks like this when the Kernel is busy.
			- ![[Screenshot 2022-12-27 at 12.25.40 AM.png]]
	- Interrupting the Kernel
		- To cancel a computation in progress, you can click here.
			- ![[Screenshot 2022-12-27 at 12.26.21 AM.png]]
		- Notification Area
			- Messages in response to user actions (Save, Interrupt, etc.) appear here.
				- ![[Screenshot 2022-12-27 at 12.27.00 AM.png]]
- Keyboard shortcuts
- Running code in cell
	- Cell -> Run Cells
		- Shows output of cell
			- ![[Screenshot 2022-12-27 at 12.31.15 AM.png]]
		- Shortcut
			- Control + Enter
	- Cell -> Run Cells and Select Below (won't add an additional cell if a cell below already exists)
		- ![[Screenshot 2022-12-27 at 12.32.07 AM.png]]
		- Shortcuts
			- Shift + Enter
	- "Cell -> Run Cells and Insert Below"
		- Runs current cell and inserts extra cell block below even if a cell already exists (would have 2 cells below then)
		- Shortcuts
			- Option + Enter
	- Deleting Cells
		- Shortcut
			- D,D
	- Adding Cell below
		- B shortcut
	- Adding Cell above
		- A shortcut

## Interactive Prompt Behavior
- "Hello World"
	- Prints it out
- Numbers in cells tells us the order that the cells were executed
- Can do assignments `name = Corey`
- Cell -> run All, run all above or run all below
	- Can run all the cells, all cells above current cell or all cells below current cell

## Markdown 
- Text that gets translated into HTML
- Shows what's going on
- Select cell -> cell type -> mark down
	- Do control + enter to run the markdown text to HTML
- ![[Screenshot 2022-12-27 at 1.04.57 AM.png]]
- ![[Screenshot 2022-12-27 at 1.05.10 AM.png]]

---
- `!pip list`
	- Can run this bash command (don't always need the code to be python)

## Magic Commands
- `%` 
	- command arguments will com from same line
	- called line magics
- `%%`
	- Entire cell will be used as that command's arguments
	- Cell magics
- `%lsmagic`
	- Shows all the magic commands you can use
- `%pwd`
	- Shows current directory we're in
- `ls -la`
	- Shows all files with users and permissions
- `%matplotlib inline`
	- Allows the chart to be displayed in notebook
	- ![[Screenshot 2022-12-27 at 1.03.11 AM.png]]
		- Running this code without the above command will cause it to get stuck running which is represented by the `*` symbol
			- To kill it, go to kernel -> restart & clear output
Sample Code
```python
import numpy as np
import matplotlib.pyplot as plt

N = 50
x = np.random.rand(N)
y = np.random.rand(N)
colors = np.random.rand(N)
area = np.pi * (15 * np.random.rand(N))**2

plt.scatter(x, y, s=area, c=colors, alpha=0.5)
plt.show()
```
- `%%HTML`
	- Lets us to run HTML directly without using markdown that we looked at before
	- Can embed an iframe into the cell
		- ![[Screenshot 2022-12-27 at 1.06.00 AM.png]]
	- Can render images are links
- `%%javascript`
	- You can run javascript command
- `%%bash`
	- Allows you to write a series of bash commands in one cell
- `%%timeit`
	- Can time our python code
	- ![[Screenshot 2022-12-27 at 1.13.43 AM.png]]
- Allows us to view panda data frames
	- ![[Computer Science/Programming Languages/Python/Corey Schafer Playlist/Videos/- Attachments/Screenshot 2022-12-27 at 1.15.01 AM.png]]

## Exporting Files
- File -> Download as -> Markdown, HTML, PDF via LaTeX, and Notebook are all options
- The `.ipynb` is just a json file if you were to open it in a text editor

## Multiple Kernels
- You could install a python2 kernel
- `conda env list`
	- This shows the different environments


## Jupyter Notebook Examples
- https://github.com/ipython/ipython/wiki

---
- Moves a note called `myfile.rtf` that's on desktop to current directory
	- `mv ~/Desktop/myfile.rtf ./`