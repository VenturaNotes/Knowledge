## Synthesis
- 
## Source [^1]
- (Euler-Lagrange equation) A central result in the calculus of variations which addresses problems such as finding curves of minimal length (geodesics) or solving the brachistochrone problem. A functional $I$ associates a real number$$I(y) = \int_a^b F(x, y, y') \, dx$$(where $a, b$ are fixed limits) with each of a family of graphs $y(x)$; this functional might represent the arc length of such graphs, the time taken to travel along the graphs under gravity, etc. Euler’s equation then states $I$ is maximal when$$\frac{d}{dx}\left(\frac{\partial F}{\partial y'}\right) - \frac{\partial F}{\partial y} = 0.$$As an example, the arc length of a curve $y(x)$ from $(a,c)$ to $(b,d)$ is$$I(y) = \int_a^b \sqrt{1 + y'(x)^2} \, dx,$$so that $F(x, y, y') = \sqrt{1 + y'^2}$ and Euler's equation then reads$$\frac{d}{dx}\left(\frac{y'}{\sqrt{1 + y'^2}}\right) - 0 = 0.$$Integrating and rearranging we find that $y'$ is constant, and so the graph of $y$ is a straight line.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]