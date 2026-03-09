## Synthesis
- 
## Source [^1]
- The degree of interdependence between software modules, a measure of how closely connected two routines or modules are, and the strength of the relationships between modules
- Coupling is not binary but multi-dimensional
	- #question I wonder if this is true for all forms of coupling?
## Source[^2]
- A measure of the strength of interconnections between modules of a program. A high coupling would indicate strong dependencies between one module and another. Loose coupling allows greater flexibility in the design and better traceability, isolation, and correction of faults. The strength of coupling depends on the number of references of one module by another, the amount of data passed (or shared) between modules, the complexity of the interface between modules, and the amount of control exercised by one module over another. Completely decoupled modules have no common data and no control flow interaction. See also COHESION, COUPLED.
## Source[^3]
- The interaction between two circuits so that energy is transferred from one to the other. In common-impedance coupling there is an impedance common to both circuits (Figs. $a, b$).
- ![[Screenshot 2026-03-09 at 7.00.43 AM.png|400]]
	- (a) Capacitive coupling
- ![[Screenshot 2026-03-09 at 7.01.02 AM.png|400]]
	- (b) Inductive coupling
- The impedance may be a capacitance (capacitive coupling), a capacitance and a resistance (resistance-capacitance coupling), an inductance (inductive coupling), or a resistance (direct coupling). The impedance may be a part of each circuit or connected between the circuits. In mutual-inductance coupling the circuits are coupled by the mutual inductance, $M$, between the coils $\mathrm{L}_1$ and $\mathrm{L}_2$ (Fig. c). The coils used are often those of a transformer. The use of two separate coils between amplifier stages rather than a transformer is termed choke coupling. Mixed coupling is a combination of mutual-inductance coupling and common-impedance coupling.
- The coupling coefficient, $K$ , is defined as$$K = \frac {X _ {\mathrm {m}}}{\sqrt {\left(X _ {1} X _ {2}\right)}}$$where $X_{\mathrm{m}}$ is the reactance common to both circuits and $X_{1}$ and $X_{2}$ are the total reactances, of the same type as $X_{\mathrm{m}}$ , of the two circuits. For Fig. a:$$K = \frac {L _ {\mathrm {m}}}{\sqrt {\left[ \left(L _ {1} + L _ {\mathrm {m}}\right) \left(L _ {2} + L _ {\mathrm {m}}\right) \right]}}$$
- For Fig. b:$$K = - \frac {C _ {\mathrm {m}}}{\sqrt {\left[ \left(C _ {1} + C _ {\mathrm {m}}\right) \left(C _ {2} + C _ {\mathrm {m}}\right) \right]}}$$
- For Fig. c:$$K = \frac {M}{\sqrt {\left(L _ {1} L _ {2}\right)}}$$
- ![[Screenshot 2026-03-09 at 7.06.10 AM.png|300]]
	- (c) Mutual-inductance coupling
- The current in the secondary circuit depends on the degree of coupling and the frequency. Critical coupling occurs when $KQ = 1$ , where $Q$ is the Q factor of the circuit. A single peak occurs at the resonant frequency of the circuit and the current has its optimum value. Overcoupling occurs when $K > 1/Q;$ the current has two side peaks with a dip at the resonant frequency. Undercoupling, when $K < 1/Q$ , produces a smaller central peak than the optimum.
- Band-pass filters often employ overcoupling, in order to pass a narrow band of frequencies, followed by undercoupling, to compensate for the central dip. In a tuned circuit, the bandwidth passed varies with frequency. This may be overcome by employing mixed coupling using a capacitance with the mutual inductance to give a constant bandwidth for a range of frequencies.
- Cross coupling is unwanted coupling between communication channels, circuits, or components, particularly those with a common power supply. The removal of unwanted signals, especially those due to cross coupling, is called decoupling. It is usually achieved using a series inductance or a shunt capacitor.
## References

[^1]: https://en.wikipedia.org/wiki/Coupling_(computer_programming)#:~:text=In%20software%20engineering%2C%20coupling%20is,not%20binary%20but%20multi%2Ddimensional.
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^3]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]