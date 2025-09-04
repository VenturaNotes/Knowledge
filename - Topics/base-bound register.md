## Synthesis
- 
## Source [^1]
- (base-limit register) Hardware used for virtual memory allocation. A base-bound register is associated with each segment of data or code and defines the position in physical memory of word zero for that segment, the so-called base, and the number of words available to that segment, the so-called bound or limit(or alternatively the physical memory address of the next word after the end of the segment, in which case it is a bounds register). Whenever a process attempts to access the memory segment, the hardware of the system checks that the address of the word lies within the range$$0 \le \text{ word address } < \text{bound}$$and then adds the address to the value contained in the base register to give the physical address. A restriction on this system is that the storage for the segment must be allocated in a contiguous area of memory (see BEST FIT, FIRST FIT).
- The base register, used in the construction of relative addresses, should not be confused with the base of a base-bound system; the result of modifying an address by a base register's contents is still an address within virtual memory space of the process, and is not necessarily a physical address.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]