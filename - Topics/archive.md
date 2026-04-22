---
tags:
  - in-progress
---
## Synthesis
### Description
- It is a single file that contains one or more files (and often their metadata) bundled together for easier storage or transfer.
	- #question What is metadata?
	- #question How is the archive bundled together?
### Common Archive Formats
- [[zip]]
	- `.zip`: The most universal format; it bundles and compresses files. macOS supports this natively.
		- #question How does it bundle and compress a file?
- [[tar]]
	- `.tar`: Short for "Tape Archive." It bundles files together without compressing them (though it is often paired with compression to become `.tar.gz`).
		- #question What is the point of an archive which is not compressed? Isn't that just a normal folder then? What benefit does it have?
		- #question How do you compress it to a `.tar.gz`?
- [[rar]]
	- `.rar`: A proprietary format known for high compression ratios. macOS can generally open these, but often needs third-party tools or macFUSE-based systems to modify them.
		- #question What is meant by high compression ratio?
		- #question What are some macFUSE-based systems?
		- #question What third-party tools can open them on mac?
- [[7z]]
	- `.7z`: A modern, high-compression open-source format.
		- #question How is this different than the other ones mentioned?
		- #question What is the algorithm for compression on this one?
### Extracting an Archive
- This is when you decompress or unpack the file contents
## Source [^1]
- An archive is a collection of data moved to a repository for long-term retention, to be kept separate for compliance reasons or moved off primary storage media.
## Source[^2]
- A repository for information that the user wishes to retain, but without requiring immediate access. (The word is also used as a verb: to transfer into the archive system.) There are three quite different activities that must be distinguished:
	- (a) the routine taking of backup copies, initiated by the system manager, to protect users and system managers against corruption of stored information;
	- (b) the autonomous transferring of information from a higher-performance to a lower-performance storage system, initiated by the operating system, to achieve economies in the total cost to the system manager of information storage;
	- (c) the voluntary transferring of a file between normal file storage and archive storage, initiated by the user, to achieve economies in the total costs to the user of information storage.
- Most systems retain information that the user can alter on magnetic disk or solid-state drives. (Information that the user cannot alter may either be held on a nonwritable form of storage such as a CD-ROM, or on a writable form but with some form of hardware or system write-inhibit control.) Magnetic disks and solid-state drives offer high performance, but the user may be prepared to use a slower medium such as magnetic tape, which has lower unit costs for storage. Users may do this on their own behalf by attaching a magnetic-tape subsystem to their workstation, and overseeing the transfer of files to the magnetic tape and their subsequent recovery when the information is required again. Alternatively, in a large multiuser multiserver environment, there may be a server set aside specifically for the purpose of allowing users to transfer their information onto shared magnetic-tape devices. This server will also cooperate with the system's file-access software in maintaining the modified directory entries that allow the overall system to keep track of the information held on the magnetic tapes, and to oversee its recovery on behalf of the user. A growing trend in archiving is the transference of data over the Internet to a third-party data-warehousing service (see CLOUD COMPUTING). See also MEMORY HIERARCHY.
## Source[^3]
- A store for documents and magnetic disks or tapes containing records that are seldom used. Most computer users maintain an archive holding copies of disks or tapes containing vital information. If the original disk or tape becomes damaged, the archive copy is used to reinstate the information.
## References

[^1]: https://www.techtarget.com/searchstorage/definition/archive
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^3]: [[(Home Page) A Dictionary of Business and Management 6th Edition by Oxford Reference]]