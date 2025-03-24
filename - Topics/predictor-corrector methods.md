## Synthesis
- 
## Source [^1]
- The standard approach in the implementation of linear multistep methods for the solution of ordinary differential equations. Two such formulae are used on each step, one of which is implicit (see LINEAR MULTISTEP METHODS). An example of such a formula pair are Euler's method (see DISCRETIZATION) and the trapezoidal rule (see ORDINARY DIFFERENTIAL EQUATIONS). A predictor-corrector method based on these formulae has the form

  

$$

\begin{aligned}

& y^{\mathrm{p}_{n+1}}=y_{n}+h f\left(x_{n}, y_{n}\right)(\text { prediction }) \\

& y_{n+1}=y_{n}+1 / 2 h\left(f\left(x_{n}, y_{n}\right)+\right. \\

& \left.f\left(x_{n}, y^{\mathrm{p}}{ }_{n+1}\right)\right) \text { (correction) }

\end{aligned}

$$

  

This permits the more accurate implicit formula to be used effectively, without solving an equation for $y_{n+1}$, and provides an estimate for the local error, namely $y^{\mathrm{p}}{ }_{n+1}-y_{n+1}$. Such estimates are used to control accuracy and stability.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]