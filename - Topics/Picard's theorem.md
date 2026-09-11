## Synthesis
- 
## Source [^1]
- An iterative method for solving the initial-value problem:$$ \frac{dy}{dx} = f(x, y(x)), \quad y(x_0) = y_0. $$
- Assume that $f$ is a continuous function in the first variable and Lipschitz in the second variable. Then there exists an open interval about $x_0$ on which there is a unique solution $y(x)$. The solution can be constructively found as the limit of functions $y_n(x)$, where$$ y_{n+1}(x) = y_0 + \int_{x_0}^x f(t, y_n(t)) dt, y_0(x) = y_0. $$
- As an example, suppose $dy/dx = y$ and $y(0) = 1$. Then$$\begin{align} &y_1(x) = 1 + \int_0^x 1 dt = 1 + x, \\& y_2(x) = 1 + \int_0^x (1 + t) dt = 1 + x + \frac{x^2}{2}. \end{align}$$
- So $y_n(x)$ is the first $n + 1$ terms of the exponential series and converges to the solution $y(x) = e^x$.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]