## Synthesis
- 
## Source [^1]
- Connecting several computer networks together to form a single higher-level network, as occurs in the Internet. There are two basic approaches: encapsulation and [[translation]]. The junctions between networks are called gateways, and their functions depend on which internetworking approach is taken.
- When encapsulation is used, a new protocol layer (or layers) is defined; this provides uniform semantics for services such as datagram packet switching, email, etc. When a message is entered into the internetwork, it is wrapped (encapsulated) in a network-specific protocol (local network datagram headers, or virtual circuits). The encapsulated packet is sent over the network to a gateway, which removes the old network-specific encapsulation, adds a new set of network headers, and sends the packet out on another network. Eventually the message reaches its destination, where it is consumed.
- When [[protocol translation]] is used, messages are sent on a local network using the protocols and conventions of that network. A gateway receives the message and transforms it into the appropriate message on another network; this may involve interpreting the message at multiple protocol levels.
- The encapsulation approach provides a uniform set of semantics across all networks, while the translation approach results in unanticipated problems due to subtle differences between protocols. The encapsulation approach generally requires that new software be written for all hosts on all networks, while the translation approach requires new software only in the gateways. See also IP.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]