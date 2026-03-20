## Synthesis
- 
## Source [^1]
- The analysis of an arbitrary waveform into its constituent sinusoids (of different frequencies and amplitudes). See also Fourier TRANSFORM, ORTHONORMAL BASIS.
## Source[^2]
- An expansion of a periodic function into an infinite sum of sines and cosines, each at a different frequency, also known as harmonic analysis or spectral analysis. Techniques based on Fourier analysis are applied primarily in time series econometrics. See also FREQUENCY DOMAIN ANALYSIS.
## Source[^3]
- $n$. The decomposition of a time series or a periodic phenomenon such as a sound wave or the variation in luminance across a visual image into its component sinusoidal components of different frequencies and amplitudes by fitting terms of a Fourier series to it. See also Fourier series, Fourier theorem, Fourier transform, Ohm's acoustic law. \[Named after the French mathematician Baron Jean Baptiste Joseph Fourier (1768-1830) who published the fundamental mathematical results underlying it in 1822]
## Source[^4]
- A mathematical method of analyzing complex waveshapes or signals into a series of simple harmonic functions, the frequencies of which are integer (1,2,3,...) multiples of the fundamental frequency. An arbitrary periodic phenomenon $u$, of period $T$, may be represented by the Fourier series provided that certain conditions - Dirichlet conditions - are satisfied. The Fourier series is then given by$$u = \mathrm{F}(t)$$where$$\mathrm{F}(t) = \sum_{n=-\infty}^{n=+\infty} a_n \mathrm{e}^{\mathrm{j} n \omega t}$$where $\omega$ is equal to $2\pi/T$, $j$ is the square root of $-1$, and $n$ is an integer; $a_n$ is the $n$th coefficient and is given by$$a_n = \left(\frac{1}{T}\right) \int_0^T \mathrm{F}(t) \mathrm{e}^{-\mathrm{j} n \omega t} \mathrm{d}t$$The Fourier series may alternatively be written as a series of sines and cosines.
- As the period, $T$, becomes infinitely large so that $1/T$ tends to zero, the Fourier series in its limiting form becomes an integral - the Fourier integral. The values of the Fourier series or the Fourier integral are determined by the physical conditions of the phenomenon under consideration.
- Fourier analysis is widely used in electronics, where a slightly different representation is commonly used in which the Fourier integral is written as$$\mathrm{F}(t) = \int_{-\infty}^{+\infty} \mathrm{g}(\omega) \mathrm{e}^{\mathrm{j} \omega t} \mathrm{d}\omega$$where the function$$\mathrm{g}(\omega) = \frac{1}{2\pi} \int_{-\infty}^{+\infty} \mathrm{F}(t) \mathrm{e}^{-\mathrm{j} \omega t} \mathrm{d}t$$is called the Fourier transform of the function $\mathrm{F}(t)$. Similarly $\mathrm{F}(t)$ is also the Fourier transform of the function $\mathrm{g}(\omega)$. See also discrete Fourier transform.
- http://hyperphysics.phy-astr.gsu.edu/hbase/Audio/fourier.html
	- An introduction to Fourier analysis
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Economics 5th Edition by Oxford Reference]]
[^3]: [[(Home Page) A Dictionary of Psychology 4th Edition by Oxford Reference]]
[^4]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]