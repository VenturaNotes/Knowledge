## Synthesis
- 
## Source [^1]
- An electronic circuit that switches back and forth between states. Oscillators are mainly used to provide clock signals or a frequency reference, in which applications they are normally crystal controlled. A specialized form is the VCO (voltage controlled oscillator) in which the frequency may be modified within limits by a control voltage, the free-running frequency being determined by external components.
## Source[^2]
- A circuit that converts direct-current power into alternating-current power at a frequency that is usually greater than can be achieved by rotating electromechanical alternating-current generators. Application of the direct-voltage supply to the circuit is usually sufficient to cause it to oscillate and for the oscillations to be maintained until the direct voltage is switched off.
- There are two broad categories of oscillator: harmonic oscillators generate essentially sinusoidal waveforms and contain one or more active circuit elements continuously supplying power to the passive components; relaxation oscillators are characterized by nonsinusoidal waveforms, such as sawtooth waveforms, and the switched exchange of electrical energy between the active and passive circuit elements.
- A simple harmonic oscillator consists essentially of a frequency-determining device, such as a resonant circuit, and an active element that supplies direct power to the resonant circuit and also compensates for damping due to resistive losses. In the case of a simple L-C circuit, application of a direct voltage causes free oscillations in the circuit that decay because of the inevitable resistance in the circuit (see DAMPED). In the absence of the resistance no damping would occur and the free oscillations would continue at a constant amplitude until the direct voltage was removed. The active element in an oscillator can be considered as supplying a negative resistance of sufficient value to compensate for the positive resistance; consequently the complete oscillator contains effectively zero resistance and when shocked will oscillate continuously.
- The effective negative resistance is provided either by a device, such as a unijunction transistor, that exhibits a negative-resistance portion of its characteristic or by employing positive feedback of power in order to overcome the damping. Any particular oscillator may be studied from the negative-resistance approach or from a feedback approach. In the latter case internal positive feedback is considered to be present in the negative-resistance device. Usually negative-resistance oscillators are those that contain a device such as a unijunction transistor or tunnel diode (Fig. a), operated in the negative-resistance portion of the characteristic determined by the applied voltage, $V_{\mathrm{A}}$, and external source resistance, $R_{\mathrm{s}}$.
- ![[Pasted image 20260404041809.png]]
	- (a) Negative-resistance oscillator
	- Parts
		- Tunnel-diode oscillator
			- Resonant elements
		- Equivalent circuit
- Feedback oscillators are those that employ external positive feedback. An inherent phase shift of $180^{\circ}$ occurs between the base and collector of the common-emitter connection shown in Fig. b. Various types of feedback circuit are used in order to provide the necessary counterbalancing phase-shift. Transformer coupling is shown in the diagram; the resonant circuit is formed by the transformer primary L and the capacitor C.
- ![[Pasted image 20260404041927.png|200]]
	- (b) Common-emitter oscillator with transformer feedback
- The frequency-determining device may consist of a component, such as a piezoelectric or magnetostrictive crystal, that converts mechanical stress into electrical impulses; alternatively such a device may be coupled to the resonant circuit to prevent frequency drift. Colpitt's oscillator and the phase-shift oscillator are shown in Figs. c and d.
- ![[Pasted image 20260404042005.png|400]]
	- (c) Colpitt's oscillator: common emitter (d) Phase-shift oscillator
- http://electronics.howstuffworks.com/oscillator.htm
	- An introduction to oscillators, on the `howstuffworks` website
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]