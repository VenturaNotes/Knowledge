[Video](https://www.youtube.com/watch?v=31ieHmcTUOk)

- ![[Screenshot 2023-11-27 at 12.24.23 AM.png]]
	- What is a [[docker]]?
		- Can make developing applications much easier to manage
	- Uses [[containers]] to run applications in isolated environments on a computer
		- [[Node]] app
		- [[React]] app
		- [[MongoDB]]
	- Scenario
		- In a dev team making an application in a Node.js environment
			- Version needed was a specific version that had a feature we wanted (such as Node 17)
		- If we wanted team members to run your application
			- You'd need to set up development environment to match yours
			- They'd need the same version of Node.js installed
			- Would need to install all project dependencies (and setup any configuration-like environment variables)
		- Would cause a significant setup process.
	- Think of a [[containers|container]] as a box or package that contains everything application needs to run. All source code, dependencies, correct run time environment, versions, etc.
		- Container can run application in isolation (away from other processes on computer)
			- Node 17
			- dependencies
			- Source code
		- Makes running applications easier on computers
		- Would just need [[docker]] to manage containers
	- Dockers can improve deployment of applications to a server as well. Containers can be also pulled onto your production server (then you don't need to configure the server)
- ![[Screenshot 2023-11-27 at 12.28.55 AM.png]]
	- [[Virtual machines]] can solve the same problems that containers solve
	- Differences
		- Virtual machine: Has it's own full operating system & typically slower
		- Containers: Share the host's operating system & typically quicker
			- Will typically use less memory
			- More light-weight
	- Before you start
		- Have some experience in web development
			- Node applications, react sites (general understanding)
		- In this course, I'll be using [[Node.js]], [[Express]] & [[React]]