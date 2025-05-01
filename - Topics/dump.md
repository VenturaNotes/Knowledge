## Synthesis
- 
## Source [^1]
- (1) In a system handling large numbers of users' files stored on magnetic disks, one of the periodic records of the state of the disks that are made on some form of offline storage device. This protects against failures either in hardware or software that can lead to the corruption of stored information. In the event of a system error that causes information to be lost, the most recently copied version of the information can be reinstated from the dump.
- On a large multiuser system, the total volume of stored information means that it may not be practicable to dump all the information on every occasion. In these cases an [[incremental dump]] can be taken, containing only those files that are marked as having been altered since the last dump; this reduces the total amount of information to be copied during the dump, allowing dumps to be made more frequently.
- (2) A snapshot of the contents of system memory taken when a system crash has occurred. In principle it is possible to determine the immediate cause of a system crash by studying the dump and determining the reason for any inconsistencies in its contents. In practice this may be difficult even with the assistance of dump analysis software. 
- (3) To produce a dump (defs. 1 or 2 ).
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]