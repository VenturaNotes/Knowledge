## Synthesis
- 
## Source [^1]
- A logic circuit constructed in a MOS integrated circuit. It consists of a combination of MOSFETs in series or in parallel that perform the logic functions, i.e. act as AND or OR gates, etc. (Fig. a), coupled to other MOSFETs that determine the output voltages of the circuit. MOS logic circuits are classified according to the method of determining the output voltage, i.e. into ratio or ratioless circuits. The logic gates effectively act as switches when used with a suitable choice of high and low logic levels. When the required input conditions are fulfilled the combination switch is 'on' and provides a conducting path. If the switch is 'off' the gate does not conduct. The high logic level is chosen to be greater than the threshold voltage, $V_{\mathrm{T}}$ , of the MOSFET; the low level is lower.
- ![[Pasted image 20260404012208.png|400]]
	- (a) MOS logic circuits
	- Parts
		- OR function
		- AND function
- In a ratio circuit the logic gate, represented as a single switch transistor, $\mathrm{T}_{\mathrm{S}}$ , is connected in series with a load transistor $\mathrm{T}_{\mathrm{L}}$. The drain of the load transistor is connected to the power supply and the source of the switch transistor to earth (Fig. b). The output is taken from the node, A, between the transistors. The circuit will usually be driving similar MOS logic gates. These have a very high input impedance. A voltage of magnitude greater than or equal to the drain voltage, $V_{\mathrm{DD}}$, is applied to the gate of $\mathrm{T}_{\mathrm{L}}$ . In static operation the voltage is applied continuously; in dynamic operation the voltage is applied on the application of a clock pulse in order to reduce dissipation.
- ![[Pasted image 20260404012403.png|400]]
	- (b) Ratio circuit
	- Parts
		- Input
		- Output
- A low logic level input to the gate of the switch transistor $\mathrm{T}_{\mathrm{S}}$ results in $\mathrm{T}_{\mathrm{S}}$ being 'off'; $\mathrm{C}_{\mathrm{L}}$ is then charged by $\mathrm{T}_{\mathrm{L}}$ until the output voltage, $V_{\mathrm{A}}$ , reaches a value sufficient to cause $\mathrm{T}_{\mathrm{L}}$ to turn off, i.e. until $V_{\mathrm{A}}$ reaches $(V_{\mathrm{GG}} - V_{\mathrm{T}})$ or $V_{\mathrm{DD}}$ , whichever is lower. Application of a high logic level to the gate of $\mathrm{T}_{\mathrm{S}}$ causes $\mathrm{T}_{\mathrm{S}}$ to be 'on' and $\mathrm{C}_{\mathrm{L}}$ discharges through $\mathrm{T}_{\mathrm{S}}$ . The output voltage $V_{\mathrm{A}}$ falls to a level determined by the relative impedances of the two transistors.
- It can be shown that the voltage $V_{\mathrm{A}}$ at the node depends on the ratio of the aspect ratios of the devices, and these are manufactured to ensure an output voltage suitable for a low logic level, i.e. less than the threshold voltage of the following gate. The circuit provides inversion of the logic function; thus an AND function in $T_{\mathrm{S}}$ provides a NAND output, etc.
- If the dynamic version of the circuit (with the gate voltage of the load transistor clocked) is used a minimum rate of clocking must be specified to prevent loss of information at the output due to leakage paths causing the charge on the load capacitor to decay.
- In a ratioless circuit (Fig. c) a second load transistor, $\mathrm{T}_2$ , is connected in series between the first load transistor $\mathrm{T}_1$ and the logic gate, represented by a single switch transistor $\mathrm{T}_S$ ; the output voltage $V_{\mathrm{B}}$ is taken from the node, B, between $\mathrm{T}_1$ and $\mathrm{T}_2$. A clocking system is employed, usually a four-phase system, to apply a bias to the gates of the load transistors $\mathrm{T}_1$ and $\mathrm{T}_2$ in turn. During phase one $(\phi_1)$ bias is applied to the gate of $\mathrm{T}_1$ , $\mathrm{T}_1$ is turned on, and the load capacitor $C_L$ (usually the gate of the switch transistor of the following stage) is charged to $(V_{\mathrm{GG}} - V_{\mathrm{T}})$ . During phase two $(\phi_2)$ bias is applied not to $\mathrm{T}_1$ but to the gate of $\mathrm{T}_2$. If a high logic level is applied to $\mathrm{T}_S$ at this time, both $\mathrm{T}_2$ and $\mathrm{T}_S$ will be turned on, $C_L$ will discharge through them, and the output voltage $V_{\mathrm{B}}$ will fall to the low logic level. If $\mathrm{T}_S$ is not turned on, i.e., a low logic level is applied to the gate of $\mathrm{T}_S$ during $\phi_2$ , $C_L$ will not discharge since no conducting path to earth exists and $V_{\mathrm{B}}$ will remain at the high logic level. The output of the circuit is sampled by the following circuit during phases $\phi_3$ and $\phi_4$; information may thus only be supplied to $\mathrm{T}_S$ once in every four clock phases.
- ![[Pasted image 20260404012743.png|400]]
	- (c) Ratioless circuit
	- Parts
		- Input: during $\upvarphi_2$
		- Output: sampled during $\upvarphi_3$ 
- Operation of this circuit does not depend on the impedances of the devices and it is therefore termed ratioless. Power dissipation is very low since no conducting path ever exists directly between the power supply and earth and the circuits depend solely on charge storage in the load capacitance. The circuit is inverting and two gates are frequently combined to provide a noninverting circuit. If used in a dynamic shift register, for example, six transistors are needed for each bit of information.
- A CMOS logic circuit uses complementary MOS transistors to provide the basic logic functions. The basic NAND gate is shown in Fig. d. CMOS circuits have the advantage that the power required is extremely low and they are suitable for applications where very little power consumption is a condition. They have a lower packing density than ratio circuits since every transistor requires its complement and therefore isolation of p-channel devices from n-channel devices is required. For convenience, groups of n-channel devices (and p-channel devices) are formed in the same area of the chip. The speed of operation is relatively slow, compared to transistor-transistor logic, because of the relatively large bulk capacitance of the substrate. CMOS circuits are however very resistant to stray noise pulses. Faster versions of CMOS circuits have been designed; the fastest version is the silicon-on-sapphire type of circuit (see SILICON-ON-INSULATOR).
- ![[Pasted image 20260404012935.png|600]]
	- (d) CMOS NAND gate
	- Parts
		- +ve bus
		- p-channel devices
		- output
		- n-channel devices
		- -ve bus
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]