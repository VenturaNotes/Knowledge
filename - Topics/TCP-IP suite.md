---
aliases:
  - TCP/IP
  - Transmission Control Protocol/Internet Protocol
  - Internet protocol suite
---
## Synthesis
- 
## Source[^1]
- A standardized set of networking protocols that are used for communication and data exchange in computer networks
- Stands for Transmission Control Protocol/Internet Protocol (most fundamental protocols in [[suite]])
- Includes a range of protocols. Together, they form a cohesive framework enabling devices to communicate, transmit data, and access resources across networks
	- [[TCP]]
	- [[internet protocol|IP]]
	- [[UDP]]
	- [[ICMP]]
	- [[DNS]]
	- [[FTP]]
	- [[HTTP]]
	- [[SMTP]]

## Source[^2]
- Also known as the internet protocol suite

## Source[^3]
- Responsible for ensuring data packets are transferred quickly and reliably across a network through a [[routers|router]] via the best path

## Source[^4]
- (Trademark) The obligatory standard to be used by any system connecting to the Internet. The two protocols were originally developed on the DARPA net. They were devised to optimize the performance of networks that are based on unreliable data-transmission systems operating at relatively low data rates.
- The Internet Protocol, IP, is the lower of the two protocols. It provides a connectionless datagram service, and a managed address structure for data transmission. In IP version 4 (IPv4), the dominant version on the Internet, an IP address is a 32-bit number. The interpretation of these bits was formerly rigid and divided IP addresses into four classes, A to D (see table). The first bits defined the class of the address; the next group of bits defined the identity of the subnetwork attached to the Internet; the final group defined the address of the host system within the subnetwork. Class A addresses were for large subnetworks with many hosts, and classes B and C were for progressively smaller networks with progressively fewer hosts; class D addresses were used for multicasting. This system has been superseded since 1993 by Classless Inter-Domain Routing.
- The explosive growth of the Internet has resulted in the IPv4 32-bit address space becoming restrictive. IP version 6 (IPv6) seeks to remedy this by using 128-bit IP addresses, with 64 bits being used for both the network identity and the host address. IPv6 is gradually being adopted on the Internet and it is estimated that it will overtake IPv4 usage by 2018. IP allows a long datagram to be fragmented into numbered packets, which can then be transmitted and reassembled in their correct sequence at the destination system. It is intended to be used in conjunction with the [[TCP|Transmission Control Protocol]], TCP.
- TCP provides error-free delivery of arbitrarily long messages, known as segments, with the data being released to the host system in the same order as the original transmission. It achieves this by a 'sliding window' mechanism. As data are transmitted, they are accompanied by a checksum; at the receiving end the checksum is verified and an acknowledgment is returned to the transmitter, which indicates the position of the last data to be successfully received. The transmitter will not send data beyond a certain point, determined by the size of the window, i.e. the gap between the last data to be sent and the last data for which an acknowledgment has been received. If the checksum fails at any point, the transmitter will retransmit data from the point immediately following the latest acknowledgment of correct receipt.
	- ![[Screenshot 2025-03-25 at 2.57.37 AM.png]]
		- Parts
			- Class
			- Class definition
			- Network identity
			- Host address
		- TCP/IP. Summary of Internet address classes
- http://tools.ietf.org/html/rfc793
	- The TCP (version 4) specification
- http://tools.ietf.org/html/rfc791
	- The IP (version 4) specification
- http://tools.ietf.org/html/rfc2460
	- The IP (version 6) specification
## References

[^1]: ChatGPT
[^2]: https://en.wikipedia.org/wiki/Internet_protocol_suite
[^3]: https://quizizz.com/admin/quiz/5da881f925473f001a69cc22/wireless-networks
[^4]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]