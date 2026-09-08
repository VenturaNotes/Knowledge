---
aliases:
  - integrals
---
## Synthesis
- 
## Source [^1]
- Let $f$ be a bounded function defined on the closed interval $[a,b]$. Take points $x_0, x_1, x_2, \dots, x_n$ such that $a = x_0 < x_1 < x_2 < \dots < x_{n-1} < x_n = b$, and in each subinterval $[x_i, x_{i+1}]$ take a point $c_i$. Form the Riemann sum$$\sum_{i=0}^{n-1} f(c_i)(x_{i+1} - x_i).$$
- Geometrically, this gives the sum of the areas of $n$ rectangles, and is an approximation to the area under the curve $y = f(x)$ between $x = a$ and $x = b$.
- ![[Pasted image 20260907184617.png|244]]
	- Area represented by a Riemann sum
- The (Riemann) integral of $f$ over $[a, b]$ is defined to be the limit $I$, if it exists, of such a Riemann sum as $n$, the number of points, increases and the maximal length of the subintervals tends to zero. The value of $I$ is denoted by$$\int_a^b f(x) \, dx$$
- The intention is that the value of the integral is equal to what is intuitively understood to be the signed area under the curve $y = f(x)$. (See DARBOUX INTEGRAL.) Such a limit does not always exist, but it can be proved that it does if $f$ is a continuous function on $[a, b]$. An example where the limit does not exist is the Dirichlet function.
- If $f$ is continuous on $[a, b]$ and $F$ is defined by$$F(x) = \int_a^x f(t) \, dt$$then $F'(x) = f(x)$ for all $x$ in $[a, b]$, so that $F$ is an antiderivative of $f$. Moreover, if an antiderivative $\phi$ of $f$ is known, the Fundamental Theorem of Calculus evaluates the integral$$\int_a^b f(t) \, dt$$as $\phi(b) - \phi(a)$. Of the two integrals$$\int_a^b f(x) \, dx \quad \text{and} \quad \int f(x) \, dx$$the first, with limits, is called a definite integral; the second, which denotes an antiderivative of $f$, is an indefinite integral and is defined only up to addition by arbitrary constant. See also LEBESGUE MEASURE, LINE INTEGRAL, MULTIPLE INTEGRAL, SURFACE INTEGRAL.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]