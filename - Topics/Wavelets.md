---
aliases:
  - wavelet
---
## Synthesis
- 
## Source [^1]
- A basis function, $W$, that yields the representation of a function $f(x)$ of the form:

  

$$

f(x)=\sum b_{j k} \mathrm{~W}(2 \mathrm{x}-k)

$$

  

Wavelets are based on two fundamental ideas: dilation and translation. The construction of wavelets begins with the solution to a dilation equation:

  

$$

\chi(x)=\sum c_{k} \chi(2 x-k)

$$

  

$\phi(x)$ is called the scaling function. $W$ can then be derived from $\phi(x)$ :

  

$$

W(x)=\sum\left(-1^{k} c_{k-k} \chi(2 x-k)\right.

$$

  

Wavelets are particularly useful for representing functions that are local in time and frequency. The idea of wavelets grew out of seismic analysis and is now a rapidly developing area in mathematics. There are elegant recursive algorithms for decomposing a signal into its wavelet coefficients and for reconstructing a signal from its wavelet coefficients.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]