## Synthesis
- 
## Source[^1]
- Checksum value in a UDP datagram computed using a checksum algorithm which is typically a [[16-bit one's complement checksum]]
- For computation
	- data payload and UDP header combined and the checksum algorithm calculates a value based on the binary representation of the combined data.
- Sender includes checksum in UDP header and receiver recalculates the checksum using the received data to verify its integrity. If calculated checksum matches the one in the header, the data is assumed to be intact
- The inclusion of checksums in headers varies among protocols
	- UDP includes a checksum in its header for error detection
	- TCP also includes checksums but incorporates error recovery mechanisms

## Source[^2]
- (modulo- $\boldsymbol{n}$ check, residue check) A simple error detection method that operates on some set of information (usually data or program). If this information is in units that are $m$ bits wide, a sum is taken modulo $n$, where $n=2^{m}$, and appended to the information. At a later time or different location the check may be recomputed and most simple (all single) bit errors will be detected. A parity check is the simplest version of this check with $m=1$ and $n=2$.
## References

[^1]: ChatGPT
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]