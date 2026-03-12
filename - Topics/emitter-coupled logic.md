---
aliases:
  - ECL
---
## Synthesis
- 
## Source [^1]
- A high-speed logic family available in the form of integrated circuits based on bipolar transistors. The fast switching speeds are achieved by means of a design that avoids driving the transistors into saturation.
- The basic circuit element is based on a difference amplifier, as shown in the diagram (ignoring dashed lines). In this symmetrical circuit the combined emitter current flowing through the resistor $\mathrm{R}_{\mathrm{e}}$ is substantially constant. If the voltage $V_{\mathrm{i}}$ is equal to $V_{\text {ref }}$ then each transistor, $\mathrm{Q}_{1}$ and $\mathrm{Q}_{2}$, conducts by the same amount and the output is at $V_{\text {ref }}$. If $V_{\mathrm{i}}$ is increased above $V_{\text {ref }}$ by more than about 0.1 volts, $\mathrm{Q}_{1}$ will be turned on while $\mathrm{Q}_{2}$ turns off. As a result Vo increases to $V^{+}$. Similarly if $V_{\mathrm{i}}$ is decreased below $V_{\text {ref }}$ by more than about 0.1 volts, $V_{\mathrm{o}}$ will decrease to some value largely determined by $V_{\mathrm{EE}}, R_{\mathrm{e}}$, and $R_{\mathrm{c}}$.
- ![[Screenshot 2025-03-30 at 9.16.45 PM.png]]
	- ECL. Two-input ECL OR gate
- By placing transistors in parallel with Q1, as shown by the dashed lines, an ECL OR gate is produced. Additional buffering is required on the gate output to provide the correct voltage swings for subsequent gate inputs.
- ECL provided the highest speed of any silicon-based logic family but its high power dissipation and the need for high levels of integration mean that it has been superseded by CMOS technology.
## Source[^2]
- (ECL) A family of integrated logic circuits so called because a pair of transistors coupled by their emitters forms a fundamental part of the circuit. The basic ECL gate has simultaneously the function required and its complement.
- A simple OR/NOR circuit is shown in Fig. a. Input is via the bipolar junction transistors $\mathrm{T}_{1\mathrm{a},\mathrm{b},\mathrm{c}}$ ; these are emitter-coupled to transistor $\mathrm{T}_2$ and form a long-tailed pair with it. This is an excellent differential amplifier. An emitter-follower buffer forms the output stage. Transistor $\mathrm{T}_2$ has a fixed bias applied to its base with magnitude halfway between a logical 1 and a logical 0. If a logical 0 is applied to all three input transistors then current flows through $\mathrm{T}_2$ causing a voltage drop across $\mathbf{R}_2$ . This in turn produces a logical 0 at the OR output and a logical 1 at the NOR output. If any one of the input transistors $\mathrm{T}_{1\mathrm{a},\mathrm{b},\mathrm{c}}$ has a logical 1 applied, current flows through that transistor producing a voltage drop across $\mathbf{R}_1$ and the outputs are hence reversed, i.e. a logical 1 occurs at the OR output. Typical values of applied voltages are -1.55 volts (logical 0), -0.75 volts (logical 1), -1.15 volts (fixed bias).
- ![[Screenshot 2026-03-12 at 1.56.41 AM.png|400]]
	- (a) ECL OR/NOR circuit
	- Parts
		- External pull-down resistors
		- NOR output
		- OR output
- The transistors are operated in nonsaturated mode and the delay is exceedingly short (approximately one nanosecond) making ECL circuits inherently the fastest type of logic circuit.
- Simpler versions of the original ECL circuits have been designed for VLSI circuits; these have a higher packing density and operate with lower voltage swings. Fig. b shows a simple low-voltage ECL gate in which the emitter-follower transistors are replaced by Schottky clamped-load resistors $\mathbf{R}_1$ and $\mathbf{R}_2$ . The fixed reference bias applied to transistor $\mathrm{T}_2$ is generated 'on-chip' rather than being supplied externally. The total difference between the 'high' and 'low' logic levels is equal to the forward bias of the Schottky diode, $V_{\mathrm{DS}}$.
- ![[Screenshot 2026-03-12 at 1.57.33 AM.png|400]]
	- (b) Low-voltage ECL gate
- An alternative form of higher packing density ECL circuit uses ECL circuits connected in series (gated); this allows a more complex logic function to be implanted on a smaller area of chip. This method of series-gated circuit design is also widely used in FET circuitry.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]