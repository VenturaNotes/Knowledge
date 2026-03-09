## Synthesis
- 
## Source [^1]
- Mathematically, the operation of combining two functions, w and f, to produce a third function, g, such that $$g_k = \sum_{i=0}^{\infty}w_if_{k-i}$$(or the corresponding continuous operation). This is envisaged as a transformation of an input function $f$ to an output function $g$, by viewing $f$ through a fixed window $w$.
- In coding theory, $f$ is considered as a signal and $w$ as the response of a linear channel; $g$ is then the effect upon that signal (regarded as a sequence of successive elements) brought about by the time response of the linear channel. The [[channel time response]] is the sequence of successive elements output by the channel in response to a signal that has one element of unit amplitude and all other elements zero. The input signal sequence and the channel time response are said to be convolved
- The inverse process is [[deconvolution]]: the convolved output sequence can be deconvolved with the channel time response sequence to restore the original input signal sequence.
- It is important, both mathematically and practically, that the convolution of discrete-time signals corresponds to the conventional multiplication of polynomials
- See also FEEDBACK REGISTER, FEED_FORWARD REGISTER
## Source[^2]
- $n$. a folding or twisting, such as one of the many that cause the fissures, sulci, and gyri of the surface of the cerebrum.
## Source[^3]
- $n$. Any of the convex folds or ridges on the surface of the brain, also called a gyrus ; more generally, anything coiled or twisted together or, by analogy, any confused or intricate issue or condition. convolute $v b$. convoluted adj. \[From Latin convolutus rolled up, from con with + volvere, volutus to turn + -ion indicating an action, process, or state]
## Source[^4]
- A mathematical method of analyzing the response of a linear system to any input function. If an input $x(t)$ to a linear system is split up into a succession of rectangular pulses of width $\Delta \tau$ so that the area of a typical pulse at $t = \tau$ is $x(\tau)\Delta \tau$ (see diagram) then this pulse will give rise to a response$$\left[ x (\tau) \Delta \tau \right] h (t - \tau)$$The total response $y(t)$ can be expressed as an integral, known as the convolution integral, given by$$y (t) = \int_ {- \infty} ^ {+ \infty} x (\tau) h (t - \tau) d \tau$$The physical interpretation of the integral can be expressed as follows: the value of the output at a given time $t$ is the integrated effect of the values of the input at all previous times $t$. This combining of two functions of the same variable is known as convolution and is expressed by the special symbol $\otimes$. Therefore, the general expression which defines $\otimes$, known as the convolution operator, is given by$$a (t) \otimes b (t) = \int_ {- \infty} ^ {+ \infty} a (\tau) b (t - \tau) d \tau$$
- ![[Screenshot 2026-03-09 at 6.11.25 AM.png|400]]
	- Convolution
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) Concise Medical Dictionary 10th Edition by Oxford Reference]]
[^3]: [[(Home Page) A Dictionary of Psychology 4th Edition by Oxford Reference]]
[^4]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]