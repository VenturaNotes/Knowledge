## Synthesis
- 
## Source [^1]
- Applied to a suitable function $f$, Taylor's Theorem gives a polynomial that is an approximation to $f(x)$.
### Theorem

- Let $f$ be a real function on an open interval $I$, such that the derived functions $f^{(r)} (r = 1, \dots, n)$ are continuous functions and suppose that $a \in I$. Then, for all $x$ in $I$,$$\begin{align}f(x) = f(a) + \frac{f'(a)}{1!} (x - a) + \frac{f''(a)}{2!} (x - a)^2 \\+ \dots + \frac{f^{(n-1)}(a)}{(n - 1)!} (x - a)^{n-1} + R_n, \end{align}$$
- where $R_n$ denotes the remainder term $R_n$.
- Two possible forms for $R_n$ are$$\begin{align} &R_n = \frac{1}{(n - 1)!} \int_a^x f^{(n)}(t)(x - t)^{n-1} dt \text{ and} \\& R_n = \frac{f^{(n)}(c)}{n!} (x - a)^n, \end{align}$$where $c$ lies between $a$ and $x$. By taking $x = a + h$, where $a + h \in I$, the formula$$ f(a + h) = f(a) + \frac{f'(a)}{1!} h + \frac{f''(a)}{2!} h^2 + \dots + \frac{f^{(n-1)}(a)}{(n - 1)!} h^{n-1} + R_n $$is obtained. This enables $f(a + h)$ to be determined up to a certain degree of accuracy, the remainder $R_n$ giving the error. Suppose now that $f$ is infinitely differentiable in $I$ and that $R_n \to 0$ as $n \to \infty$; then an infinite series can be obtained whose sum is $f(x)$. In such a case, it is customary to write$$ f(x) = f(a) + \frac{f'(a)}{1!} (x - a) + \frac{f''(a)}{2!} (x - a)^2 + \dots $$
- This is the Taylor series (or expansion) for $f$ at (or about) $a$. The special case with $a = 0$ is the Maclaurin series for $f$. Note that the Taylor series of an infinitely differentiable function $f(x)$ can converge without converging to $f(x)$; it is important that the remainder term tends to 0. For example, the function$$ f(x) = \begin{cases} \exp(-1/x^2), & x \neq 0, \\ 0, & x = 0, \end{cases} $$is infinitely differentiable at 0 with $f^{(n)}(0) = 0$ for all $n$. Thus, the Taylor series converges, but to the zero function, rather than to $f(x)$.
- The Taylor series for a real function $f(x, y)$ of two variables, which has partial derivatives of all orders, states that$$ \begin{align} f(a + h, b + k) &= f(a, b) + (f_x(a, b)h + f_y(a, b)k) \\ &+ \frac{1}{2!} (f_{xx}(a, b)h^2 + 2f_{xy}(a, b)hk + f_{yy}(a, b)k^2) + \dots \end{align} $$
- In complex analysis, a function $f(z)$ which is holomorphic at a point $a$ has a Taylor series$$ f(z) = \sum_{k=0}^{\infty} \frac{f^{(k)}(a)}{k!} (z - a)^k $$which is convergent in a neighborhood of $a$. See also CAUCHY'S FORMULA FOR DERIVATIVES.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]