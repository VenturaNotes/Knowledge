## Synthesis
- 
## Source [^1]
- For simplicity, consider such an equation of second-order,$$a \frac{d^2 y}{dx^2} + b \frac{dy}{dx} + cy = f(x) \tag{1}$$where $a, b,$ and $c$ are given constants and $f$ is a given function. (Higher-order equations can be treated similarly.) Suppose that $f$ is not the zero function. Then the equation$$a \frac{d^2 y}{dx^2} + b \frac{dy}{dx} + cy = 0 \tag{2}$$is the homogeneous equation that corresponds to the inhomogeneous equation 1. The two are connected by the following result:
	- #errata The `(2)` and `(1)` don't seem to be proper in the textbook
### Theorem
- If $y = G(x)$ is the general solution of 2 and $y = y_1(x)$ is a particular solution of 1, then $y = G(x) + y_1(x)$ is the general solution of 1.
- Thus the problem of solving 1 is reduced to the problem of finding the complementary function (C.F.) $G(x)$, which is the general solution of 2, and a particular solution $y_1(x)$ of 1, usually known in this context as a particular integral (P.I.).
- The complementary function is found by looking for solutions of 2 of the form $y = e^{mx}$ and obtaining the auxiliary equation $am^2 + bm + c = 0$. If this equation has distinct real roots $m_1$ and $m_2$, the C.F. is $y = Ae^{m_1 x} + Be^{m_2 x}$; if it has one (repeated) root $m$, the C.F. is $y = (A + Bx)e^{mx}$; if it has non-real roots $\alpha \pm \beta i$, the C.F. is $y = e^{\alpha x}(A \cos \beta x + B \sin \beta x)$.
- The most elementary way of obtaining a particular integral is to try something similar in form to $f(x)$. Thus, if $f(x) = e^{kx}$, try as the P.I. $y_1(x) = pe^{kx}$. If $f(x)$ is a polynomial in $x$, try a polynomial of the same degree. If $f(x) = \cos kx$ or $\sin kx$, try $y_1(x) = p \cos kx + q \sin kx$. In each case, the values of the unknown coefficients are found by substituting the possible P.I. into the equation 1. If $f(x)$ is the sum of two terms, a P.I. corresponding to each may be found and the two added together.
- For example, the general solution of $y'' - 3y' + 2y = 4x + e^{3x}$, is found to be $y = Ae^x + Be^{2x} + 2x + 3 + \frac{1}{2} e^{3x}$.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]