## Synthesis
- 
## Source [^1]
- Any equation for an unknown function $f(x), a \leq x \leq b$, involving integrals of the function. An equation of the form$$f(x)=\int_{a}^{x} K(x, y) f(y) \mathrm{d} y+g(x)$$is a Volterra equation of the second kind. The analogous equation with constant limits$$f(x)=\int_{a}^{b} K(x, y) f(y) \mathrm{d} y+g(x)$$is a Fredholm equation of the second kind. If the required function only appears under the integral sign it is a Volterra or Fredholm equation of the first kind; these are more difficult to treat both theoretically and numerically. The Volterra equation can be regarded as a particular case of the Fredholm equation where$$K(x, y)=0 \text { for } y>x$$Fredholm equations of the second kind occur commonly in boundary-value problems in mathematical physics. Numerical techniques proceed by replacing the integral with a rule for numerical integration, leading to a set of linear algebraic equations determining approximations to $f(x)$ at a set of points in $a \leq x \leq b$.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]