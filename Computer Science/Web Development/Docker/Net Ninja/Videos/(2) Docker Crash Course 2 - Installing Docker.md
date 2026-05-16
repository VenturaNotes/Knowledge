---
Source:
  - https://www.youtube.com/watch?v=8Ev1aXl7TGY
Reviewed: false
---
- ![[Pasted image 20260515030745.png|500]]
	- Can download it from docs.docker.com/get-docker
	- You use docker desktop on Mac and Windows.
		- You can use the docker engine directly on Linux without docker desktop (but should come soon to linux)
	- Easy to install on Mac (just need to drag and drop the Docker.app into applications folder.)
	- More complicated on Windows. Running docker on windows is also not quite as smooth as it is on mac or computers which already have a linux distribution installed
		- #question Why is a linux distribution good for this?
		- Will download using WSL 2 Backend
			- This is a windows subsystem for Linux. Lets you run a full linux environment on windows without a virtual machine. Lets us run docker on our windows machines.
			- Must enable WSL 2 features on windows.
			- Start by downloading "Docker Desktop for Windows" and then follow steps
				- Website: docs.docker.com/desktop/windows/install
			- Steps (docs.microsoft.com/en-us/windows/wsl/install-manual)
				1. Check windows version. Type `winver` in search bar. Must be a certain Windows version and Build or higher.
				2. Enable windows sub system for Linux
					- Open PowerShell as administrator 
					- Copy Paste Command 
						- `dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart`
				3. Enable Virtual Machine Feature
					- Open PowerShell as Administrator and run
						- `dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart`
					- Need to restart machine to complete WSL install and update to WSL 2.
				4. Download Linux Kernel update package and run it
					- Depends on x64 or ARM64 machines
				5. Set WSL 2 as default version
					- `wsl --set-default-version 2`
				6. Install linux distribution of choice (such as Ubuntu)
					- Can download this from Microsoft store. 
					- Video creator got `Ubuntu 18.04 LTS`
						- #question What is LTS? Is that a light version?
					- Will then need to create account (username + password)
	- Now you can open Docker Desktop
		- Will list all containers/apps, images, and volumes. 
			- Need to make sure it's up and running in background. 
			- Should be able to see it in bottom-right after clicking arrow. The symbol is the white whale. 
				- On mac, probably can see it in top-right
					- #comment Probably the menu bar. 
	- Images & containers are two of the most important concepts when working with docker