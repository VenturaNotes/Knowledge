---
aliases:
  - Bezier surface
---
## Synthesis
- 
## Source [^1]
- A surface swept out by a moving Bézier curve of constant degree. Each control point of the original Bézier curve also moves through space on a Bézier curve and the curves on which the control points move all have the same degree.

  

Suppose the initial curve is a Bézier curve of degree $m$,

  

$$

\mathbf{r}^{m}(u)=\sum_{f=0}^{m} \mathbf{r}_{i} B_{i}^{m}(u)

$$

  

and let each $\mathbf{r}_{i}$ traverse a Bézier curve of degree $n$,

  

$$

\mathbf{r}^{m}(u)=\sum_{f=0}^{m} \mathbf{r}_{i j} B_{i}^{m}(u)

$$

  

then the point $\mathbf{r}^{m, n}(u, v)$ on the surface is given by

  

$$

\mathbf{r}^{m, n}(u, v)=\sum_{f=0}^{m} \sum_{f=0}^{n} \mathbf{r}_{i j} \mathrm{~B}_{i}^{m}(u) B_{j}^{n}(v)

$$
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]