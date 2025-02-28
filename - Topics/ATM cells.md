---
aliases:
  - ATM cell
---
## Synthesis
- 
## Source [^1]
- ATM Cell Header Fields
	- [[Generic Flow Control]] (GFC)
		- It supports local functions, such as recognizing multiple stations that send a single ATM interface. This field is generally not used and is set to its default value of 0 (binary 0000)
			- #question what is meant by local functions?
			- #question What is an ATM interface?
			- #question Is binary only 4 digits long?
	- [[Virtual Path Identifier]] (VPI)
		- In conjunction with the Virtual Channel Identifier, it recognizes the next destination of a cell as it transfers through a series of [[ATM switches]] on the way to its destination
	- [[Virtual Channel Identifier]] (VCI)
		- In conjunction with the virtual path identifier, it recognizes the next destination of a cell as it transfers through a series of ATM switches on the way to its destination
	- [[Payload Type]] (PT)
		- It denotes the first bit whether the cell includes user data or control data. If the cell includes user data, the bit is set to 0. If it includes control data, it is set to 1. The second bit denotes [[congestion]] (0 = no congestion, 1 = congestion), and the third bit denotes whether the cell is the last in a sequence of cells that define a single AAL5 frame (1 = last cell for the frame)
			- #question What is an AAL5 frame?
	- [[Cell Loss Priority]] (CLP)
		- It denotes whether the cell should be removed if it encounters extreme congestion as it transfers through the network. Suppose the CLP bit is similar to 1, and the cell should be discarded in preference to cells with the CLP bit equal to 0
	- [[Header Error Control]] (HEC)
		- It evaluates [[checksum]] only on the first 4 bytes of the header. It can be valid a single bit error in these bytes, thereby preserving the cell instead of discarding it.
			- #question Is this just saying that the 5th byte can be in error? If so, why so?
## References

[^1]: https://www.tutorialspoint.com/explain-the-atm-cell-structure-in-computer-network