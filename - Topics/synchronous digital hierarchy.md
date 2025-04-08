---
aliases:
  - SDH
---
## Synthesis
- 
## Source [^1]
- A set of CCITT standards, and products that implement those standards, intended to support high-speed wide area networking; the intention is to support bit rates from the 100 Mbps range upward. The basic unit of transmission within the SDH is the [[synchronous transport module]], which at present is defined up to STM-1024.
- A major problem for large-scale WANs is that of allowing relatively low-speed links (tributaries) to insert data into the high-speed bearer, or recover data from it, caused by timing problems relating to the large difference in clock rates between the tributary and the high-speed bearer-typically 100-1000 orders of magnitude. STM-1 uses a fixed-size module conceptually made up of 9 rows each of 270 bytes. Modules are transmitted at 125 microsecond intervals, row by row and byte by byte, to give a total transmission rate of 155 Mbps. Within each module, specific rows are assigned to specific types of traffic. The first 9 bytes of each row are assigned for timing and control for the contents of the other 261 bytes. The system is designed to allow tributaries to insert or extract data through a series of units, each of which can accept (or deliver) self-timing data at relatively low clock rates, up to about 8 Mbps , or can accept the output from (or deliver input to) such units at speeds that are submultiples of that for the STM-1 system. The 'hierarchy' defines the operations and protocols for all the units needed.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]