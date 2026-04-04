## Synthesis
- 
## Source [^1]
- (magnetron oscillator) A crossed-field microwave tube that produces radiofrequency (r.f.) oscillations in the microwave region. An early magnetron was used as a rectifier but all modern magnetrons are designed as oscillators.
- The basic magnetron consists of a central cylindrical cathode surrounded by a cylindrical anode containing several cavity resonators (Fig. a). A steady electrostatic field is applied between the anode and cathode. A steady magnetic flux density is applied parallel to the cylindrical axis and orthogonal to the electrostatic field. The magnetic flux is usually provided by a permanent magnet or sometimes by an electromagnet. Electrons, emitted from the cathode, move under the influence of these two fields. The interaction of the electrons with the gaps or the resonant cavities of the anode produces radiofrequency oscillations. These oscillations are output through a coupled waveguide or coaxial line.
- ![[Pasted image 20260403222243.png|300]]
	- (a) Resonant-cavity magnetron
	- Parts
		- Cathode
		- Anode
		- Microwave output waveguide or coaxial line coupling
- As the electrons leave the cathode of a magnetron they are accelerated towards the anode by the electrostatic field. In the absence of a magnetic field, described by a magnetic flux density, they travel radially towards the anode. When a magnetic field is applied it exerts a Lorentz force on them perpendicular to their direction of motion and proportional to the velocity; this causes them to follow a cycloidal path. The distance that an electron can travel towards the anode is a function of the anode voltage, $V$, and the magnetic flux density $\mathbf{B}$.
- ![[Pasted image 20260403222442.png|600]]
	- (b) Effect of magnetic field on electrons in magnetron
	- Parts
		- No field
		- Weak field
		- Critical field
		- Strong field
- For a given value of anode voltage, the critical field is that value of B at which an electron just fails to reach the anode and returns to the cathode with zero kinetic energy. The critical voltage is the maximum anode voltage, in the presence of a fixed magnetic flux density, at which an electron just fails to reach the anode. The effect of an increasing magnetic field with fixed anode voltage is shown in Fig. b. Under the strong field condition, when the value of B exceeds the critical field, an electron gains kinetic energy; it returns to the cathode with a nonzero velocity following a cycloidal path of relatively small radius. The effect of the strong field is thus to produce a narrow sheath of electrons rotating about the cathode with an angular velocity $\omega$. If the radii of the anode and cathode are $b$ and $a$ respectively, then provided that $(b - a)$ is small compared to both $b$ and $a$ it can be shown that $$\omega = \frac{2V}{[\mathbf{B}(b^2-a^2)]}$$
- The rotating sheath of electrons interacts with the resonant cavities or gaps in the anode structure to produce r.f. oscillations in them; the r.f. oscillations in turn interact with the electrons in a complex manner: the electrons are either accelerated by the r.f. field and turned back to the cathode or are decelerated by it and travel to the anode giving up energy to the r.f. field as they do so (Fig. c). On average the net power gained by the r.f. fields when an electron loses kinetic energy is greater than that required to return one to the cathode; r.f. oscillations are therefore sustained by the system. The closed nature of the circuit effectively supplies the positive feedback required for the oscillations to occur.
- ![[Pasted image 20260403222710.png|500]]
	- (c) Electron paths in the radiofrequency field
	- Parts
		- Electron sheath
		- Anode
		- r. f. field lines
		- Electrons
		- Cathode
- There are various possible modes of operation depending on the geometrical structure of the anode, the magnitudes of the fields, and the phase differences of the r.f. fields between successive cavities. For a particular design of anode the magnitudes of $V$ and $B$ must be adjusted so that the angular velocity of the electrons is synchronized with the alternation of the r.f. fields in the cavities so as to produce the optimum transfer of energy. When properly adjusted, an efficiency of about $70\%$ is possible with $\pi$-mode operation; this is the simplest and most efficient mode of operation in which the phase difference between successive cavities is $\pi$. The electrons are retarded by several successive cavities when the proper phase relationship is maintained and travel towards the anode in 'spokes'.
- Suitable design of the anode of a magnetron allows either standing waves or traveling waves to be output from the device. A traveling-wave magnetron has several possible modes of oscillation. The performance of a standing-wave magnetron is usually shown on a Rieke diagram.
- Excessive heating of the anode by incident electrons is avoided by constructing it from a material, such as copper, that has good thermal conductivity. Electrons returning to the cathode produce back heating; this reduces the heater current required when the tube is running and also stimulates secondary emission of electrons, which provides a significant proportion of the total cathode emission.
- Large power outputs are possible by running the tube in short pulses (pulsed magnetrons) rather than continuously; this gives an improvement of output power of up to 1000. A typical medium high power magnetron, pulsed for one microsecond at a repetition rate of 1000 hertz, can produce 0.1 mm wavelength waves with a power output during the pulse of 750 kilowatts. It requires an anode voltage of 31 kilovolts and magnetic flux density of 0.28 tesla.
- Most magnetrons are fixed-frequency magnetrons but tunable magnetrons have been produced in which a variation of 10–20% in the frequency is achieved by means of plungers moved into the resonators from one end.
- http://www.explainthatstuff.com/how-magnetrons-work.html
	- A short introduction to magnetrons
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]