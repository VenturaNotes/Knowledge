## Synthesis
- 
## Source[^1]
- Widely used [[LAN]] technology that defines standards for physical and [[data link layer protocols]]
- Uses CSMA/CD ([[Carrier Sense Multiple Access with Collision Detection]]) for media access control and supports various speeds
	- 10Mbps, 100Mbps, Gigabit Ethernet

## Source[^2]
- ![[Screenshot 2025-01-22 at 2.33.13 AM.png|200]]
	- This is an example of an ethernet cable
	- [[Cat5e]]
	- [[Cat6]]

## Source[^3]
- A very widely used local area network system. Ethernet uses broadcast packets that are transmitted over a purely passive medium, usually referred to as the Ether. In practice the Ether usually takes the form of a coaxial cable (see THICK WIRE), but the system can also use twisted pairs and optical fibre. The system operates at a nominal speed of 10 megabits per second (Mbps), and implements the two lower layers of the ISO/OSI seven-layer reference model. Fast Ethernet (operating at 100 Mbps ), Gigabit Ethernet (operating at 1 Gbps ), and 10 Gigabit Ethernet are also available. A joint standard for 40/100 Gigabit Ethernet was finally ratified in 2010, and 400 Gigabit Ethernet is under study. For cost reasons, a standard for 25 Gigabit Ethernet is also under study, to replace 40 Gigabit Ethernet. Ethernet was originally developed in 1976 at Xerox PARC, operating at 4 Mbps . Later it was offered as a standard jointly sponsored by Digital Equipment, Intel, and Xerox. The formal definition of the Ethernet standard is available as ISO 802.3.
- Each system on the network, usually a computer, connects to the Ether by means of a station, each station having a unique 48-bit address called a MAC address (in reference to the MAC layer). All packets contain the address of the sending station and the address of the receiving station. When a packet is transmitted it is broadcast to all the stations. Each station will receive all packets, but will only pass packets addressed to that station to the system connected to it. A packet can be marked as a 'broadcast' to be accepted by all the systems connected to the Ether.
- Ethernet stations use a protocol known as CSMA/CD$\textemdash$Carrier Sense MultiAccess/Collision Detection$\textemdash$to insert a packet onto the Ether. (CSMA/CD is also the formal name for Ethernet.) When a station wishes to transmit a packet, it monitors the Ether for the presence of signals from other stations. If no signal is present then the station starts to transmit, and continuously compares the signal on the Ether with the data it is transmitting. Any difference indicates that another station has also started to transmit a packet, and that there is a collision between the two packets. This can occur because the distance separating the two transmitting stations is such that, although both stations had started to transmit during the period when the other was monitoring the Ether, the outgoing signal had not yet reached the other station. Both stations immediately cease transmission, wait for different times, and then retry the transmission. This system has the advantage that the mechanism for gaining access to the Ether is fully distributed and self-starting. Its main drawbacks are the unpredictability of the time needed to gain access, and the fact that the effective bandwidth actually diminishes under heavy loads as the probability of a collision increases. The limits to the length of the Ether cable are determined by the need to reduce the probability of a collision to an acceptable level, achieved by reducing the maximum time needed for a signal to traverse the Ether. See also EXPOSED TERMINAL PROBLEM, HIDDEN TERMINAL PROBLEM.
- The physical size of the Ethernet can be increased by the use of repeaters, which simply amplify the signals, and by bridges and routers, which store and retransmit a complete packet.
- http://standards.ieee.org/about/get/802/802.3.html
	- The latest (10 Gigabit) Ethernet standard
## Source[^4]
- A high-speed local area network system. When first introduced in the 1980s, Ethernet worked at a standard 10 million bits per second; Fast Ethernet and Gigabit Ethernet working at respectively 10 and 100 times this speed have since become available.
## References

[^1]: ChatGPT
[^2]: https://quizizz.com/admin/quiz/5da881f925473f001a69cc22/wireless-networks
[^3]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^4]: [[(Home Page) A Dictionary of Business and Management 6th Edition by Oxford Reference]]