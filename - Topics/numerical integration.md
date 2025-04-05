## Synthesis
- 
## Source [^1]
- The methods of numerical integration are used to find approximate values for definite integrals and are useful when there is no analytical method of finding an antiderivative of the integrand. Among the elementary methods of numerical integration are the midpoint rule, trapezium rule, Simpson’s rule, and Gaussian quadrature.

## Source[^2]
- (quadrature) The problem of finding the numerical value for a definite integral. The underlying approximation behind most methods is the replacement of a function $f(x)$ by an interpolation polynomial, based on a set of points $x_{1}, x_{2}, \ldots, x_{n}$. This leads to integration rules of the form$$\begin{aligned}& \int_{a}^{b} w(x) f(x) \mathrm{d} x \approx w_{1} f(x)+w_{2} f\left(x_{2}\right)+\ldots \\& +w_{n} f\left(x_{n}\right)\end{aligned}$$in which the $w_{i}$ are called weights.
- The standard problem has $a, b$ finite and $w(x) \equiv 1$. For this case the rules with equally spaced points $x_{i}$ are called Newton-Cotes rules. Well-known examples are the trapezium rule and Simpson's rule. Most program libraries implement the more powerful Gaussian rules in which the points $x_{i}$ are chosen to maximize the degree of precision. This is achieved by choosing the $x_{i}$ as the zeros of the Legendre polynomials that are orthogonal polynomials with respect to $w(x) \equiv 1$ on the interval $[-1,1]$. Another important idea is the extrapolation method due to Romberg, based on the trapezium rule.
- For infinite range problems Gaussian rules can also be defined in terms of suitable orthogonal polynomials. A useful case is where$$w(x)=e^{-x},a=0,b=\infty$$where the appropriate orthogonal polynomials determining the $x_{i}$ are the Laguerre polynomials.
- In practice the interval of integration is subdivided and the chosen rule applied to each subinterval, together with a companion rule to provide an error estimate (see ERROR ANALYSIS). By then subdividing the interval where the error is largest, a greater concentration of effort is placed where the integrand is most difficult. This is known as [[adaptive quadrature]]. Such nonuniform distribution of effort, adapted to the particular problem, is essential for the efficient solution of all practical problems.
- Multiple integrals over a large number of dimensions may be treated by Monte Carlo methods, involving the use of randomly generated evaluation points.
## References

[^1]: [[Home Page - The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]
[^2]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]