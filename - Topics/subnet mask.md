## Synthesis
- 
## Source [^1]
- A number that identifies the network and host parts of an IP address
	- It's used in [[IPv4]] and [[IPv6]] networks
- A subnet mask is a 32-bit number in IPv4 and 128-bit in IPv6
- Used with an IP address to determine the destination of a [[network packet]]

## Source[^2]
- A subnet mask is a 32-bit number divided into four 8-bit segments ([[octet|octets]]). Each bit in the mask specifies which part of the IP address is for the network (1) and which is for the hosts (0)
	- A subnet mask is 128-bit in IPv6 [^1]
- In $/26$
	- The first 26 bits are set to `1` ([[network bits]]) and the remaining 6 bits are set to 0 ([[host bits]])
	- `11111111.11111111.11111111.11000000`
## References

[^1]: Google's Search Labs | AI Overview
[^2]: ChatGPT