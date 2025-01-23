## Synthesis
- 
## Source [^1]
- Handles routing, addressing, and delivering data across networks

## Source[^2]
### Questions
- (1) If a company requires 60 hosts, then what is the best possible [[subnet mask]]?
	- Explanation [^1]
		- The formula for total number of IPs in a [[subnet]] is $2^h$ where $h$ is the number of [[host bits]]
		- Two IPs (Internet Protocol addresses) are reserved in every subnet
			- [[Network address]]: The first IP in the range
			- [[Broadcast address]]: The last IP in the range. 
			- Therefore, the formula for usable IPs is $2^h-2$ 
		- So the minimum number of host bits needed is 6 to accommodate 60 [[hosts]]
			- $2^h-2 \ge 60$
			- $h = 6$ since ($2^6 = 64$ which is greater than 60)
		- To determine the subnet mask
			- An IPv4 address is 32 bits in total
			- If 6 bits are used for hosts, then $32-6 = 26$ bits are used for the network
			- So the subnet mask is $/26$ or $255.255.255.192$ in [[dot-decimal notation|dotted-decimal notation]]
		- Since 26 bits are used for the network, the binary representation of the subnet mask would like
			- `11111111.11111111.11111111.11000000`
				- The first 26 bits are set to `1` (network bits)
				- The remaining 6 bits are set to `0` (host bits)
		- Now we just need to convert the octets to decimal
			- #comment Each place value in an octet holds a power value of 2
				- So given `11111111`, starting from the ones place:
					- $2^0 = 1$
					- $2^1 = 2$
					- $2^2 = 4$
					- $2^3 = 8$
					- $2^4 = 16$
					- $2^5 = 32$
					- $2^6 = 64$
					- $2^7 = 128$
					- Then summing them = 1 + 2 + 4 + 8 + 16 + 32 + 64 + 128 = 255
						- This means the first 3 octets means all bits are used for the network
				- So given `11000000`, we'd have $2^7+2^6 = 192$
					- This means the last octet has the first two bits used for the network leaving the last 6 bits for the host addresses
				- Giving the dotted-decimal notation: $255.255.255.192$ 
		- So we have 64 IPs in the subnet with 62 usable hosts

## Source[^3]
- A [[routers|router]] is a device used in the network layer
## References

[^1]: ChatGPT
[^2]: https://www.geeksforgeeks.org/quizzes/network-layer-gq/
[^3]: https://youtu.be/HGYOEeik844?si=g3dABQwtJHSi6W01