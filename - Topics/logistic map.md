## Synthesis
- 
## Source [^1]
### Continuous Case
- In 1838 the Belgian mathematician Verhulst suggested the differential equation$$\frac{dN}{dt} = rN\left(1 - \frac{N}{K}\right)$$as a model for population growth. $N(t)$ is the population at time $t$. For small $N$, we have $dN/dt \approx rN(t)$ and so approximately exponential growth with growth rate $r$. However, as $N$ becomes comparable to a carrying capacity $K$, the effective growth rate reduces. The general solution is$$N(t) = \frac{KA}{A + e^{-Krt}}$$where $A$ is a positive constant. The graph of $N(t)$ is an increasing S-shaped curve with $N(t)$ tending to 0 as $t \to -\infty$ and $N(t)$ tending to $K$ as $t \to \infty$.
### Discrete Case
- (discrete case) A discrete version of the logistic map is given by the recurrence relation$$\begin{align}&x_{n+1} = rx_n(1 - x_n)\\&\text{where } 0 < r < 4 \text{ and } 0 < x_0 < 1\end{align}$$
- (Rewrite the continuous logistic equation in terms of $N/K$ to see how this discrete version is arrived at.) By restricting $r$ as above, the sequence remains positive.
- This simple iteration leads to surprisingly complex behaviour. If $r < 1$, then the sequence $x_n$ tends to 0, signifying extinction. If $1 < r < 2$, then the sequence monotonically converges to $1 - 1/r$. If $2 < r < 3$, then the sequence converges to $1 - 1/r$ in an oscillatory fashion. But at $r = 3$ this equilibrium becomes unstable and bifurcates; for $3 < r < 1 + \sqrt{6}$ the stable behaviour is an oscillation between two values of $r$. Then at $r = 1 + \sqrt{6}$ we get a further bifurcation, and the stable behaviour is oscillations between four values of $r$. Further period-doubling bifurcations occur until the behaviour becomes chaotic at around $r = 3.57$, but then oscillations still occur at some greater values of $r$.
- By cobwebbing with the graphs of $y = rx(1 - x)$ and $y = x$ for different values of $r$, a qualitative appreciation of how these behaviors arise is possible.
	- #errata `qualitive` misspelling
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]