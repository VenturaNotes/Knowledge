---
aliases:
  - NFS
  - network file systems
---
## Synthesis
### Description 
- Allows a computer to access files over a network as if they were stored on a local hard drive. Instead of the data living on your own machine, it resides on a remote server, but appears as a folder or mounted drive in your file manager.
	- #question What is the difference between a folder and a mounted drive?
### Functionality
- Client-Server Model
	- A server shares a directory, and clients (your computer) mount that directory.
		- #question What does it meant to "mount" a directory?
		- #question What types of directories are there? Folders are probably one of them
- Transparency
	- Once connected, you can open, edit, and save files using standard applications without needing to manually download or upload them.
		- #question  But a network file system isn't always two-way sync, is it?
- Common Protocols:
    - [[Server Message Block]]
	    - Common in Windows environments (and macOS).
	    - #question How does this protocol work?
    - Network File System: 
	    - Standard for Linux/Unix systems.
	    - #question How does this protocol exactly work?
    - [[Apple Filing Protocol]]: Formerly used by macOS (mostly replaced by SMB).
	    - #question So which protocols does macOS use? 
	    - #question How does this protocol work?
## Source [^1]
- A set of protocols that run over a network and offer support for file transfer and access, and for paging. The system was originally developed by Sun Microsystems Inc. to allow workstations without disks to access files on other machines as if they were on local disks. The system became a de facto standard, and new versions of NFS are now controlled by IETF.
- http://tools.ietf.org/html/rfc3530
	- The NFS (version 4) specification
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]