## Synthesis
- 
## Source [^1]
- (IM) The mixing of different frequency components of a signal in a nonlinear component or active device in a circuit, producing unwanted frequency components. If two frequencies $f_{1}$ and $f_{2}$ are applied to a nonlinear element, then a number of new frequency tones will be generated, as shown in Fig. a. These new frequency components are called intermodulation products, and are distortions of the original signals. The IM products are described in terms of their order: for example, 3rd order means all 3-fold combinations of the two mixing frequencies, i.e. $3f_{\mathrm{x}}$ and $2f_{\mathrm{x}} \pm f_{\mathrm{y}}$ . An nth-order nonlinearity will produce nth and lower-order products.
- ![[Pasted image 20260327112420.png|400]]
	- (a) Spectrum of intermodulation products up to 3rd order
		- Signal vs frequency
- ![[Pasted image 20260327112444.png|400]]
	- (b) Determination of the nth-order intercept point
	- Parts
		- Output nth-order intercept point
		- Desired linear signal
		- nth-order IM products
		- input nth-order intercept point
- The nth-order intercept point represents a fictitious signal amplitude where the extrapolated values of the magnitudes of the desired input signal and the unwanted nth-order distortion components are equal. The nth-order intercept point is written $\mathrm{IP}_{\mathrm{n}}$ and measured in terms of power. The definition of intercept point is illustrated in Fig. b. The distortion products increase by $n$ dB in amplitude for every 1 dB increase in the linear signal. Both input and output intercept points are often quoted: the output intercept point equals the input intercept point plus the stage gain. Knowing the value of the $n$th-order intercept point and the input power level $P_{\mathrm{in}}$, the (nth-order) intermodulation level can be found:$$P _ {\mathrm {I M n}} = n. P _ {\mathrm {i n}} - (n - 1). I P _ {\mathrm {n}}$$
- See also $IP_2;IP_3.$
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]