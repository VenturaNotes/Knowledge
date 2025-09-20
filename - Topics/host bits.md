## Synthesis
- Given a [[subnet mask]] represented in binary such as `11111111.11111111.11111111.11000000`, the 1s represent the network bits while the 0s represent the [[host bits]]
## Source [^1]
- This is the number of 'zero' bits, when you write out the subnet mask in binary form (make sure to fill out the full octets)
- Example
	- The subnet mask 255.255.255.0 (decimal format) would translate to 11111111.11111111.11111111.00000000 (binary format). Each decimal number takes up 8 bits So the number of 'zero' bits in this example is 8
		- The '255.255.255.0' is also known as [[dot-decimal notation]][^2]
## References

[^1]: https://kc.allegion.com/kb/article/what-is-the-host-bits-setting-on-a-hand-reader-with-an-ethernet-module/#:~:text=The%20%E2%80%9Chost%20bits%E2%80%9D%20are%20the,11111111%20.
[^2]: https://en.wikipedia.org/wiki/Dot-decimal_notation#:~:text=dotted%2Dquad%20notation.-,Dot%2Ddecimal%20notation%20is%20a%20presentation%20format%20for%20numerical%20data,IPv4%20address%20has%2032%20bits.
