---
aliases:
  - bridges
---
## Synthesis
- 
## Source [^1]
- A unit that supports a low-level link of two regions of a single network. In networks using a broadcast protocol, in which all network nodes receive all messages, it is helpful to subdivide the network into a number of regions in which the majority of traffic is between pairs of nodes within that region, with only a small amount of traffic leaving the region. A bridge can be inserted between two such regions: it allows interregion traffic to cross the bridge but will not forward into the second region traffic that is addressed to a destination in the same region as the sender. To achieve this, a bridge must be capable of interpreting the sender and receiver addresses in the data. It must therefore be capable of interpreting the network protocol, and will almost certainly need to store an entire packet before forwarding it. The bridge will be designed so as to function at the lowest possible level within the protocol stack, consistent with achieving correct partitioning of the network.
- Despite the complexity of the unit, and the delay it introduces, large networks almost invariably include bridges since their presence greatly reduces the total network traffic. A bridge may be adaptive, determining the addresses in each region by examining the contents of the address fields of the packets. A bridge may operate as a [[filtering bridge]], with a fixed set of node identities that will be allowed to send packets across the bridge, providing a limited form of safeguard against unwanted attempts to connect to a sensitive system. See also FIREWALL, ROUTER.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]