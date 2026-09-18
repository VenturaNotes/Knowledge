## Synthesis
- 
## Source [^1]
- Consider the following boundary value problem for the wave equation:$$c^2 \frac{\partial^2 y}{\partial x^2} = \frac{\partial^2 y}{\partial t^2}, \quad y(0)=y(l)=0.$$
- Solutions may be found by separating variables and seeking a separable solution of the form $y(x,t) = X(x)T(t)$. This leads to the equation and conditions$$\frac{X''(x)}{X(x)} = \frac{T''(t)}{c^2 T(t)}, \quad X(0)=X(l)=0.$$
- As $X''/X$ is a function of $x$ alone and $T''/T$ is a function of $t$ alone, both must be a constant $k$. To meet the boundary conditions $X(0)=X(l)=0$, it follows that $k = -n^2\pi^2/l^2$ for some positive integer $n$. The separable solutions are then the normal modes$$y(x,t) = \sin\left(\frac{n\pi x}{l}\right) \times \left[ A\sin\left(\frac{n\pi ct}{l}\right) + B\cos\left(\frac{n\pi ct}{l}\right) \right].$$
- The above argument applies more generally to other PDEs, and the separable solutions then play an important part in finding the general solution (see SUPERPOSITION PRINICIPLE).
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]