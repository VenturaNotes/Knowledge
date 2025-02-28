---
aliases:
  - ATM
---
## Synthesis
- 
## Source [^1]
- Asynchronous transfer mode is a dedicated-connection switching technology that organizes digital data into 53-byte cell units for transmission. ATM can transmit data at speeds of 155 or 622 MBps and faster
## Source[^2]
### Connection Switching Technology
- It is a method used in networking to establish and maintain a dedicated communication path between two endpoints. It ensures that data flows along a predefined route, maintaining a continuous connection for the duration of the transmission
	- Examples
		- [[Circuit switching]]: Used in traditional telephone networks
		- [[Packet switching]]: Used in modern internet communication
### Byte Cell Unit
- It refers to a small, fixed-sized block of data used for transmission in networking protocols
	- In ATM, each cell is 53 bytes long, 5 bytes for the [[header]] (containing routing and control information) and 48 bytes for the [[payload]] (actual data being transmitted).
	- The fixed size allows for predictable performance and low latency, especially in real-time applications like voice and video communication
### Transmission Description
- ATM transmission works by breaking data into 53-byte cells and sending them over a network of interconnected [[switches]]. The process follows these steps
	- A [[virtual circuit]] is established between sender and receiver
	- Data is segmented into ATM cells and routed through the network 
	- ATM switches read the header in each cell to determine its path
	- The receiving end reassembles the cells into usable data
	- ATM uses [[asynchronous time-division multiplexing]], meaning cells are sent as needed rather than at fixed intervals, making efficient use of [[bandwidth]]

### Transmission Speed
- Speed of ATM transmission influenced by
	- [[Line rate]]
		- Could be 155 Mbps or 622Mbps
	- [[Network congestion]]
		- High traffic can slow down transmission
	- [[Quality of service]] settings
		- ATM allows different traffic classes, prioritizing critical data
			- #question What are traffic classes?
	- [[Physical medium]]
		- [[Fiber optics]] are faster than [[copper cables]]
- To increase speed
	- Improve [[network hardware]]
		- Faster switches, fiber optics
	- Reduce network congestion
		- Prioritizing important traffic
	- Use higher-speed ATM interfaces
		- [[OC-12]] at 622 Mbps instead of [[OC-3]] at 155 Mbps
- To slow speed (not desired)
	- Introduce bandwidth limits
	- Use older, slower hardware
### History of ATM
- ATM technology was developed in the 1980s and standardized in the early 1990s. Widely used in [[telecommunications]] and [[enterprise network|enterprise networks]] during the 1990s and early 2000s, before being largely replaced by IP-based networks ([[Ethernet]], [[Multiprotocol Label Switching|MPLS]], etc.)
	- An IP-based network is a network where devices communicate using the [[Internet protocol]] (IP). This means each device has a unique IP address that allows data to be routed and sent to the correct destination across the network[^3]
- ATM equipment includes routers, switches, and network interface cards (NICs), often housed in rack-mounted units in data centers.
	- #question what is a rack-mounted unit?
- A typical ATM switch can be the size of a small server (desktop unit) or a large rack-mount system used by telecom providers
	- #question Who are the current telecom providers?

### Networking Technology
- ATM is a networking technology. It is a protocol and switching method used in telecommunication networks
	- #question What is a protocol and switching method?
- ATM defines how data is formatted (into cells) and transmitted over dedicated virtual circuits
	- #question What exactly is a cell? What other kind of formats can data be formatted into?
- ATM is not a network itself but rather a networking technology and protocol used to build networks. It defines how data is formatted, transmitted, and switched across a network
	- However, an ATM-based network can be built using ATM switches, routers, and interfaces. 
		- In this sense, ATM is often referred to. as an ATM network, meaning a network that uses ATM as its underlying transport technology
		- #question What is a transport technology?

### ATM and IP network differences
- ATM
	- Used fixed-size 53-byte cells
		- Good for predictable performance
		- #question How was a 53-byte cell chosen?
	- Uses virtual circuits for dedicated paths
	- Supports [[Quality of Service|QoS]] for real-time traffic like voice and video
	- Requires specialized hardware and was expensive to scale
- IP Networks 
	- Uses variable-sized packets (more flexible but can introduce delays)
		- #question Couldn't a fixed-size packet also introduce delays?
	- Uses [[packet switching]] (each packet can take a different route)
	- More scalable and cost-effective, leading to ATM being replaced
	- Uses [[best-effort delivery]], with some QoS improvements in later years (such as [[Multiprotocol Label Switching|MPLS]])
- Main difference: ATM is structured and predictable but costly, while IP networks are flexible, scalable, and eventually more efficient for most applications
### ATM Interfaces
- Types of ATM interfaces
	- OC-3, OC-12, [[OC-48]], etc. (fiber optic links at different speeds)
		- #question Is the higher the number, the greater the speed?
	- DS3 (T3) / E3 (legacy telecom interfaces)
	- UTP ([[Unshielded Twisted Pair]]) for lower-speed ATM over copper
	- ATM over [[synchronous optical networking|SONET]] (Synchronous Optical Network)
	- ATM over DSL ([[Digital Subscriber Line]]), used in broadband networks.
		- #question What are broadband networks?
		- #question Does DSL use copper?

### Hardware for ATM
- ATM required specific hardware to operate:
	- [[ATM Switches]] (like routers but designed for ATM cells).
	- ATM Network Interface Cards (NICs) for computers/servers.
		- #question What are some examples of ATM Network Interface cards
		- #question do IP NICs exist too?
	- [[DSL access multiplexer|DSLAMs]] (Digital Subscriber Line Access Multiplexers), which used ATM for broadband.
	- ATM-compatible routers from companies like [[Cisco]] and [[Juniper]].
- Software was needed to manage ATM networks, but the technology itself was heavily hardware-dependent
	- This made it costly compared to newer software-based IP networks
	- #question are IP networks software based?

## Source[^4]
- ATM transfers data in fixed-size units known as cells. Each cell includes 53 octets or bytes.
	- #question is an octet the same as a byte?
- The first 5 bytes contain cell-header data, and the remaining 48 include the payload (user information).

## Source[^5]
- ATM defines two different cell formats
	- [[user-network interface]] (UNI)
	- [[network-network interface]] (NNI)

## Source[^6]
- ATM isa high-speed networking standard that transmits data in fixed-size cells, typically 53 bytes
- Unlike traditional packet-switched networks, ATM uses a connection-oriented approach, ensuring reliable data delivery
- This technology integrates voice, video, and data, making it versatile for various applications
## References

[^1]: https://www.computerhope.com/jargon/a/atm.htm
[^2]: ChatGPT
[^3]: Google's Search Labs | AI Overview
[^4]: https://www.tutorialspoint.com/explain-the-atm-cell-structure-in-computer-network
[^5]: https://en.wikipedia.org/wiki/Asynchronous_Transfer_Mode#:~:text=An%20ATM%20cell%20consists%20of,links%20use%20UNI%20cell%20format.
[^6]: https://www.lenovo.com/us/en/glossary/asynchronous-transfer-mode/