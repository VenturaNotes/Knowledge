## Synthesis
- 
## Source [^1]
- A signal recorded on magnetic tape that does not represent data but is used to delimit sections of data-usually individual files, hence the alternative term file mark. The tape mark is written at the direction of the host system but its form is determined by the magnetic tape subsystem in accordance with the standard for the relevant tape format. Most formats allow the tape mark to be recorded as a separate block, but in formats that provide for the insertion of block headers by the subsystem it is usual for the tape mark to take the form of a flag in one of these headers.
- If the subsystem encounters a tape mark during a read operation, the host system is informed. In most magnetic tape subsystems there is a skip to tape mark (or tape-mark search) command that causes the tape to be run to the next tape mark without transferring any data to the host; sometimes there is also a multiple-skip command containing a parameter $n$, which causes the tape to skip to the $n$th tape mark. Skip operations are sometimes performed at a higher speed than that used for reading.
- It is conventional to write a double tape mark after the last file in a volume.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]