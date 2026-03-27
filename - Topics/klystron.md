## Synthesis
- 
## Source [^1]
- An electron tube that is used as a microwave amplifier or oscillator. It is a linear-beam microwave tube in which velocity modulation is applied to an electron beam in order to produce amplification of a microwave-frequency field.
- Several variations of the basic klystron exist. A simple two-cavity klystron is shown in Fig. a. A beam of high-energy electrons produced from an electron gun is passed through a cavity resonator excited by high-frequency radiowaves. The interaction between the high-frequency waves and the electron beam produces velocity modulation of the beam. The modulated beam leaving the cavity resonator (the buncher) traverses a field-free region (the drift space) where bunching occurs as the faster electrons catch up with the slower ones. The periodic current-density variations in the beam due to the formation of the bunches are of the same frequency as the exciting radiowaves. The beam then passes through a second cavity resonator (the catcher) placed at a distance $x$ away, where the current-density variations produce a voltage wave in the catcher, which is tuned to the exciting frequency or a harmonic of it.
- The magnitude of the output waves depends on the velocity of the electrons; the phase is such that the negative maximum corresponds to the centre of the bunch. Most of the energy of the beam is given to the catcher since many more electrons are retarded by the induced field than are accelerated by it. Voltage amplification is obtained by conversion of the d.c. energy of the original beam into radiofrequency energy in the output circuit.
- ![[Pasted image 20260327135137.png|400]]
	- (a) Two-cavity klystron amplifier
	- Parts
		- Electron gun
		- Input cavity (buncher)
		- Drift Space
		- Output cavity (catcher)
		- Input
		- Load
		- Electron beam
		- Collector
		- Waveguide coupling
- It can be shown that the optimum condition for power extraction from the beam occurs when$$\omega t = 2\pi (n  \frac 34)$$where $\omega$ is the angular frequency, $t$ the transit time between the two resonators, and $n$ is an integer known as the mode number. Since $t = x / \nu_0$, where $\nu_0$ is the initial electron velocity, the transit time may be altered by adjusting the voltage of the electron gun. A collector electrode is used to collect that part of the electron beam leaving the second cavity. Two-cavity klystrons can be made to oscillate if positive feedback to the input cavity is employed.
- The most important type of klystron is the reflex klystron, used as a low-power oscillator. This type of klystron has only one cavity, which acts as both buncher and catcher (Fig. b). Velocity modulation of the electron beam is caused by the input radiofrequency wave in the cavity, and the modulated beam leaving the cavity is reflected back by a reflector electrode. Bunching occurs because the faster electrons travel further towards the reflector before reversing their direction of travel than do the slower ones. The bunches of electrons returning to the cavity that experience the maximum positive field give up the most energy since the direction of motion is now reversed.
- ![[Pasted image 20260327135643.png|400]]
	- (b) Reflex klystron
	- Parts
		- Electron gun
		- Collector
		- Input
		- Load
		- Electron beam
		- Cavity
		- Reflector
- As with the two-cavity klystron, optimum power transfer occurs when the transit time $t$ of the electrons from and to the resonator is given by$$\omega t = 2 \pi (n + \frac{3}{4})$$The klystron will only resonate around certain discrete values of the collector voltage, corresponding to the integers $n = 1, 2, 3$, etc. Oscillation is still possible for small excursions of collector voltage around these values, so that the reflex klystron is useful for providing automatic frequency control or in frequency-modulation transmission. This latter application requires a higher power output (up to about 10 watts) than for the more common low-power local-oscillator applications, where a typical power output of 10 milliwatts is needed.
- Multicavity klystrons are used when either extremely high power pulses are required, as in the power source for a particle accelerator, or when continuous waves of moderate power are needed, as in UHF television transmitters. Three or more resonant cavities coupled to the electron beam are used to provide a high overall gain. The velocity-modulated beam leaving the first cavity interacts with the second and subsequent cavities in such a way that the induced amplified voltage in each cavity remodulates the beam received from the preceding cavity so that the beam becomes more strongly bunched and eventually excites a highly amplified wave in the output circuit.
- The mutual electrostatic repulsion of the electrons tends to cause debunching of the beam, particularly when very strong bunching is required. This limits the output of the device. Magnetic focusing may be used to minimize debunching.
- https://www.youtube.com/watch?v=Fvud81pYGOg
	- An old (1960s) educational film on klystron amplifiers
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]