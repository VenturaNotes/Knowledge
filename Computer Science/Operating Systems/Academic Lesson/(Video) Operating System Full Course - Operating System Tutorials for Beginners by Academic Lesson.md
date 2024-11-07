---
Source:
  - https://youtu.be/mXw9ruZaxzQ?si=BBQRerLkB2Ut9pyP
Length: 3 hours, 35 minutes, 2 seconds
tags:
  - status/incomplete
  - type/video
---
## Introduction to Operating Systems
- ![[Screenshot 2023-09-22 at 3.34.13 AM.png]]
	- Dr. Mike Murphy is an assistant professor of Computer Science and Information systems at Coastal Carolina University
	- What is an [[operating system]] (it's a layer of [[software]] that provides 2 important services to a computer system)?
		- [[Abstraction]]
			- Hides details of different [[hardware]] configurations
			- [[Applications]] do not need to be tailored for each possible device that might be present on a system
		- [[Arbitration]]
			- Manages access to shared hardware resources
			- Enables multiple applications to share the same hardware simultaneously
	- Hardware Resources (operating system involved in energy conservation )
		- Central Processing Unit ([[Central Processing Unit|CPU]])
			- Executes program instructions
			- Multiple CPU cores execute instructions in parallel
		- [[Memory]]
			- Hierarchy of different memory speeds
			- Fastest memory attached to CPU
				- [[Registers]]
				- [[Cache]]
			- Random Access Memory ([[RAM]]) - slower
			- [[Persistent Memory]] (disk) - slowest
		- [[input-output|input/output]] (I/O) Devices
			- [[Keyboard]]
			- [[Mouse]]
			- [[Network Interface Card]] (NIC)
			- [[Screen]]
			- [[Printer]]
			- others...
		- Power and system management
			- [[Power Supply]]
			- [[Internal Cooling]] (managed fans, etc.)
	- [[Abstraction]]
		- Hardware devices manufactured by different manufacturers
			- Require different low-level instructions to operate
			- Have different capabilities
		- If a [[common interface]] didn't exist...
			- Variety of hardware might be limited
			- Every application would have to be programmed to use all required devices
			- Example: 1990s-era computer games that required internal programming for video and sound cards
	- [[Arbitration]]
		- Hardware shared by multiple applications simultaneously
		- OS ensures that all applications can access resources
			- Divides CPU core time among different programs
			- Manages access to RAM, I/O, and [[disk]]
			- Enforces system and security policies to isolate applications from each other (in an ideal world, at least)
				- So a crash in one application doesn't take down the entire system
- Image
	- Abstraction or Arbitration?
		- Supporting both [[Intel]] and [[AMD]] processors
			- Abstraction: 
		- Switching between applications
		- Separating memory allocated to different applications
		- Enabling video conferencing software to use different camera devices
		- Accessing two different hard disks
		- Sending and receiving messages over a network