## Synthesis
- 
## Source [^1]
- A recursive algorithm for computing Bézier curves from the control points. Given control points $\mathbf{r}^{0} \ldots \mathbf{r}^{n}$, set

  

$$

\mathbf{r}_{i}^{s}(u)=(1-u) \mathbf{r}_{i}^{s-1}(u)+u \mathbf{r}_{i+1}^{s-1}(u)

$$

  

for $r=1, \ldots n$ and $i=0, \ldots n-r$ and $\mathbf{r}_{i}{ }^{0}(u)=\mathbf{r}_{i}$. Then $\mathbf{r}_{i}{ }^{\mathrm{n}}(u)$ is the point with parameter value $u$ on the Bézier curve of degree $n$.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]