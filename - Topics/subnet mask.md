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

## Source[^3]
- A specification of which part of an IP address (see TCP/IP) represents the network identity. It is a 32-bit bitmap where '1' means that bit position is part of the network identity and '0' that it is part of the host address. This bitmap always take the form of a single block of '1's (the network identity part) followed by a single block of '0's (the host address part). It is important that routers can distinguish efficiently between those packets originating on its network whose destination is on the same network and those that require routing over an inter-network. This operation requires isolating the network identity part of the IPA address, and an AND operation with the subnet mask is a very efficient way to do this. For convenience, subnet masks are usually represented either as the decimal form of four 8-bit numbers or as an integer representing the network identity. Thus, 255.255.255.0 and /24 both indicate a 24-bit network identity and an 8-bit host address
	- #comment "that that" error in printing
## Source[^4]
- A subnet mask is a 32-bit number that comes in the form of ones and zeros and is written in the same way as an IP address. A subnet mask will also divide an IP address into two parts, thus creating two different components of a network. These masks are required to access the internet via TCP/IP, which is the networking protocols that allow for computers to be able to network. The first 24 bits are the network address and the last eight bits are the host address. This allows for the connection of a computer to the wider internet.
## References

[^1]: Google's Search Labs | AI Overview
[^2]: ChatGPT
[^3]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^4]: [[Home Page - Glossary by Capterra]]