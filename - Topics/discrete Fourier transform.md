## Synthesis
- 
## Source [^1]
- (DFT) A mathematical method of analyzing discrete or sampled data signals to determine the frequency spectrum. The DFT is equivalent to the Fourier transform for discrete signals and is given by$$X (m) = \frac {1}{N} \Sigma_ {n = 0} ^ {N - 1} x (n) \exp \left(- \frac {2 j \pi m n}{N}\right)$$where $x(n)$ is the discrete signal to be analyzed, $X(m)$ is the resulting discrete frequency spectrum, $N$ is the number of $x(n)$ samples taken, and $\exp$ indicates the exponential function.
- A sampled function of time is shown in Fig. $a$ and its discrete Fourier transform spectrum in Fig. $b$ . The time function is sampled at $N$ points separated by an increment $T$ over an interval $t_{\mathrm{p}} = NT$ to create a discrete function $x(n)$ . The resulting spectrum $X(m)$ is periodic with a period $f_{\mathrm{s}} = 1 / T$ , and contains $N$ components within one period with spacing between components $F = 1 / t_{\mathrm{p}}$ . If $x(n)$ is a real function, only half or $N / 2$ of the spectral components are unique. The integers $n$ and $m$ represent the time and frequency integers that identify the locations in the sequence of the time sample ($t = nT$) and the frequency components ($f = mF$).
- ![[Screenshot 2026-03-11 at 7.01.26 AM.png|400]]
	- (a) Discrete signal $x(n)$
- ![[Screenshot 2026-03-11 at 7.01.40 AM.png|400]]
	- (b) Discrete Fourier transform spectrum $X(m)$
- A careful investigation of the DFT function shows that many of the multiplication operations are repeated. Algorithms can be devised that exploit this repetition to speed up the transformation by reducing the number of computations required. These high-speed algorithms are known as the fast Fourier transforms (FFT). The use of FFT analysis does however have a number of sources of error. These include aliasing, leakage, and the picket-fence effect. Leakage is an undesirable harmonic distortion that occurs when the time series is not periodic in the sampling interval. The picket-fence effect is due to the frequency response of a finite-length DFT. The DFT can be thought of as a set of narrow band-pass filters whose centre frequencies are located at $nf_{0}$ (where $n = 0,1,2,3,\ldots N - 1$ , $f_{0}$ is the sampling frequency, and $N$ the number of samples), as shown in Fig. c. It can be seen that any input signal $x(t)$ coincident with a frequency $nf_{0}$ will be transformed without distortion. However, the frequency components of $x(t)$ at noninteger multiples of $f_{0}$ will be transformed with distortion.
- ![[Screenshot 2026-03-11 at 7.02.38 AM.png|400]]
	- (c) Finite-length DFT response
	- Part
		- Magnitude vs Frequency
## Source[^2]
- The discrete Fourier transform of a vector $\mathbf{x} = (x_0, x_1, \dots, x_{n-1})$ is the vector $\mathbf{y} = (y_0, y_1, \dots, y_{n-1})$ obtained by calculating $y_k = \sum_{j=0}^{n-1} \omega^{kj} x_j$ for each $k = 0, 1, \dots, n-1$ where $$\omega = e^{(- 2\pi i / n)} = \cos\left(\frac{2\pi}{n}\right) - i \sin\left(\frac{2\pi}{n}\right)$$This involves a large number of calculations, but the number can be reduced by using an algorithm called the fast Fourier transform.
- SEE WEB LINKS
	- http://www.jhu.edu/signals/fourier2/index.html #comment Not found
	* A discrete Fourier transform tool in which choosing different options from the signal menu illustrates a number of signals and the approximating function using a specified number of Fourier coefficients.
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]
[^2]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]