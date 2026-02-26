---
aliases:
  - random-access memory
  - RAM
---
## Synthesis
- 
## Source [^1]
- (1) The main memory of a computer. It is fabricated using semiconductor technology and allows the computer user to access (read from) or alter (write to) individual storage locations within the device (see def. 2). 
- (2) A semiconductor memory device in which the basic element consists of a single cell that is capable of storing one bit of information. Large-capacity memories are formed as two-dimensional arrays of these cells. An individual cell is identified uniquely by row and column addresses, which are derived by decoding a user-supplied address word. A typical organization is shown in the diagram. Each cell in a RAM is thus independent of all other cells in the array and can be accessed in any order and in the same amount of time, hence the term random access; data can be both read from and written to the cells in the array. RAM is usually volatile memory and is used for temporary storage of data or programs.
- ![[Screenshot 2026-02-25 at 2.51.36 AM.png]]
	- RAM. Typical organization of a RAM
		- Parts
			- Row decoder
			- Memory array
			- data in
			- read/write select
			- write
			- chip select
			- data out
			- sense
			- column decoder
			- user-supplied address
- RAM devices can be classified as static or dynamic. [[SRAM|Static RAM]] (SRAM) is fabricated from either bipolar or MOS components (see BIPOLAR TRANSISTOR, MOSFET); each cell is formed by an electronic latch whose contents remain fixed until written to or until the power is removed. Dynamic RAM (DRAM) cells, which comprise MOS devices, utilize the charge stored on a capacitance as a temporary store (see BUCKET); because of leakage currents, the cell contents must be refreshed at regular intervals. The design of RAM chips is evolving and new standards arise frequently. The trend is for RAM to be sold in modules rather than individual chips. See DIMM.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]