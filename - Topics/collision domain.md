---
aliases:
  - collision domains
---
## Synthesis
- 
## Source [^1]
- A region of a network where the packets sent by different host computers may collide with one another. A link between any two hosts, A and B, constitutes a collision domain if packets sent by A may collide with those sent by B. If many hosts are connected to a hub, the domain constituted by the hub and all the hosts connected to it also form a collision domain, since a packet sent by one host (i.e. present on one segment of the network) is broadcast to all the other hosts (i.e. sent on all other segments). If the hosts are connected to a switch, each segment host-switch forms a single collision domain, except when the link is between a router and a hub. Switches are therefore said to 'segment' collision domains. In effect, messages that transit by a switch are directly sent to the destination host, thus restricting collisions to the segment between host and switch. For the same reason, routers also segment collision domains: every link to a router is its own collision domain, except where the link is between a router and a hub. See also BROADCAST DOMAIN.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]