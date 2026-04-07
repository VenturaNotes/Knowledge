## Synthesis
- 
## Source [^1]
- (propagation constant) (symbol: $\gamma, P$) A complex quantity that expresses the effect of a transmission line on a sinusoidal progressive wave. The propagation coefficient is defined for a uniform transmission line of infinite length supplied with a sinusoidal current of specified frequency at its sending end.
- Under steady-state conditions, if the currents at two points along the line, separated by unit length, are $I_{1}$ and $I_{2}$, where $I_{1}$ is nearer the sending end of the line, then$$\gamma = \log_{e} \left(\frac{I_{1}}{I_{2}}\right)$$at the specified frequency; $I_{1} / I_{2}$ is the vector ratio of the currents. $\gamma$ is a complex quantity and may be written$$\gamma = \alpha + j\beta$$where $j = \sqrt{-1}$. The real part, $\alpha$, is the attenuation constant and is measured in nepers per unit length of line. It measures the transmission losses in the line. The imaginary part, $\beta$, is the phase-change coefficient and is measured in radians per unit length of line. It is the phase difference between $I_{1}$ and $I_{2}$ introduced by the transmission line. Thus$$\frac{I_{1}}{I_{2}} = \exp(\alpha + \beta j) = \exp(\alpha). \exp(j\beta)$$
	- #question Is it $\cdot$ or $.$ after the $exp(\alpha)$? Are we doing multiplication?
- If the displacement of the vibration is a maximum at a given point and equal to $p_1$, then at the same instant the displacement, $p_2$, at a distance $x$ along the transmission line is given by$$p_2 = p_1 \exp(-\alpha - j\beta) x$$
- An infinite transmission line is not physically possible but conditions simulating those in an infinite line are realized when a transmission line of finite length is terminated by its characteristic impedance. Compare IMAGE TRANSFER CONSTANT.
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]