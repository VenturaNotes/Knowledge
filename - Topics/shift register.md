## Synthesis
- 
## Source [^1]
- A register that has the ability to transfer information in a lateral direction. It is an $n$-stage clocked device whose output consists of an $n$-bit parallel data word (see diagram). Application of a single clock cycle to the device causes the output word to be shifted by one bit position from right to left (or from left to right). The leftmost (or rightmost) bit is lost from the 'end' of the register while the rightmost (or leftmost) bit position is loaded from a serial input terminal. The device may also be capable of being loaded with parallel $n$-bit data words, these then being shifted out of the device in serial form. See also SERIAL IN PARALLEL OUT, PARALLEL IN SERIAL OUT, PARALLEL IN PARALLEL OUT, SERIAL IN SERIAL OUT.
- Shift registers with parallel outputs, and with combinational logic fed from those outputs (see COMBINATIONAL CIRCUIT), are of great importance in digital signal processing, and in the encoding and decoding of error-correcting and error-detecting codes. Such registers may be implemented in hardware or in software, and may be binary or q-ary. (Hardware implementation is usually convenient only for binary and sometimes ternary logic.) See FEEDBACK REGISTER, FEED-FORWARD REGISTER, GOOD-DE BRUIJN DIAGRAM.
- ![[Screenshot 2025-03-24 at 11.12.12 PM.png|400]]
	- Terms
		- serial in
		- load enable
		- output after 1 shift right
		- x depends on previous output
		- clock
- Shift register. An n-bit shift register
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]