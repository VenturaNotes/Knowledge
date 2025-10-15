---
aliases:
  - Bezier curve
---
## Synthesis
- 
## Source [^1]
- A spline approximation developed by Pierre Bézier and widely used in computer-aided design. An $n$ th-degree Bézier curve is an $n$ th-degree polynomial defined by $n+1$ control points, $\mathbf{r}_{0} \ldots \mathbf{r}_{n}$. The Bézier curve is defined by

  

$$

\mathbf{r}(u)=\sum_{i=0}^{n} \mathbf{r}_{i} B_{i}^{n}(u)

$$

  

where $B_{i}{ }^{n}(u)$ is the Bernstein polynomial of degree $n$ defined by

  

$$

\begin{aligned}

& B_{i}^{n}(u)=n!/(l(n-i)!) \times u^{i}(1-u)^{n-i} \\

& \text { if } 0 \leq i \leq n \\

& \text { or }=0 \text { otherwise. }

\end{aligned}

$$

  

Bézier curves have a number of important properties. For example, the curve passes

  

through the first and last control points and is completely contained within the polygon that forms the convex hull of the control points; the gradient at each of the end points is the same as the gradient of the line joining the end point to its immediate neighbor; the control points exert a pull on the direction of the curve which is clamped by the slope at the end points.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]