---
aliases: logarithms
---
## Synthesis
- A logarithm is not defined for non-positive numbers, or base 1.
	- [ ] #question Why is a logarithm not able to have a base 1?
## Source[^1]
### Rules
- $log_a1 = 0$
	- Can be read as "logarithm of 1 to the base a"
- $log_aa = 1$
- $log_aa^x = x$
- $a^{log_ax} = x$

## Source[^2]
### More Rules
- Power Rule
	- $logA^B = BlogA$
- Product Rule
	- $logA*B = logA + logB$
- Quotient Rule
	- $log \frac {A}{B} = logA - logB$

## Source[^3]
### Facts
- Log function only takes positive numbers as inputs
## Source[^4]
- Let $a, x$ be positive numbers with $a \neq 1$. Then $\log_a x$, the logarithm of $x$ to base $a$, is defined by$$\log_a x = \frac{\ln x}{\ln a}$$where $\ln$ denotes the logarithmic function. This is equivalent to saying that $y = \log_a x$ if and only if $x = a^y$ or that the function $\log_a x$ is the inverse function of $a^x$. The following properties hold, where $x, y,$ and $r$ are real, with $x, y > 0$:
	- (i) $\log_a(xy) = \log_a x + \log_a y$
	- (ii) $\log_a(1/x) = -\log_a x$
	- (iii) $\log_a(x^r) = r \log_a x$
	- (iv) Logarithms to different bases are related by the formula$$\log_b x = \frac{\log_a x}{\log_a b}$$
	- (v) $\frac{d}{dx} \log_a x = \frac{1}{x \ln a}$.
- Logarithms to base 10 are called common logarithms. Logarithms to base $e$ are called natural logarithms. See COMPLEX LOGARITHM.
## References

[^1]: [[(Home Page) Building Blocks for Theoretical Computer Science by Margaret M. Fleck#^rvpabl]]
[^2]: [[(13) Algebra Ch 47 - Logarithmic Functions (13 of 26) Rules of Logarithms]]
[^3]: [[(Home Page) Building Blocks for Theoretical Computer Science by Margaret M. Fleck#^zfp0vs]]
[^4]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]