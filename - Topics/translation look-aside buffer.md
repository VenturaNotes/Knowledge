---
aliases:
  - TLB
---
## Synthesis
- 
## Source [^1]
- A specific component of some implementations of a cache, especially in conjunction with paged memory management (see PAGING). A cache is a high-speed memory, occupying a position in the memory hierarchy between the high-speed registers of a processor and the main random-access memory (RAM) of the system. The cache holds copies of small areas of the RAM, each area being labelled with both the physical address of the area of RAM of which it is a copy and with the address by which it is known to the process owning it. The process form of the address, which typically contains segment and page information, is translated to the corresponding physical address by the hardware of the address management system; a TLB is an associative memory that indicates whether this address corresponds to one held in the cache, and so can be accessed by using the cache, or whether it is necessary to fetch the corresponding area of memory from RAM into the cache.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]