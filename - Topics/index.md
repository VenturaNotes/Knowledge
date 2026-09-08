---
aliases:
  - indexes
---
## Synthesis
- 
## Source [^1]
- A list of values of some particular data item contained in a record, enabling it to be retrieved more rapidly than by simple serial search. For example, a subscript indexes a particular element of an array. The B+ tree (see B-TREE) is an efficient form of multilevel index. See also INDEXED FILE.
## Source[^2]
- (indices) Suppose that $a$ is a real number. When the product $a \times a \times a \times a \times a$ is written as $a^5$, the number 5 is called the index. When the index is a positive integer $p$, then $a^p$ means $a \times a \times \dots \times a$, where there are $p$ occurrences of $a$. It can then be shown that
	- (i) $a^p \times a^q = a^{p+q}$
	- (ii) $a^p / a^q = a^{p-q}$ ($a \neq 0$),
	- (iii) $(a^p)^q = a^{pq}$,
	- (iv) $(ab)^p = a^p b^p$,
- where, in (ii), for the moment, it is required that $p > q$. The meaning of $a^p$ can be extended for a general integer $p$ by the following definitions:
	- (v) $a^0 = 1$,
	- (vi) $a^{-p} = 1/a^p$ ($a \neq 0$),
	- noting (i)–(vi) still hold. And if $a > 0$, $m, n$ are integers with $n > 0$, we define
	- (vii) $a^{m/n} = \sqrt[n]{a^m}$
	- For $a > 0$ and $x$ a real number, we define$$a^x = \exp(x \ln a)$$and again rules (i)–(vii) hold. The same notation is used in other contexts; for example, to define $z^p$, where $z$ is a complex number, to define $\mathbf{A}^p$, where $\mathbf{A}$ is a square matrix, or to define $g^p$, where $g$ is an element of a multiplicative group. In such cases, some of the above rules may hold and others may not.
---
- (group theory) The index of a subgroup $H$ in a group $G$, denoted $|G : H|$, is the number of (left or right) cosets of $H$. If $G$ is finite, then $|G : H| = |G|/|H|$ by Lagrange's theorem.
---
- (statistics) A figure used to show the variation in some quantity over a period of time, usually standardized relative to some base value. The index is given as a percentage with the base value equal to 100%. For example, the retail price index and consumer price index are used to measure changes in the cost of household items and inflation. Indices are often calculated by using a weighted mean of a number of constituent parts.
---
- (permutations) The index $\text{ind}(\sigma)$ of a permutation $\sigma$ of a finite set is the least number $k$ such that $\sigma$ can be written as a product of $k$ transpositions (or 2-cycles). Given two permutations $\sigma$ and $\tau$, then$$\text{ind}(\sigma \tau) \le \text{ind}(\sigma) + \text{ind}(\tau).$$
---
- (vector fields) For a vector field $\mathbf{v}: \mathbb{R}^2 \to \mathbb{R}^2$, a singularity is a point $p$ such that $\mathbf{v}(p) = \mathbf{0}$. On a simple, closed, oriented (see ORIENTATION) curve $C$ about $p$ (which contains no other singularities), the direction of $\mathbf{v}$ wraps around the unit circle an integer number of times; that integer is the index of the singularity.
- ![[Pasted image 20260907182843.png|238]]
	- Singularity with index $-1$
- ![[Pasted image 20260907182904.png|248]]
	- Singularity with index 2
- For the first figure $\mathbf{v}(x,y) = (y,x)$, and $(0,0)$ has an index of $-1$; note how the vector field goes anticlockwise once as we move clockwise around the circle. For the second field $\mathbf{v}(x,y) = (x^2 - y^2, 2xy)$, then $(0,0)$ has index 2. This definition then generalizes to tangent vector fields on surfaces (see POINCARÉ-HOPF THEOREM) and to higher dimensions (see DEGREE (of a map)).
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]