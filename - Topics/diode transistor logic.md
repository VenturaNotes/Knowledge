## Synthesis
- 
## Source [^1]
- (DTL) A family of integrated logic circuits in which each input signal comes through a diode and the output is taken from the collector of an inverting transistor (see INVERTER). The basic circuit is a NAND gate (see diagram). If any of the inputs is at the low logic level the corresponding input diode is forward biased and can conduct current away from the diodes $\mathrm{D}_1$ and $\mathrm{D}_2$. The potential at point X is therefore at a value determined by the diode forward voltage and represents the low logic level. It is insufficient to forward bias $\mathrm{D}_2$ and no current can flow to the base of the transistor. The transistor is therefore 'off' and the collector voltage is at the high logic level. If all the inputs are high, all the input diodes are reverse biased and cannot conduct current. The potential at point X is therefore high. Both $\mathrm{D}_1$ and $\mathrm{D}_2$ are forward biased and current flows to the base of the transistor, which turns on and saturates. The collector voltage falls to the low logic level.
- The speed of the DTL circuit is slow compared to emitter-coupled logic circuits because the output transistor is operated in the saturated mode: carrier storage at the collector junction causes a delay in the switching time between logic levels. DTL circuits have been largely replaced by transistor-transistor logic circuits.
- ![[Screenshot 2026-03-10 at 8.14.18 AM.png|400]]
	- Diode transistor logic NAND circuit
	- Parts
		- Any input low
		- All inputs high
		- Output
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]