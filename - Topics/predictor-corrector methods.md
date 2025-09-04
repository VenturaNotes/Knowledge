## Synthesis
- 
## Source [^1]
- The standard approach in the implementation of linear multistep methods for the solution of ordinary differential equations. Two such formulae are used on each step, one of which is implicit (see linear multistep methods). An example of such a formula pair are Euler's method (see discretization) and the trapezoidal rule (see ordinary differential equations). A predictor-corrector method based on these formulae has the form $$\begin{align} y^\mathrm{p}_{n+1} &= y_n + hf(x_n,y_n) (\text{prediction}) \\ y_{n+1} &= y_n + \frac 12h(f(x_n,y_n)+\\f(x_n&,y^\mathrm{p}_{n+1})) ~(\text{correction})\end{align}$$
- This permits the more accurate implicit formula to be used effectively, without solving an equation for $y_{n+1}$, and provides an estimate for the local error, namely $y^p_{n+1} - y_{n+1}$. Such estimates are used to control accuracy and stability.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]