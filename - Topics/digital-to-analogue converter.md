## Synthesis
- 
## Source [^1]
- (DAC) A device/circuit/IC that converts a discrete binary signal into a continuous analogue signal. A simple DAC can be built up from a series of weighted resistors. Taking a 4-bit binary word, $B = b_3b_2b_1b_0$, the most significant bit ($b_3$) is connected to a resistor of value $2R$, bit $b_2$ to a $4R$ resistor, $b_1$ to an $8R$ resistor, and so on. The value of the resistor doubles for each less-significant bit. If any bit is at logical 1, a voltage is applied across its resistor and a current inversely proportional to the resistor flows. An operational amplifier circuit can be used to sum the currents and produce a voltage proportional to the total current flowing. The magnitude of the voltage will therefore be directly proportional to the value of the binary number $B$.
- ![[Screenshot 2026-03-09 at 11.39.58 PM.png|400]]
	- 4-bit digital-to-analogue converter
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]