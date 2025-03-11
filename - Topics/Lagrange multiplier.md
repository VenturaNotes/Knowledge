## Synthesis
- 
## Source [^1]
- A method of evaluating maxima and minima of a function $f$, where one or more constraints $g_i = 0$ have to be satisfied. A new function is constructed as $$L = f + \lambda_1g_1 + \lambda_2g_2 + \cdots + \lambda_ng_n.$$
- Then the partial derivatives of $L$ with respect to the original variables and each $\lambda_i$ are taken, and the stationary points found by solving the set of simultaneous equations obtained by setting each derivative to zero.
- For example, to maximize $f(x, y) = 3x + 4y$ subject to $g(x,y) = x^2+y^2-1=0$, we define $$L(x,y,\lambda) = 3x + 4y + \lambda(x^2+y^2-1),$$and the equations $$\begin{align}&0 = \frac{\partial L}{\partial x}=3+2\lambda x \\&0 = \frac{\partial L}{\partial y} = 4 + 2\lambda y \\ &0 = \frac{\partial L}{\partial \lambda} = x^2+y^2-1\end{align}$$have solutions $(x, y)$ = $(3/5, 4/5)$, a maximum, and $(x,y) = (-3/5, -4/5)$, a minimum.
## References

[^1]: [[Home Page - The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]