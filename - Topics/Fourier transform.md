## Synthesis
- 
## Source [^1]
- A mathematical operation that analyses an arbitrary waveform into its constituent sinusoids (of different frequencies and amplitudes). This relationship is stated as

  

$$

S(f)=\int_{-\infty}^{\infty} s(t) \exp (-2 \pi i f t) \mathrm{d} t

$$

  

where $s(t)$ is the waveform to be decomposed into a sum of sinusoids, $S(f)$ is the Fourier transform of $s(t)$, and $i=\sqrt{ }-1$. An analogous formula gives $s(t)$ in terms of $S(f)$, but with a normalizing factor, $1 / 2 \pi$. Sometimes, for symmetry, the normalizing factor is split between the two relations.

  

The Fourier transform pair, $s(t)$ and $S(f)$, has to be modified before it is amenable to

  

computation on a digital computer. This modified pair, called the discrete Fourier transform (DFT) must approximate as closely as possible the continuous Fourier transform. The continuous time function is approximated by $N$ samples at time intervals $T$ :

  

$$

g(k T), k=0,1, \ldots n-1

$$

  

The continuous Fourier transform is also approximated by $N$ samples at frequency intervals $1 / N T$ :

  

$$

G(n / N T), n=0,1, \ldots N-1

$$

  

Since the $N$ values of time and frequency are related by the continuous Fourier transform, then a discrete relationship can be derived:

  

$$

G(n / N T)=\sum_{k=0}^{N-1} g(k t) \exp (-2 \pi i n k / N)

$$
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]