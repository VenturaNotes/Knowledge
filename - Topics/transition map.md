## Synthesis
- 
## Source [^1]
- Given a chart $\varphi_S : S \to \mathbb{R}^2$ of a subset $S$ of a surface $X$, we can define a function $f : S \to \mathbb{R}$ to be differentiable if $f \circ \varphi_S^{-1} : \varphi_S(S) \to \mathbb{R}$ is differentiable. Note that this is a map from a subset of $\mathbb{R}^2$ to $\mathbb{R}$, and we defined differentiability in terms of the local coordinates. The issue arises that this definition might not be consistent between different sets of coordinates.
- Given a second chart $\varphi_T : T \to \mathbb{R}^2$ such that $S \cap T = W \neq \emptyset$, then the transition maps for these two charts are$$\varphi_T \varphi_S^{-1} : \varphi_S(W) \to \varphi_T(W) \quad \text{and} \quad \varphi_S \varphi_T^{-1} : \varphi_T(W) \to \varphi_S(W).$$
- ![[Pasted image 20260925215738.png|383]]
	- Two charts with intersecting domains. The transition maps connect the darkest regions
- Provided the transition maps, which are maps between subsets of $\mathbb{R}^2$, are differentiable, the preceding definition of differentiability for $f$ can be consistently used for any local coordinates. These ideas can be generalized to define differentiability of maps between any two manifolds.
- For a topological manifold the transition maps are automatically continuous functions. But if a manifold has further structure, stronger assumptions must be made of the transition maps in order for the structure to be consistent on the manifold. For example, between Riemann surfaces the transition maps must be holomorphic, and between Riemannian manifolds the transition maps must be isometries.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]