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
## Source[^2]
- (TTL) A family of high-speed integrated logic circuits in which the input is through a multiple-emitter bipolar junction transistor; usually the output stage is push-pull. Diode-transistor logic operates in a similar manner but the input is through a number of diodes. A typical circuit (a three input NAND circuit) is shown in Fig. a. If the input levels are all high, the emitter-base junctions of the input transistor $\mathrm{T}_{1}$ will all be reverse biased: current through the base will flow across the forward-biased collector junction to the phase-splitting transistor $\mathrm{T}_{2}$ , which will switch on. Current flows through $\mathrm{T}_{2}$ to $\mathrm{T}_{4}$ and turns on $\mathrm{T}_{4}$. $\mathrm{T}_{3}$ will remain off as current is shunted away from the base and the output voltage will be low. If any one or more of the inputs is low, the emitter-base junction of $\mathrm{T}_{1}$ will be forward biased and current flows out of the base through the emitter of $\mathrm{T}_{1}$ . The current is therefore diverted away from $\mathrm{T}_{2}$ , and $\mathrm{T}_{2}$ and $\mathrm{T}_{4}$ will be turned off. The current through $\mathrm{R}_{2}$ flows into the base of $\mathrm{T}_{3}$ and $\mathrm{T}_{3}$ is switched on and the output voltage is high. The output voltage will change rapidly when the input conditions change since the transistors drive the level in both directions.
- ![[Pasted image 20260511023140.png|400]]
	- (a) Transistor-transistor logic 3-input NAND circuit
		- Output
	- (b) Schottky transistor-transistor logic 
		- Schottky diode
	- (c) Low-voltage transistor-transistor logic
	- Key
		- Current flows with all inputs high
		- Current flows with any inputs low
- The biggest limitation in speed is caused by the delay time due to hole storage in the saturated output transistor $\mathrm{T}_{4}$ . The speed may be improved by adding a Schottky diode with low diode forward voltage across the base-collector junction of $\mathrm{T}_{4}$ . This circuit is called Schottky TTL and part of the circuit is shown in Fig. b. This diode prevents $\mathrm{T}_{4}$ saturating.
- Hole storage therefore does not occur in the collector-base junction and since it does not occur in Schottky diodes, $\mathrm{T}_{4}$ will be turned off very rapidly when the base current is cut off.
- TTL circuits based around a standard power voltage of $5\mathrm{V}$ were the most widely used form of TTL for digital circuit design, particularly in medium-scale integration (MSI) circuits, and for the glue logic that connected microprocessors to memory and input/output devices. Simplified low-voltage versions of TTL that are more suitable for large-scale integration (LSI) have also been produced. One such circuit is shown in Fig. c. Schottky diodes clamp the base-collector voltages across $\mathrm{T}_{1}$ and $\mathrm{T}_{2}$ and control the level of saturation. $\mathbf{R}_2$ is an additional resistor that allows the gate to operate from a supply voltage less than or equal to 1.5 volts.
- TTL is also characterized by medium power dissipation and fan-out and good immunity to noise. TTL circuits may have high operating speeds but at the expense of power dissipation, since the higher the speed the greater the power consumed. They are also medium-scale integration (MSI) circuits. They are therefore not suitable for applications where low power dissipation and large functional packing density is required. MOS logic circuits are usually the circuits of choice for such applications but they operate at much lower speeds. CMOS circuits, in particular, have very low power dissipation and CMOS versions of TTL gates have been produced. More recently, CMOS has effectively supplanted TTL for most digital circuit applications.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]