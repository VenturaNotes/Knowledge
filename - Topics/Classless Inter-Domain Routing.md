---
aliases:
  - CIDR
---
## Synthesis
- 
## Source [^1]
- The current system for allocating and interpreting IP addresses on the Internet, introduced in 1993. Formally IP version 4 addresses (see TCP/IP) were interpreted as belonging to one of four classes when determining how many bits signified the network identity and how many the hosts on that network; the effect was that networks had to have either 8-, 16-, or 24- bit host numbers. This system was crude and wasteful of the limited store of possible IP addresses-an issue that became acute as the Internet grew. CIDR adopts a more flexible approach: the division point between network identity and host number can appear between any two bits, allowing for much more precise and appropriate allocations. The division point can be varied for the same IP address, allowing related networks to be grouped into a hierarchy with the lower levels using progressively longer network identities. This technique considerably reduces the amount of routing data that has to be stored and transmitted. CIDR is also used with IP version 6.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]