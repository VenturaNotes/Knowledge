## Synthesis
- 
## Source [^1]
- A function from one partially ordered set to another having the property, roughly speaking, that least upper bounds are preserved. A function $$f: S \to T$$is said to be continuous if, for every directed subset $X$ of $S$, $f$ maps the least upper bound of $X$ to the least upper bound of the image of $X$ under $f$. Continuous functions are significant in denotational semantics since they correspond to the requirement that a computational process produces arbitrarily close approximations to the final output, given arbitrarily close approximations to the total input
- A continuous function f(x) has no breaks or instantaneous changes in value. In the hierarchy of mathematical functions, the smoothest are those, such as sin x, cos x, that can be differentiated any number of times, always producing a continuous function
## Source[^2]
- According to the definition introduced by Cauchy, and developed by Weierstrass, continuous functions are functions that take nearby values at nearby points.
	- [ ] #question I'm sorry, but what does that even mean?
	- [ ] #question Who is Cauchy and Weierstrass?
### Definition 3.1
- Let $f: A \to \mathbb{R}$, where $A \subset \mathbb{R}$ , and suppose that c $\in$ A. Then $f$ is continuous at $c$ if for every $\epsilon > 0$ there exists $\delta > 0$ such that $$|x-c| < \delta \text{ and }x \in A \text{ implies  that } |f(x)-f(c)|<\epsilon.$$
	- #comment To read $f: A \to \mathbb{R}$, is read as:
		- "f is a function from A to R"
	- [ ] #question Why is this definition true? What does it mean?
- A function f : $A \to \mathbb{R}$ is continuous on a set $B \subset A$ if it is continuous at every point in B, and continuous if it is continuous at every point of its domain A
	- [ ] #question Where did B come from? I think I need more of a visual understanding for this that I'd probably need to draw out. 
- The definition of continuity at a point may be stated in terms of neighborhoods as follows. 
## Source[^3]
- The function $f: S \to \mathbb{R}$ is continuous at $a$ in $S$ if $f(x) \to f(a)$ as $x \to a$ (see LIMIT). Rigorously, this means that, given any $\epsilon > 0$, there exists $\delta > 0$ such that $|f(x) - f(a)| < \epsilon$ whenever $|x - a| < \delta$ and $x \in S$. This is equivalent to saying that whenever a sequence $x_n$ converges to $a, f(x_n)$ converges to $f(a)$. The function $f$ is continuous on $S$ if it is continuous at each point of $S$. The following algebra of limits holds:
	- (i) The sum of two continuous functions is continuous.
	- (ii) The product of two continuous functions is continuous.
	- (iii) The quotient of two continuous functions is continuous provided the denominator is not zero.
	- (iv) Suppose that $f$ is continuous at $a$, that $f(a) = b$ and that $g$ is continuous at $b$. Then the composition $g \circ f$ is continuous at $a$.
	- (v) Any differentiable function is continuous. The converse is not true as the modulus function is continuous but not differentiable.
- See BLANCMANGE FUNCTION, INTERMEDIATE VALUE THEOREM, WEIERSTRASS' THEOREM.
- This notion of continuity generalizes readily to metric spaces: a function $f: M \to N$ between metric spaces is continuous at $a \in M$ if, given any $\epsilon > 0$, there exists $\delta > 0$ such that $d_N(f(m), f(a)) < \epsilon$ whenever $d_M(m, a) < \delta$ and $m \in M$. This further generalizes to topological spaces: a function $f: M \to N$ between topological spaces is continuous at $a \in M$ if, given any open subset (see OPEN SET) $U$ containing $f(a)$, the pre-image $f^{-1}(U)$ is open in $M$.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: https://www.math.ucdavis.edu/~hunter/m125a/intro_analysis_ch3.pdf
[^3]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]