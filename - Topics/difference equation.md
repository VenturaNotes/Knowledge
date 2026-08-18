## Synthesis
- 
## Source [^1]
- (1) An equation that defines an indexed sequence of numbers by giving some initial values and describing how subsequent members of the sequence are related to immediate neighbors. For example, the Fibonacci sequence defines $f_{0}$ and $f_{1}$ as 1 and then recursively defines $f_{n} = f_{n-1} + f_{n-2}$ for $n > 1$. 
- (2) A discrete form of differentiation applied to sequences of real numbers. For example, given the ordered sequence $r_{1}, r_{2}, r_{3}, \ldots$ we can define the first difference as the sequence $\Delta(r_{1}), \Delta(r_{2}), \Delta(r_{3}), \ldots$ defined by$$\Delta(r_{n}) = r_{n+1} - r_{n}$$
- See also DIFFERENTIAL EQUATION.
## Source[^2]
- Let $u_0, u_1, u_2, \dots, u_n, \dots$ be a sequence. If the terms satisfy the first-order difference equation $u_{n+1} + au_n = 0$, it is easy to see that $u_n = A(-a)^n$, where $A (= u_0)$ is arbitrary.
- Suppose that the terms satisfy the second-order difference equation $u_{n+2} + au_{n+1} + bu_n = 0$. Let $\alpha$ and $\beta$ be the roots of the quadratic ‘auxiliary equation’ $x^2 + ax + b = 0$. If $\alpha \ne \beta$, then $u_n = A\alpha^n + B\beta^n$, and if $\alpha = \beta \ne 0$, then $u_n = (A + Bn)\alpha^n$, where $A$ and $B$ are arbitrary constants. For example, the Fibonacci sequence is given by the difference equation $u_{n+2} = u_{n+1} + u_n$, with $u_0 = 1$ and $u_1 = 1$, and the above method gives Binet's formula$$u_n = \frac{1}{2} \left( \frac{1 + \sqrt{5}}{2} \right)^n - \frac{1}{2} \left( \frac{1 - \sqrt{5}}{2} \right)^n.$$
- The above theory generalizes to linear constant coefficient difference equations (see LINEAR EQUATION) of higher orders, with the solutions forming a vector space with dimension equalling the order. The solutions to an inhomogeneous linear difference equation are a particular solution added to the homogeneous solutions. Difference equations, also called recurrence relations, do not necessarily have constant coefficients like those considered above. Such difference equations may be approached using generating functions.
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]
[^2]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]