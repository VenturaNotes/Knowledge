---
aliases:
  - trig function
  - trig functions
---
## Synthesis
- 
## Source [^1]
- Below, the trigonometric functions are defined, first where the angle is measured in degrees and secondly using radians.
- ![[Pasted image 20260926094523.png|247]]
	- Adjacent x, opposite y, hypotenuse r.
### Using degrees
- The basic trigonometric functions, cosine, sine, and tangent, are first introduced by using a right-angled triangle where $0 < \theta < 90$, but $\cos \theta^\circ, \sin \theta^\circ$, and $\tan \theta^\circ$ can also be defined when $\theta$ is larger than 90 and when $\theta$ is negative. Let $P$ be a point (not at $O$) with Cartesian coordinates $(x, y)$. Suppose that $OP$ makes an angle of $\theta^\circ$ with the positive $x$-axis and that $|OP| = r$. Then the following are the definitions:$$\sin \theta^\circ = \frac{y}{r} = \frac{\text{opposite}}{\text{hypotenuse}}, \cos \theta^\circ = \frac{x}{r} = \frac{\text{adjacent}}{\text{hypotenuse}}, \tan \theta^\circ = \frac{y}{x} = \frac{\text{opposite}}{\text{adjacent}} \quad (x \neq 0).$$
- It follows that $\tan \theta^\circ = \sin \theta^\circ / \cos \theta^\circ$, and that $\cos^2 \theta^\circ + \sin^2 \theta^\circ = 1$. Some of the most frequently required values are given in the table.

| $\theta$ | 0 | 30 | 45 | 60 | 90 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| $\cos \theta^\circ$ | 1 | $\frac{\sqrt{3}}{2}$ | $\frac{1}{\sqrt{2}}$ | $\frac{1}{2}$ | 0 |
| $\sin \theta^\circ$ | 0 | $\frac{1}{2}$ | $\frac{1}{\sqrt{2}}$ | $\frac{\sqrt{3}}{2}$ | 1 |
| $\tan \theta^\circ$ | 0 | $\frac{1}{\sqrt{3}}$ | 1 | $\sqrt{3}$ | not defined |
- Common Values

- ![[Pasted image 20260926094719.png|206]]
	- Parity by quadrant
- The point $P$ may be in any of the four quadrants. By considering the signs of $x$ and $y$, the quadrants in which the different functions take positive values can be found and are shown in the figure.
- The following are useful for calculating values, when $P$ is in quadrant 2, 3, or 4:

$$
\begin{aligned}
\cos(180 - \theta)^\circ &= -\cos \theta^\circ, \\
\sin(180 - \theta)^\circ &= \sin \theta^\circ, \\
\cos(180 + \theta)^\circ &= -\cos \theta^\circ, \\
\sin(180 + \theta)^\circ &= -\sin \theta^\circ, \\
\cos(-\theta)^\circ &= \cos \theta^\circ, \\
\sin(-\theta) &= -\sin \theta.
\end{aligned}
$$

- The functions cosine and sine are periodic, of period 360; that is to say, $\cos(360 + \theta)^\circ = \cos \theta^\circ$ and $\sin(360 + \theta)^\circ = \sin \theta^\circ$. The function tangent is periodic, of period 180; that is, $\tan(180 + \theta)^\circ = \tan \theta^\circ$.

### Using radians
- In more advanced work, particularly involving calculus, it is essential that angles are measured in radians. The functions sine, cosine, and tangent are defined by the same trigonometric ratios but, with angles now measured in radians, $\sin$, $\cos$, and $\tan$ are technically different functions from when degrees are used. For example, the functions $\cos$ and $\sin$ now have period $2\pi$, and $\tan$ has period $\pi$.
- ![[Pasted image 20260926094915.png|326]]
	- Graph of $\cos x$
- ![[Pasted image 20260926094932.png|329]]
	- Graph of $\sin x$
- For identities connecting the trigonometric functions, see APPENDIX 14. These identities apply whether degrees or radians are used.
- The other trigonometric functions, cotangent, secant, and cosecant, are defined as follows:$$\cot x = \frac{\cos x}{\sin x}, \sec x = \frac{1}{\cos x}, \csc x = \frac{1}{\sin x},$$where, in each case, values of $x$ that make the denominator zero must be excluded from the domain.
- ![[Pasted image 20260926095006.png|276]]
	- Graph of $\sec x$
- ![[Pasted image 20260926095031.png|282]]
	- Graph of $\csc x$
	- [ ] Is it `Graph of cosecx` like shown in text? 
- ![[Pasted image 20260926095141.png|292]]
	- Graph of $\tan x$
- ![[Pasted image 20260926095158.png|301]]
	- Graph of $\cot x$
- When radians are used, the derivatives of $\sin x$ and $\cos x$ are$$\frac{d}{dx}(\sin x) = \cos x, \quad \frac{d}{dx}(\cos x) = -\sin x.$$
- The derivatives of the other trigonometric functions are found from these, by using the rules for differentiation, and are given in Appendix 7.
- The complex trigonometric functions can be defined in terms of the trigonometric series expansions or in terms of the complex exponential by$$\cos z = \frac{\exp(iz) + \exp(-iz)}{2}, \quad \sin z = \frac{\exp(iz) - \exp(-iz)}{2i}.$$
- Euler's formula $\exp(iz) = \cos z + i \sin z$ then holds for all complex $z$, though it does not follow that $\cos z$ is the real part of $\exp(iz)$ in general. Likewise, the identity $\cos^2 z + \sin^2 z = 1$ still holds for all complex $z$.
- The trigonometric and hyperbolic functions are then related by$$\sin(iz) = i \sinh z, \quad \cos(iz) = \cosh z$$for all complex $z$.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]