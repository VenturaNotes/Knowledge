---
aliases:
  - DQDB
---
## Synthesis
- 
## Source [^1]
- A form of network originally designed for use with optical fibres in metropolitan area networks. The system is based on two unidirectional buses, usually referred to as the A-bus and B-bus, that pass in opposite directions through a number of nodes. Traffic on these buses is processed in cells, each holding 53 bytes, with a 5 byte header and a 48 byte payload. This cell size is chosen to allow seamless interworking with ATM-based networks.
- The head end of the A-bus and the tail end of the B-bus are collocated in a single node, and the tail end of the A-bus and the head end of the B-bus are again collocated in a node. Each head end transmits a stream of cells, which it either uses for its own transmissions and marks as being full, or marks as free; at the tail end the incoming cells are discarded. Any node can use one of the buses to pass packets to a node downstream of the sending node, and the receiving node can similarly use the other bus for the return traffic; thus each bus carries traffic in only one direction, but any two nodes have a full duplex connection. If there is a failure of either a node or a bus, the nodes immediately adjacent to the failure will reconfigure so as to take on the roles of the head and tail ends for the appropriate buses. At start-up, or after a failure and reconfiguration, nodes can identify which bus to use for which addresses by examining the source addresses of incoming packets on each bus.
- As each cell passes through each node, the node has the opportunity to convert a single bit within the cell to a request for access to the bus. Each node also maintains counters of requests for access to the bus, and of free cells, and the nodes are thus able to cooperate to implement what is in effect a first come first served queue for access to the two buses.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]