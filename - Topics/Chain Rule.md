## Synthesis
- 
## Source[^1]
### Description
- Used to calculate the derivative of a composite function

## Source[^2]
### Formula
- $\frac{d}{dx}[(f(x))^n] = nf(x)^{n-1}*f'(x)$

## Source[^3]
### Example
$$ \begin{align*} f(x) &= (x^2-3x)^2 \\ f'(x) &= 2(x^2-3x)(2x-3)  \end{align*}$$
## Source[^4]
- The following rule that gives the derivative of the composition of two functions: If $h(x) = (f\circ g)(x) = f(g(x))$ for all $x$, then $h'(x) = f'(g(x))g'(x)$. For example, if $h(x) = (x^2+1)^3$, then $h = f\circ g$, where $f(x) = x^3$ and $g(x) = x^2+1$. Then $f'(x)=3x^2$ and $g'(x) = 2x$. So $h'(x) = 3(x^2+1)^2 2x = 6x(x^2+1)^2$. Another notation can be used: if $y = f(g(x))$, write $y = f(u)$, where $u=g(x)$. Then the chain rule says that $dy/dx = (dy/du)(du/dx).$ As an example of the use of this notation, suppose that $y = (sin x)^2$. Then $y = u^2$, where $u = sin x$, So $dy/du = 2u$ and $du/dx = \cos x$, and hence $dy/dx = 2\sin x \cos x.$ 
---
- (multivariable) More generally, if $f(x_1, \dots, x_n)$ is a function of $n$ variables $x_i$ which each are functions of $m$ variables $t_1, \dots, t_m$, then the multivariable version of the chain rule reads$$\frac{\partial f}{\partial t_i} = \frac{\partial f}{\partial x_1} \frac{\partial x_1}{\partial t_i} + \frac{\partial f}{\partial x_2} \frac{\partial x_2}{\partial t_i} + \dots + \frac{\partial f}{\partial x_n} \frac{\partial x_n}{\partial t_i}.$$
## References

[^1]: https://mathsathome.com/chain-rule-differentiation/
[^2]: [[(2) Calculus 1 CH 3 Derivatives (2 of 24) The Chain Rule]]
[^3]: [[(5) Calculus 1 CH 3 Derivatives (5 of 24) Quotient-Product Chain Rule]]
[^4]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]