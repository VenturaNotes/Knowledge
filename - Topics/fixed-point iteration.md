## Synthesis
- 
## Source [^1]
- To find a root of an equation $f(x) = 0$ by the method of fixed-point iteration, the equation is first rewritten in the form $x = g(x)$. Starting with an initial approximation $x_0$ to the root, the values $x_1, x_2, x_3, \dots$ are calculated using $x_{n+1} = g(x_n)$. The method is said to converge if these values tend to a limit $\alpha$. If they do, then $\alpha = g(\alpha)$ and so $\alpha$ is a root of the original equation.
- ![[Pasted image 20260903222943.png|212]]
	- Repelling fixed point $|g'(\alpha)| > 1$
- ![[Pasted image 20260903222958.png|260]]
	- Attracting fixed point $|g'(\alpha)| < 1$
- A root of $x = g(x)$ occurs where the graph $y = g(x)$ meets the line $y = x$. It can be shown that, if $|g'(\alpha)| < 1$, then the sequence converges for suitably close initial values $x_0$, and $\alpha$ is called attracting. If $|g'(\alpha)| > 1$, then the sequence diverges from $\alpha$ for nearby initial values $x_0$. This is illustrated in the figures; such diagrams are called 'cobweb plots', and the process is called 'cobwebbing'. The equation $x^3 - x - 1 = 0$ has a root $\alpha$ between 1 and 2, so we take $x_0 = 1.5$. The equation can be written in the form $x = g(x)$ in several ways, such as (i) $x = x^3 - 1$ or (ii) $x = (x + 1)^{1/3}$. In case (i), $g'(x) = 3x^2$, $g'(\alpha) > 3 > 1$ and so $\alpha$ is repelling for this iteration; in case (ii), $g'(x) = \frac{1}{3}(x + 1)^{-2/3}$ and $g'(\alpha) < 2^{-2/3}/3 < 1$ and so $\alpha$ is attractive.
- More generally a fixed point $\alpha \in X$ of a function $f: X \to X$ is attracting if the fixed-point iteration converges to $\alpha$ for initial values in a neighborhood of $\alpha$ and is repelling if there is a neighborhood of $\alpha$ such that the fixed-point iteration eventually moves out of the neighbourhood for all initial values other than $\alpha$.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]