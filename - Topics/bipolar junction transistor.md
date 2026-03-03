## Synthesis
- 
## Source [^1]
- (BJT) One of the two major classes of transistor. It is a semiconductor device that consists of two p-n junctions back-to-back in close proximity to each other, with one of the regions common to both junctions. This forms either a p-n-p or n-p-n transistor. The three regions in the transistor are called emitter, base, and collector, as shown in Fig. a.
- ![[Screenshot 2026-03-03 at 5.22.45 AM.png|400]]
	- (a) Schematic of a BJT showing principal regions, and circuit symbol
	- Parts
		- Emitter
		- Base
		- Collector
		- Symbol
- In normal or forward active operation of a BJT, the base-emitter p-n junction is forward biased and the base-collector junction is reverse biased. Majority-carrier current flows across the forward-biased emitter-base junction. The emitter is much more heavily doped than the base region, so that most of the total current flow across the base-emitter junction consists of majority carriers from the emitter injected into the base. These injected carriers become minority carriers in the base region, and will tend to recombine. The recombination is minimized by making the base region very narrow, so that the injected carriers can diffuse across the base to the reverse-biased base-collector junction, where they are swept across the junction into the collector, to appear in the outside circuit as the collector current. The magnitude of the collector current, $I_{\mathrm{C}}$ , depends on the number of majority carriers injected into the base from the emitter, and thus current is controlled by the base-emitter p-n junction voltage. The output (collector) current is therefore controlled by the input (base-emitter) voltage $V_{\mathrm{BE}}$ : the output circuit of the transistor can be modeled as a voltage-controlled current source (see DEPENDENT SOURCES). The input circuit looks like a p-n junction diode.
- In principle, the transistor can be operated in the reverse active mode by reversing the connections. But in fact the transistor is not completely symmetrical in practice: the emitter is very heavily doped to maximize emitter injection, and the collector is relatively lightly doped so that it can accommodate large voltage swings across its reverse-biased junction. While the electrical characteristics are similar in appearance, the forward characteristics show much greater gain, as expected.
- If both junctions are reverse biased, the transistor behaves like an open switch, with only the p-n junction reverse leakage currents flowing. If both junctions are forward biased, there is injection of carriers into the base region from both sides, and a low resistance is presented to current flow in either direction: the transistor behaves like a closed switch, and the base stores the injected charge.
- The electrical characteristics of a bipolar junction transistor are illustrated in Fig. $b$ , for the common emitter connection, showing the regions of operation.
- ![[Screenshot 2026-03-03 at 5.23.57 AM.png|400]]
	- (b) BJT electrical characteristics (common emitter)
	- Parts
		- Input characteristic
		- Output characteristic
		- Forward active
		- Saturation
		- Increasing base current or $V_{BE}$
		- reverse active
		- cut-off
- The bipolar junction transistor can be used to provide linear voltage and current amplification: small variations of the base-emitter voltage and hence the base current at the input terminal result in large variations of the output collector current. Since the transistor output has the appearance of a current source, the collector can drive a load resistance and develop an output voltage across this resistance (within the limits of the supply voltage). The transistor can also be used as a switch in digital logic and power switching applications, switching from a high-impedance 'off' state in cut-off, to a low-impedance 'on' state in saturation. In practice, full saturation conditions of base-collector forward biased are generally avoided, to limit the carrier storage in the base and reduce the switching time.
- Bipolar junction transistors find application in analogue and digital circuits and integrated circuits, at all frequencies from audio to radio frequency; heterojunction bipolar transistors are used for higher frequencies such as microwave applications.
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]