---
aliases:
  - packet
---
## Synthesis
- 
## Source[^1]
- When an end system segments data and adds header bytes to each segment, the resulting packages are the packets which are sent through the network to an end system where its reassembled into the original data

## Source[^2]
- Components of packets
	- Header
		- Includes metadata and controls information needed for routing and delivery
		- Includes
			- Source and destination addresses
			- [[Sequence numbers]]
			- Checksums for error detection
			- Other control fields
	- Payload (the actual data being transmitted)
		- The segments of data are part of the payload within each packet
	- Trailer (optional)
	- Checksum or CRC
	- Protocol information
- Packet transmission
	- Involves sending data in discrete units (packets) over a network from a source to destination
	- Each packet contains a header with control information (e.g., source and destination addresses, checksum) and a payload with the actual data
## References

[^1]: [[Home Page - Computer Networking A Top-Down Approach 8th Edition by James F. Kurose and Keith W. Ross#1 1 What is the Internet]]
[^2]: ChatGPT