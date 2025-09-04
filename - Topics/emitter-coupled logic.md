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
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]