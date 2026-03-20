---
aliases:
  - FPGA
  - field programmable gate array
---
## Synthesis
- 
## Source [^1]
- A PGA that may be programmed by the user, i.e. on the customer's premises. See also PROGRAMMED LOGIC.
## Source[^2]
- (field programmable gate array) An array of logic cells placed in an infrastructure of interconnections, where each logic cell is a universal function - a functionally complete logic device - that can be programmed to realize a certain function. Interconnections between cells are also programmable, but unlike other programmable logic devices (PLDs) these interconnections are of different types and several paths are possible between two given points in the circuit (Fig. a); all prediction of the timing is impossible before the final routing of the circuit. Input/output cells are equally programmable, but with fewer possibilities (direction of the information, storage element, electrical level) than logic cells.
- ![[Screenshot 2026-03-19 at 8.47.04 AM.png|400]]
	- (a) Corner of a typical FPGA
	- Parts
		- External pins
		- Interconnect area
		- Switch matrix
		- I/O pads
		- Logic block
- The complexity of the internal logic of an FPGA renders it comparable to a gate array, and its cycle of design is also very similar. Its main advantage is the time of realization: programmable on the spot, an FPGA circuit is in a working state a few minutes after the end of the design, compared to some months for a gate array.
- One of the differences between FPGAs and other programmable devices is that one FPGA logic block can be programmed to implement a two- to four-level combinational logic circuit, and the output(s) of that logic block can become the inputs to other logic blocks. An example of the lower-level logic block is shown in Fig. b, where there are two flip-flops, nine multiplexers, and a seven-input combinational function unit. The combinational unit can be programmed to realize any two four-input logic functions, or any one five-input logic function (similar to an embedded PLA). The logic block accommodates up to eight inputs and two outputs.
- ![[Screenshot 2026-03-19 at 8.48.26 AM.png|400]]
	- (b) Logic cell for typical FPGA
	- Parts
		- Input
		- Combinational function block
		- Flip-flop
		- Global connection
		- Output
		- Mux
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]