## Synthesis
- 
## Source [^1]
- (1) A program that processes a sequential stream of text, carrying out some simple transformation, e.g. condensing multiple spaces to single spaces, counting words, etc. Powerful effects can be created by connecting a series of filters in a pipeline, where each filter takes as its input the output produced by its predecessor. 
- (2) A simple electric circuit or some more complicated device used in the process of filtering. See BAND-PASS FILTER, HIGH-PASS FILTER, LOW-PASS FILTER. 
- (3) A set of conditions applied to data so that only certain conforming items are displayed or processed.
## Source[^2]
- n. 
- (1) A porous substance or device that removes suspended particles while allowing fluid to pass through it. 
- (2) Any electronic, acoustic, optical, or purely mathematical device that blocks signals of certain frequencies while allowing others to pass. See also band-pass filter. vb. 
- (3) To remove or separate suspended particles from a fluid or certain wavelengths from a signal, or more generally to exclude certain types of stimuli from attention. See also Filter theory.
## Source[^3]
- An electrical network that will transmit signals with frequencies within certain designated ranges (pass bands) and reject or attenuate signals of other frequencies (stop or attenuation bands). The frequencies that separate the pass and stop bands are the cut-off frequencies, which have the symbols $f_{c}$ if there is only one cut-off frequency or $f_{1}$ and $f_{2}$ if more than one. Filters are classified according to the ranges of their pass or stop bands as low-pass, high-pass, band-pass and band-stop filters; the four main classifications with their corresponding frequency limits are shown in the table.

| Type of filter | Pass band(s)          | Stop band(s)          |
| -------------- | --------------------- | --------------------- |
| Low pass       | $0 - f_c$             | $f_c - \infty$        |
| High pass      | $f_c - \infty$        | $0 - f_c$             |
| Band pass      | $f_1 - f_2$           | $0-f_1, f_2 - \infty$ |
| Band stop      | $0-f_1, f_2 - \infty$ | $f_1-f_2$             |
|                |                       |                       |
- An ideal filter would transmit the pass band without attenuation and completely suppress the stop band, with a sharp cut-off profile. Practical filters however do attenuate the pass band, due to absorption, reflection, or radiation, which results in loss of signal power; neither do they completely suppress the stop bands. A typical curve of output voltage with frequency is shown in Fig. a for a simple low-pass filter: $V_{\mathrm{p}}$ is the peak voltage and $V_{\mathrm{m}}$ is the maximum voltage of an ideal filter. The filter attenuation is defined as the loss in signal power in decibels or nepers through the filter; the filter discrimination is the difference between the minimum value of insertion loss in a stop band and the maximum value in a pass band.
- ![[Screenshot 2026-03-19 at 7.13.25 AM.png|400]]
	- (a) Low-pass filter output
	- Parts
		- Output voltage
		- Frequency
- The components of a practical filter may be arranged to give the desired output curve. For example, Chebyshev and Butterworth filters are band-pass filters with different output characteristics (Fig. b). Butterworth filters have a flat response in the pass band whereas Chebyshev filters have some variation of the residual response in the pass band but have a more rapid increase of attenuation giving a sharper cut-off profile.
- ![[Screenshot 2026-03-19 at 7.13.59 AM.png|400]]
	- (b) Band-pass filters
	- Parts
		- Attenuation
		- Chebyshev response
		- Butterworth response
- Filters are active or passive according to their components. Active filters contain active components, such as operational amplifiers, that introduce some gain into the signal combined with suitable R-C feedback circuits to give them the desired frequency-response characteristic. Most passive filter networks are constructed from impedances arranged in shunt and in parallel (L-C networks). Two basic arrangements are used: $\pi$-sections and T-sections (Fig. c). Composite networks are built up from these basic sections and the arrangement is termed a ladder network because of the alternation of shunt and parallel sections. Another type of configuration is the lattice filter in which the impedance elements are arranged in a bridge network (Fig. d).
- ![[Screenshot 2026-03-19 at 7.15.37 AM.png|400]]
	- (c) Passive filters
	- Parts
		- $\pi\text{-section}$
		- T-section
- ![[Screenshot 2026-03-19 at 7.16.39 AM.png|200]]
	- (d) Lattice filter
	- Parts
		- Input
		- Output
- The bandwidth of a band-pass or band-stop filter is the difference in hertz between two particular frequencies whose geometric mean equals that of the geometric mid-frequency of the pass or stop band. Frequencies exhibiting a particular characteristic, such as the point at which the response is three decibels below the peak value, are usually chosen.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Psychology 4th Edition by Oxford Reference]]
[^3]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]