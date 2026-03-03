## Synthesis
- 
## Source [^1]
- (ADC) A device/circuit/IC that converts a continuous analogue signal into a discrete binary signal. There are many forms of ADC, including continuous balance converters, voltage-to-frequency converters, and dual ramp or integrating converters. A simple continuous balance converter is shown in the diagram. The counter is initially set to zero so that signal $V_{2}$ from the digital-to-analogue converter (DAC) section of the circuit is zero. When the unknown input $V_{1}$ is greater than $V_{2}$, the comparator provides an output voltage that opens the gate and allows pulses to be applied to the counter. So long as the gate remains open, clock pulses are fed to the counter and $V_{2}$ continues to increase. When $V_{2}$ equals $V_{1}$, the comparator output falls to zero and closes the gate. This 'freezes' the number stored in the counter, which can then be displayed on a digital readout device. In practical forms of the device, the counter is one that can count 'up' and 'down' to allow changes in $V_{1}$ to be followed.
- ![[Screenshot 2026-03-03 at 2.04.38 AM.png|600]]
	- 4-bit analogue-to-digital converter
	- Parts
		- Comparator
		- Gate
		- Counter
		- Clock
		- Analogue output
		- DAC
		- visual readout and output devices
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]