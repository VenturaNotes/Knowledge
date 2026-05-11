## Synthesis
- 
## Source [^1]
- (vacuum tube) A multielectrode evacuated electron tube that contains a thermionic cathode as the source of electrons. Thermionic valves containing three or more electrodes are capable of voltage amplification: the current that flows through the valve between two electrodes, usually the anode and the cathode, is modulated by a voltage applied to one or more of the other electrodes. Thermionic valves have rectifying characteristics, i.e. current will flow in one direction only (the forward direction) when positive potential is applied to the anode.
- The simplest type of thermionic valve is the diode, which has been most often used in rectifying circuits. Electrons are released from the cathode by thermionic emission. Under zero-bias conditions electrons released by the cathode form a space charge region in the vacuum surrounding the cathode and exist in dynamic equilibrium with the electrons being emitted. If a positive potential is applied to the anode, electrons are attracted across the tube to the anode and a current flows. The maximum available current, the saturation current, is given by$$I _ {\mathrm {s a t}} = A T ^ {2} \exp \left(- \frac {B}{T}\right)$$where $A$ and $B$ are constants and $T$ is the thermodynamic temperature of the cathode. The current does not rise rapidly to the saturation value as the anode voltage is increased but is limited by the mutual repulsion of electrons in the interelectrode region. This is the space-charge limited region of the characteristic and the current obeys Child's law approximately where Child's law is given by$$I = K V _ {\mathrm {a}} ^ {\frac {3}{2}}$$where $V_{a}$ is the anode voltage and $K$ is a constant determined by the device geometry. Increasing the temperature of the cathode has very little effect on the current in this region of the characteristic curve and temperature saturation is said to occur. The motion of the electrons may be affected by the magnetic field associated with the current flowing in the heater and the electrons will be deflected from a linear path. This effect is the magnetron effect and it contributes to the delay in reaching the saturation current.
- Under conditions of reverse bias (see REVERSE DIRECTION) no current flows in the valve until the field across the valve is sufficient to cause field emission from the anode or arc formation; breakdown of the device will then occur. The characteristics of a simple diode (Fig. a) can be compared with the characteristics of a simple p-n junction diode (Fig. b), which is the solid-state analogue of the device.
- ![[Pasted image 20260510223715.png|400]]
	- (a) Characteristic of a valve diode
		- Arc formation
		- Saturation current
		- Space charge limited region $I \propto V^{3/2}$ 
	- (b) Characteristic of p-n junction diode
		- Avalanche breakdown
		- Reverse saturation current
		- $I \propto e^{V/B}$ 
- The diode characteristic can be modified by interposing extra electrodes, called grids since they are usually in the form of a wire mesh, between the anode and the cathode of a valve. The simplest such valve is the triode with only one extra electrode, a control grid. Application of a voltage to the grid affects the electric field at the cathode and hence the current flowing in the valve. A family of characteristics is generated for different values of grid voltage, similar in shape to the diode characteristic. The anode current at a given value of anode voltage is a function of grid voltage and amplification may be achieved by feeding a varying voltage to the grid; comparatively small changes of grid voltage cause large changes in the anode current. In normal operation the grid is held at a negative potential and therefore no current flows in the grid since no electrons are collected by it. Anode and transfer characteristics of a triode are shown in Figs. c and d. Triodes have been extensively used in amplifying and oscillatory circuits.
- ![[Pasted image 20260510224416.png|400]]
	- (c) Anode characteristics of a triode
	- (d) Transfer characteristics of a triode
- A disadvantage of the triode is the large grid-anode capacitance, which allows a.c. transmission, and extra electrodes have been added to reduce this effect. Such valves are called screen grid valves, the simplest of which are the tetrode and pentode. The tetrode has one extra grid electrode, the screen grid, placed between the control grid and the anode and held at a fixed positive potential. Some electrons will be collected by the screen grid, the number of electrons being a function of anode voltage. At high anode voltages the majority of electrons pass through the screen grid to the anode. An undesirable kink in the characteristics is therefore observed in a tetrode due to secondary emission of electrons from the anode, these secondary electrons being collected by the screen grid (Fig. e). Secondary electrons are prevented from reaching the screen grid in the pentode by introducing another grid, the suppressor grid, between the screen and the anode and maintaining it at a fixed negative potential, usually cathode potential. This eliminates the kink of the characteristic of the tetrode. The pentode characteristics (Fig. f) are similar to those observed in field-effect transistors, which are the solid-state analogues.
- ![[Pasted image 20260510224453.png|400]]
	- (e) Characteristic of a typical tetrode
		- Anode current
		- Screen current
		- $I_A + I_S$ 
	- (f) Characteristic of a pentode
		- $V_{G2}V_{G3}$ constant
		- $V_{G_1}$ 
- Thermionic valves with even more electrodes have been designed to produce particular characteristics. Multipurpose valves, such as the diode-triode, have an arrangement of electrodes so that the functions of several simpler valves are combined in a single envelope.
- In everyday applications, such as amplification, thermionic valves have been almost completely replaced by their solid-state equivalents. In applications requiring high voltages and currents valves are still used but these are usually special-purpose valves as with the cathode-ray tube, magnetron, and klystron. For most applications solid-state devices, such as the p-n junction diode, bipolar junction transistor, and field-effect transistor, frequently in the form of integrated circuits, have the advantages of small physical size, cheapness, robustness, and safety as the power required is very much less than for valves.
- https://www.electronics-notes.com/articles/history/vacuum-tube-thermionic-valve/history.php
	- A history of the thermionic valve
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]