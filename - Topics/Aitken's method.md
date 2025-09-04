## Synthesis
- 
## Source [^1]
- (in numerical analysis) If an iterative formula $x_{r+1}=f\left(x_{r}\right)$ is to be used to solve an equation, Aitken's method of accelerating convergence uses the initial value and the first two values obtained by the formula to calculate a better approximation than the iterative formula would produce. This can then be used as a new starting point from which to repeat the process until the required accuracy has been reached. While this is computationally intensive, it is the sort of process which spreadsheets handle very easily.
- If $x_{0}, x_{1}, x_{2}$ are the initial value and the first two iterations and $\Delta x_{r}=x_{r+1}-x_{r}, \Delta^{2} x_{r}=\Delta x_{r+1}-\Delta x_{r}$ are the forward differences then $x_{4}=x_{3}-\frac{\left(\Delta x_{2}\right)^{2}}{\Delta^{2} x_{1}}$. More generally this will be expressed as $x_{r+1}=x_{r}-\frac{\left(\Delta x_{r-1}\right)^{2}}{\Delta^{2} x_{r-2}}$.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]