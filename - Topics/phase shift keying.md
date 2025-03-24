---
aliases:
  - PSK
---
## Synthesis
- 
## Source [^1]
- A method for representing digital data with analogue signals by changing the phase of the analogue carrier to represent the digital information (see diagram). It is a type of modulation.
- There are two ways of detecting the phase information in a signal. Fixed-reference PSK assigns a meaning to each phase position. The demodulator uses a signal source of the same frequency to compare with the incoming signal and detect its phase.
- Differential PSK assigns meaning to phase changes, e.g. a phase change of $180^{\circ}$ could be taken to mean a 1, while no phase change means a 0 . No comparison with another wave is needed in the demodulator.
- ![[Screenshot 2025-03-23 at 1.13.03 AM.png]]
	- Phase shift keying. 2-phase modulation
	- Terms
		- Amplitude
		- phase change $180\degree$
		- Time
		- Binary 0, binary 1
- The amount of information associated with a phase or phase change depends on the number of discrete phases that the carrier may assume. If the carrier may assume two phases then each phase or phase change represents a single bit. If four phases are used then each phase or phase change represents a different combination of two bits. The greater the number of discrete phases, the more difficult it is to generate, transmit, and detect the analogue signal, thus the cost is higher; for this reason, modems that require eight or more discrete signals usually combine the phase changes with changes in amplitude in order to make the signals more distinct.
- See also DIGITAL DATA TRANSMISSION.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]