---
aliases:
  - TTL
---
## Synthesis
- 
## Source [^1]
- A widely used family of logic circuits that is produced in integrated-circuit form and whose principal switching components are bipolar transistors. It is available in low power and high switching speed versions (see SCHOTTKY TTL), in addition to the standard form.
- The diagram shows the equivalent circuit of a TTL two-input NAND gate. The basic circuit uses a multiemitter bipolar transistor, $\mathrm{Q}_{1}$, which is easily fabricated in integrated-circuit form. Each base-emitter junction of $\mathrm{Q}_{1}$ effectively acts as a diode, in a similar manner to a DTL input stage. Thus if all inputs are at a high voltage (logic 1), all input 'diodes' are reverse biased; the collector voltage of $\mathrm{Q}_{1}$ rises to $V_{\mathrm{cc}}$, turning on $\mathrm{Q}_{2}$ (which acts as a phase splitter). The emitter voltage of $\mathrm{Q}_{2}$ rises while its collector voltage falls, turning $\mathrm{Q}_{3}$ on and $\mathrm{Q}_{4}$ off. The output thus falls to logic 0 , i.e. zero volts.
- If any one of the $\mathrm{Q}_{1}$ inputs is returned to logic 0,0 volts, then $\mathrm{Q}_{1}$ is turned hard on, turning off $\mathrm{Q}_{2}$ whose collector voltage rises; this turns on $\mathrm{Q}_{4}$. No current is available via $\mathrm{Q}_{2}$ for $\mathrm{Q}_{3}$ 's base, and so $\mathrm{Q}_{3}$ turns off. The output thus increases to +5 volts, i.e. logic 1 . Diode $\mathrm{D}_{1}$ is included to establish the correct bias conditions for $\mathrm{Q}_{4}$. The output stage, consisting of $\mathrm{Q}_{3}, \mathrm{D}_{1}, \mathrm{Q}_{4}$, and R , acts as a power amplifier and is often termed a totempole output. The output stage has the property of providing a low-impedance drive for both positive and negative signals. It provides a good fan-out but cannot be connected to other TLL outputs as can open-collector outputs.
- TTL is the most commonly used technology for SSI and MSI devices due to its low cost, high speed, and ready availability.
- ![[Screenshot 2025-03-26 at 12.42.00 AM.png]]
- TTL. NAND gate
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]