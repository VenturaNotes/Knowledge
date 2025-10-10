---
aliases:
  - static RAM
  - static random access memory
---
## Synthesis
- SRAM: Static random access memory
	- Static: No refreshing needed to retain data as long as power supplied
		- #question Why not possible if power not supplied?
		- #question Can DRAM retain data if power not supplied?
		- #question What is meant by refreshing? Are we refreshing the data or hardware?
		- #question Does it not need to refresh because it uses transistors instead of capacitors?
	- Random Access: Any memory location can be accessed directly in constant time
		- #question How can it be accessed in constant time? What is the needle thing called on a hard drive I think where it needs to touch the data point to be read? 
	- Memory: Stores [[bit|bits]] used by [[Central Processing Unit|CPU]]
		- #question How many bits can SRAM store?
		- #question Is SRAM hardware?
- SRAM uses transistors. Each bit in SRAM is built from a flip-flop, typically made up of 6 transistors (6T)
	- #question Is 6T a common abbreviation for 6 transistors?
	- 2 transistors form the cross-coupled inverters (to store a stable 0 or 1)
		- #question What is a cross-coupled inverter?
	- 4 transistors are used for access control and stability
		- #question Why are 4 transistors needed for control access and stability?
## Source [^1]
- This is the fastest type of memory technology
- The fastest memory is typically static RAM (SRAM), which is [[cache memory]] for storing the [[Central Processing Unit|CPU]]'s most recently used data and instructions
- SRAM provides the [[processor]] with faster access to the data than retrieving it from the slower [[Dynamic Random Access Memory|dynamic RAM]] (DRAM) or main memory
## Source[^2]
### Description
- SRAM is faster than [[DRAM]] because DRAM cannot be accessed during its refresh cycle
	- #question I feel like "cannot be accessed" is a poor choice of words because DRAM itself technically is accessed when refreshing. Would it be better to say that the data on the DRAM cannot be accessed? I think that would sound more appropriate.
	- #question Is DRAM considered hardware?
---
- SRAM is faster because [[DRAM]] has a refresh cycle during which it cannot be accessed
	- #comment Faster basically means access time $\textemdash$ how long it takes to read or write a bit. Faster means lower latency and higher speed of data access
		- #question What is the difference between latency and speed of access if there is one or it's just a redundant comment?
		- SRAM is very fast (a few nanoseconds) because it doesn't need to wait for refresh cycles meaning data is immediately available
		- DRAM is slower (tens of nanoseconds), due to refresh requirement and need to charge/discharge capacitors carefully to read data
			- #question Is refreshing the same as charging and discharging capacitors or are they the same thing? 
- SRAM requires more components per bit, so it's more expensive to manufacture and it takes more space on the silicon
	- #comment SRAM uses transistors. 
	- #question What kind of components does SRAM require which is not true for DRAM?
	- #question What does components per bit mean?
	- #question How many more components are there on SRAM and DRAM
	- #question What exactly is SRAM and DRAM? What do they do and how do they even work?
- #comment By contrast, SRAM stores each bit using flip-flops (stable logic circuits made of transistors) that don’t lose their state as long as power is on
	- No refresh needed and it's always accessible
	- #question Aren't logic circuits always stable?
	- #question Are "flip-flops" a proper term?
## References

[^1]: https://itexamanswers.net/question/what-is-the-fastest-type-of-memory-technology
[^2]: [Computer Science and Software Engineering Anki Deck by Petio Petrov](https://ankiweb.net/shared/info/1189495677)