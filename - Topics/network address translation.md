---
aliases:
  - NAT
---
## Synthesis
- 
## Source [^1]
- When an organization's network uses private IP addresses, external communications must be converted to use public addresses as they cross the boundary between the private and public network. Network Address Translation is one way to achieve this. When a packet is sent to an external address the boundary firewall replaces the private source address by one of a small pool of public addresses; when a reply packet is received for that public address the firewall replaces the packet's destination address with the correct private address. Although intended to reduce the number of public addresses needed, NAT can also be used as a security tool as it reduces the exposure of internal systems to external attack.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]