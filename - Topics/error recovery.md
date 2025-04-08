## Synthesis
- 
## Source [^1]
- (1) The ability of a compiler to resume parsing of a program after encountering a syntax error. 
- (2) Any process whereby it is possible to recover the data from a data unit (such as a sector or block) that has been shown by an error detection procedure to contain one or more errors. There are two approaches: retry and error correction. [[Retry]] involves rereading the data unit from the storage medium or retransmitting it over the communication link; this may be repeated more than once. Error correction depends on the data coding being sufficiently redundant to allow errors to be recovered by logical manipulation of the data without rereading it (see ERROR-CORRECTING CODE). In each case, recovery may need intervention by the host software or may be carried out automatically by the device. Where recovery is automatic, the host is able to monitor the number of errors that are recovered.
- When the error is detected during writing or verification, the faulty data unit may be corrected or replaced (see WRITE ERROR RECOVERY); in a device with powerful error correction, such as an optical disk drive, this is not always necessary.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]