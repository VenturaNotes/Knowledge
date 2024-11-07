---
Source:
  - https://youtu.be/YA8Nq8Tlma4
Length: 4 minutes, 32 seconds
tags:
  - status/complete
  - type/video
Published: true
---
- [Download link for anaconda](https://www.anaconda.com/)
- Do "install for me only"
- Go to Applications -> Anaconda-Navigation
- Click "Launch" for Jupyter Notebook
- This page will appear
	- ![[Screenshot 2022-12-26 at 11.46.22 PM.png]]
	- Head over to desktop and create a folder called "My First Python Program". This will be the folder where you run your python programs


## [Uninstalling Anaconda](https://docs.anaconda.com/anaconda/install/uninstall/)

- `conda install anaconda-clean`
- `anaconda-clean --yes`
	- If you don't want to be asked about each file and directory when removing Anaconda-related files
- Examples to delete anaconda folder
	- `rm -rf anaconda3`
	- `rm -rf ~/anaconda3`
	- `rm -rf ~/opt/anaconda3`
- Delete below by going to ".bash_profile" or ".zprofile" (on Linux or macOS)
	- `export PATH="/Users/jsmith/anaconda3/bin:$PATH"`