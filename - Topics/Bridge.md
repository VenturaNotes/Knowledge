---
aliases:
  - bridges
---
## Synthesis
- 
## Source [^1]
- A unit that supports a low-level link of two regions of a single network. In networks using a broadcast protocol, in which all network nodes receive all messages, it is helpful to subdivide the network into a number of regions in which the majority of traffic is between pairs of nodes within that region, with only a small amount of traffic leaving the region. A bridge can be inserted between two such regions: it allows interregion traffic to cross the bridge but will not forward into the second region traffic that is addressed to a destination in the same region as the sender. To achieve this, a bridge must be capable of interpreting the sender and receiver addresses in the data. It must therefore be capable of interpreting the network protocol, and will almost certainly need to store an entire packet before forwarding it. The bridge will be designed so as to function at the lowest possible level within the protocol stack, consistent with achieving correct partitioning of the network.
- Despite the complexity of the unit, and the delay it introduces, large networks almost invariably include bridges since their presence greatly reduces the total network traffic. A bridge may be adaptive, determining the addresses in each region by examining the contents of the address fields of the packets. A bridge may operate as a [[filtering bridge]], with a fixed set of node identities that will be allowed to send packets across the bridge, providing a limited form of safeguard against unwanted attempts to connect to a sensitive system. See also FIREWALL, ROUTER.
## Source[^2]
- $n$. (in dentistry) a fixed replacement for missing teeth. The artificial tooth is attached to one or more natural teeth, usually by a crown. Bridges may also be fitted on dental implants. The supporting teeth (or implants) are referred to as abutments, and the artificial teeth that fit over them are referred to as retainers. The replacements of missing teeth are known as pontics. Adhesive bridges are attached to one or more adjacent teeth by a metal plate that adheres to the enamel on the tooth surface prepared by the acid-etch technique; these bridges require minimal tooth preparation compared with conventional types of bridges.
## Source[^3]
- (1) An assembly of at least four circuit elements, such as resistors, capacitors, etc., together with a current source and a null point detecting device (see diagram). Each of the circuit elements is arranged in one arm of the bridge. When the bridge is balanced, i.e. zero response is obtained from the null detector, there is a calculable relationship between the values of elements in the arms given by$$\left(\frac {Z _ {1}}{Z _ {2}}\right) = \left(\frac {Z _ {3}}{Z _ {4}}\right)$$An unknown element may therefore be very precisely measured by comparison with known standards. The current source may produce either direct or alternating current. Bridge networks form the basis of many measuring instruments.
- ![[Screenshot 2026-03-03 at 5.59.32 AM.png|400]]
	- Bridge circuit
	- Parts
		- Detector
		- Driving Voltage
- For resistance measurements see WHEATSTONE BRIDGE; KELVIN DOUBLE BRIDGE; CAREY-FOSTER BRIDGE. For capacitance measurements see WIEN BRIDGE; DE SAUTY BRIDGE; SCHERING BRIDGE. For inductance measurements see ANDERSON BRIDGE; HAY BRIDGE; MAXWELL BRIDGE; OWEN BRIDGE. For mutual inductance measurements see CAMPBELL BRIDGE; FELICI BALANCE; HARTSHORN BRIDGE. See also RESONANCE BRIDGE; WAGNER EARTH CONNECTION.
- (2) A device that connects computer networks at the data-link layer. Bridges should be transparent, so that the end terminals do not know that they are on the same network.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) Concise Medical Dictionary 10th Edition by Oxford Reference]]
[^3]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]