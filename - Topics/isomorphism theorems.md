## Synthesis
- 
## Source [^1]
- A collection of theorems describing isomorphisms for groups (with similar versions for rings, modules, etc.) due to Emmy Noether.
### First isomorphism theorem
- Let $f : G \to H$ be a homomorphism of groups. Then the kernel of $f$ is a normal subgroup of $G$, the image of $f$ is a subgroup of $H$, and the quotient group $G/\ker f$ is isomorphic to $\operatorname{Im} f$ via the map $g\ker f \mapsto f(g)$.
- As examples:
	- $f : z \mapsto |z|$ is a homomorphism from $\mathbb{C}^*$ to $\mathbb{R}^*$ with kernel $S^1$ and image $(0, \infty)$ so that $\mathbb{C}^*/S^1$ is isomorphic to $(0, \infty)$.
	- $g : x \mapsto \ln x$ is a homomorphism from $(0, \infty)$ to $\mathbb{C}$ with kernel $\{1\}$ and image $\mathbb{R}$ so that $(0, \infty)$ is isomorphic to $\mathbb{R}$.
	- $h : x \mapsto e^{2\pi ix}$ is a homomorphism from $\mathbb{R}$ to $\mathbb{C}^*$ with kernel $\mathbb{Z}$ and image $S^1$ so that $\mathbb{R}/\mathbb{Z}$ is isomorphic to $S^1$.
### Second isomorphism theorem 
- Let $G$ be a group, $H$ be a subgroup of $G$, and $N$ be a normal subgroup of $G$. Then $HN = \{hn : h \in H, n \in N\}$ is a subgroup of $G$, and $H \cap N$ is a normal subgroup of $H$. Further, the quotient groups $H/(H \cap N)$ and $(HN)/N$ are isomorphic. (This follows by applying the first theorem to the homomorphism $h \mapsto hN$. )
### Third isomorphism theorem 
- Let $G$ be a group, $K, N$ be normal subgroups such that $N \subseteq K \subseteq G$. Then $K/N$ is a normal subgroup of $G/N$, and the quotient groups $G/K$ and $(G/N)/(K/N)$ are isomorphic. (This follows by applying the first theorem to the homomorphism $g \mapsto gN/(K/N)$.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]