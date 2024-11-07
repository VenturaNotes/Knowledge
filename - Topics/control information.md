## Synthesis
- 
## Source[^1]
- Within a [[datagrams|datagram]], it includes various fields in the header which provides important details about the transmission including
	- Source and destination information
	- error detection
	- protocol-specific parameters
- Control information with in a UDP datagram
	- [[Port numbers]]
		- Source Port
			- Indicates port number of sending application or process on the source device
			- Helps receiving device identify which application should receive the data
		- Destination Port
			- Specifies port number of intended recipient application on the destination device.
	- Length
		- Specifies total length of UDP datagram
			- Includes the header and the data payload
		- Tells receiver how much data to expect
	- [[Checksum]]
		- Optional in [[IPv4]] and mandatory in [[IPv6]]
		- Contains a checksum value computed over the entire UPD header and data payload
		- Receiver uses this checksum to detect errors in the received datagram
	- [[Data payload]]
		- Actual data being transmitted (message, file or any other information)
		- Size can vary but must fit within [[maximum transmission unit]] (MTU) size of the network
	- Additional Fields (Optional)
		- Protocols like [[DNS]] (Domain Name System) use specific fields within datagram for
			- query identification, response codes, other parameters
## References

[^1]: ChatGPT