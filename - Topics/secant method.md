## Synthesis
- 
## Source [^1]
- An iterative method for finding a root of the nonlinear equation $f(x)=$ 0 . It is given by the formula$$\begin{aligned}& x_{n+2}=x_{n+1}- \\& \left(x_{n+1}-x_{n}\right)\left[f\left(x_{n+1}\right) /\left(f\left(x_{n+1}\right)-f\left(x_{n}\right)\right)\right] \\& n=0,1,2, \ldots\end{aligned}$$where $x_{0}$ and $x_{1}$ are given starting values. This formula is derived by replacing $f(x)$ by a straight line based on the last two iterates. Convergence is ultimately less rapid than for Newton's method, but it can be overall more efficient on some problems since derivatives are not required.
## Source[^2]
- Given two successive approximations to a function’s root $a$, the secant method calculates where the secant through these two points
- ![[Pasted image 20260918041352.png|260]]
	- The secant method 
- meets the $x$-axis and uses this as the next approximation. So the iteration is given by$$x_{n+1} = x_n - \frac{(x_n - x_{n-1})}{f(x_n) - f(x_{n-1})} \times f(x_n) \quad \text{for } n=1, 2, 3, \dots$$
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]