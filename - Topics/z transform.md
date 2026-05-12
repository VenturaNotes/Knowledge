## Synthesis
- 
## Source [^1]
- An extension to the Fourier and Laplace transforms for sampled-data signals. The Laplace transform $G(s)$ of a sampled-data signal $x(t)$ is given by:$$G(s) = x_0 + x_1 e^{-sT} + x_2 e^{-s2T} + x_3 e^{-s3T} + \dots$$where $s$ is the complex operator $\sigma + \mathrm{j}\omega$ (see S-DOMAIN CIRCUIT ANALYSIS) and $T$ is the sampling period. A new variable is defined, $z = \mathrm{e}^{sT}$, and the $z$ transform $G(z)$ of the signal $x(t)$ becomes:$$G(z) = x_0 + x_1 z^{-1} + x_2 z^{-2} + x_3 z^{-3} + \dots$$
- Since $z = \mathrm{e}^{sT}$ and $s = \sigma + \mathrm{j}\omega$, then $z = \mathrm{e}^{\sigma T} \mathrm{e}^{\mathrm{j}\omega T}$. The term $\mathrm{e}^{-\mathrm{j}\omega T}$ implies a constant time delay of $T$ seconds, and for this reason $z$ is often referred to as the shift operator or the $z$ transform operator.
- Since $z$ has both real and imaginary parts it can be plotted on the complex plane known as the z-plane in a similar fashion to points on the s-plane (see S-DOMAIN CIRCUIT ANALYSIS). The relationship between the s-plane and the z-plane is shown in the diagram. It can be seen that the left-hand half of the s-plane maps into the area inside the circle, called the unit circle, in the z-plane.
- ![[Pasted image 20260511230323.png]]
	- Z transform: relationship between (a) s-plane and (b) z-plane
	- Parts
		- (a) s-plane
		- (b) z-plane
			- unit circle
  
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]