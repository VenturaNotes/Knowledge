## Synthesis
- 
## Source [^1]
- A signal representation used in distributed circuits and transmission lines. In such a circuit or network, the voltage and current vary spatially, therefore the indicated impedance also varies with the location of the measurement. To allow an understanding and analysis of the signal flow in the circuit, the signals are represented by power waves, which describe the incident and reflected signals in the transmission line. Given a simple transmission line circuit (see diagram) of characteristic impedance $Z_{0}$, with $V_{\mathrm{i}}$ and $V_{\mathrm{r}}$ as the incident and reflected voltages at the load,
	- incident power $P_{\mathrm{i}} = |V_{\mathrm{i}}|^{2} / Z_{0}$
	- reflected power $P_{\mathrm{r}} = |V_{\mathrm{r}}|^{2} / Z_{0}$
	- power delivered to load $P_{\mathrm{L}} = (|V_{\mathrm{i}}|^{2} - |V_{\mathrm{r}}|^{2}) / Z_{0}$
	- load reflection coefficient $\Gamma = (Z_{\mathrm{L}} - Z_{0}) / (Z_{\mathrm{L}} + Z_{0})$
- If this circuit is viewed in terms of power flow, then if the power available from the source is given by$$P _ {\mathrm {A}} = | \boldsymbol {a} | ^ {2}$$and the power delivered to the load is$$P _ {\mathrm {L}} = \left| \boldsymbol {a} \right| ^ {2} - \left| \boldsymbol {b} \right| ^ {2}$$then $|\pmb{b}|^2$ can be thought of as the power that is reflected, or scattered by the load. It then follows that$$a = \frac{(V + Z_{0}I)}{(2\sqrt{Z_{0}})} \text{ and } b = \frac{(V - Z_{0}I)}{(2\sqrt{Z_{0}})}$$are the incident and reflected power waves, respectively. They have dimensions of $\sqrt{\text{power}}$. See also SCATTERING PARAMETERS.
- ![[Pasted image 20260406190729.png|500]]
	- Power waves: transmission line connecting load to source
	- Parts
		- transmission line, characteristic impedence $Z_0$
			- #question Why do the diagrams keep misspelling `impedance`?
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]