---
aliases:
  - FDDI
---
## Synthesis
- 
## Source [^1]
- A high-speed network system designed to operate over distances of tens of kilometers. The system uses a pair of optical fibers to carry a single signal path. Two such pairs may be used to interconnect nodes so as to form a ring (so-called dual attach), or a single pair of fibers may be used to connect a spur extension to a node on the ring that acts as a wiring concentrator (so-called single attach). The ring is normally treated as a primary ring carrying live traffic, and a secondary ring used for fault identification. If a node or an optical path fails, the system will reconfigure by 'wrapping' the ring in order to isolate the faulty node or path, and to use the secondary ring as the return path for packets.
- The FDDI system operates at a nominal 100 Mbps of data, using the pair of fibers to encode four bits of original data onto five bits of self-clocking signals, and with an actual bit rate of 140 Mbps . Access to the ring uses a modified version of a token ring protocol, in which more than one token can be present on the ring at any one time. In principle FDDI allows up to 500 nodes to connect to a single ring and this can give a long latency between a node wishing to transmit and the arrival of a token allowing it to do so. To control this, a node wishing to acquire the token will defer to requests for the token from nodes with a higher priority. The system actually uses two separate sets of priorities$\textemdash$one for synchronous traffic, for which each node is guaranteed an agreed data rate, and one for asynchronous traffic, where a node can use any spare capacity not taken up by other nodes.
- Although its original design was directed at metropolitan area network (MAN) services, FDDI is used in LAN services, especially as a backbone network between routers or to connect a specific server with very heavy traffic requirement to the backbone.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]