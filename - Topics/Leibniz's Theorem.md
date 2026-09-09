## Synthesis
- 
## Source [^1]
- If $h(x) = f(x)g(x)$ for all $x$, the $n$th derivative of $h$ is given by$$h^{(n)}(x) = \sum_{r=0}^{n} \binom{n}{r} f^{(r)}(x)g^{(n-r)}(x),$$where the coefficients $\binom{n}{r}$ are binomial coefficients.
- For example, to find $h^{(8)}(x)$, when $h(x) = x^2 \sin x$, let $f(x) = x^2$ and $g(x) = \sin x$. Then $f'(x) = 2x$ and $f''(x) = 2$, with higher derivatives being zero; and $g^{(8)}(x) = \sin x, g^{(7)}(x) = -\cos x$ and $g^{(6)}(x) = -\sin x$. So$$\begin{gather}&h^{(8)}(x) = x^2 \sin x+ \binom{8}{1} 2x(-\cos x) \\&+ \binom{8}{2} 2(-\sin x) \\&= x^2 \sin x - 16x \cos x - 56 \sin x.\end{gather}$$
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]