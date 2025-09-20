## Synthesis
- All packets sent from OLT to the splitter are replicated at the splitter[^1]
### Replication
- PONs are designed as a shared medium, where multiple [[Optical Network Units]] (ONUs) share the same downstream and upstream bandwidth. By replicating packets at the splitter, each ONU connected to the splitter can receive the same data stream simultaneously. This allows for
	- Efficient for bandwidth utilization
		- Software updates, streaming content caching, or commonly accessed web resources can benefit from being replicated and delivered simultaneously to multiple ONUs
			- Reduces redundant traffic and optimizes bandwidth usage
	- Support for Real-Time Services
		- Replicating packets ensures that critical information, such as real-time video streams for live events or emergency alerts, can be distributed efficiently to all relevant ONUs without delay.
	- Scalability and Network Design
		- Replication at splitters provides a flexible and scalable approach to delivering content
	- Fault Tolerance and Redundancy
		- Packet replication contributes to fault tolerance and redundancy. 
## References

[^1]: [[(Home Page) Computer Networking A Top-Down Approach 8th Edition by James F. Kurose and Keith W. Ross#1 2 The Network Edge]]
