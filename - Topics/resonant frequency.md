---
aliases:
  - Larmor Frequency
---
## Synthesis
- 
## Source [^1]
- (symbols: $\omega_0, f_0$) The frequency at which resonance occurs in a particular circuit or network. Resonance occurs in a circuit containing both capacitance and inductance when the imaginary component of the complex combined impedance of the circuit is zero, i.e. when the supply current and voltage are in phase and the circuit has unit power factor.
- In a series resonant circuit, which contains the capacitive and inductive elements in series (Fig. a), the combined impedance, $Z$ , is given by$$Z = R + \mathrm {j} \omega L - \frac {\mathrm {j}}{\omega C}$$where $R$ is the ohmic resistance, $\omega$ the angular frequency ( $\omega = 2\pi \times \text{frequency}$ ), $L$ the inductance and $C$ the capacitance, and $j$ equals $\sqrt{-1}$ . The resonance condition is fulfilled when$$\omega_ {0} L = \frac {1}{\omega_ {0} C}$$i.e. when$$\omega_ {0} = \frac {1}{\sqrt {(L C)}}$$
- In a series resonant circuit resonance occurs therefore when the combined impedance is purely resistive and is a minimum. The resistance can be low even for large values of $L$ and $C$. In this case the current flowing through the circuit will be high, and although large voltages are developed across the individual elements these are out of phase with each other so that the total voltage developed across the circuit is relatively low; maximum current will then flow in a load resistor, $R_{\mathrm{L}}$, in series with the circuit.
- ![[Pasted image 20260413060233.png|300]]
	- (a) Series resonant circuit and frequency response
- In the case of a parallel resonant circuit, in which the circuit elements are in parallel (Fig. b), it is convenient to consider the combined admittance, $Y$, of the circuit $(Y = Z^{-1})$ , given by$$Y = \mathrm {j} \omega C + \frac {\left(R - \mathrm {j} \omega L\right)}{\left(R ^ {2} + \omega^ {2} L ^ {2}\right)}$$
- The resonance condition is fulfilled when$$R ^ {2} + \omega_ {0} ^ {2} L ^ {2} = \frac {L}{C}$$i.e. when$$\omega_ {0} ^ {2} = \left[ 1 - \left(\frac {R ^ {2} C}{L}\right) \right] \left[ \frac {1}{L C} \right]$$
- Since the term $R^2 C / L$ is usually very small this approximates to$$\omega_ {0} = \frac {1}{\sqrt {(L C)}}$$which is the value of the series resonant frequency; the term however cannot always be neglected.
- In a parallel resonant circuit therefore resonance occurs when the combined admittance is low. At resonance $Z = 1 / Y$ is high and is termed the parallel resistance of the circuit. The overall current is low but the voltage developed across the circuit, and therefore across a load resistor, $R_{\mathrm{L}}$, in parallel with it, is high. The individual currents developed in the inductance and capacitance at resonance can be very large but are out of phase with each other, resulting in the low combined current.
- The above consideration leads to a unique solution for the resonant frequency. The resonant frequency may also be defined as that frequency at which the complex impedance passes through a minimum (in a series resonant circuit) or a maximum (parallel resonant circuit). In the series resonant case the solution is the same as above but in the case of parallel resonance a unique value is not necessarily found. The resonant frequency may have slightly different values that depend on the particular circuit parameter that is varied in order to achieve resonance. The differentials of $Y$ with respect to $C, L$ , or $\omega$ may therefore lead to slightly different resonance conditions.
- ![[Pasted image 20260413060355.png|400]]
	- (b) Parallel resonant circuit
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]