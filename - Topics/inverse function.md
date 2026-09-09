---
aliases:
  - Inverse Functions
---
## Synthesis
- 
## Source [^1]
- A function, usually written $f^{-1}$, that reverses the effect of another given function $f$. If $f(x) = y$, then $f^{-1}(y) = x$. The inverse of a function is only well-defined if the function is bijective, meaning that it maps different inputs to different outputs. The inverse of $f^{-1}$ is $f$ itself.
## Source[^2]
- (inverse mapping) For a function $f$, its inverse function $f^{-1}$ (or just inverse) is to be a function such that $y = f(x)$ if and only if $x = f^{-1}(y)$. If such a function exists, then it is unique and $f$ is said to be invertible. Suppose that $f$ has domain $S$ and codomain $T$. To be invertible $f : S \to T$ needs to be onto so that every $y$ in $T$ equals $f(x)$ for some $x$ in $S$. However, any inverse $f^{-1}$, with domain $T$ and codomain $S$ must uniquely assign such $x$ to this $y$ and so $f$ must also be one-to-one. The inverse is then defined by: for $y$ in $T, f^{-1}(y)$ is the unique element $x$ of $S$ such that $f(x) = y$. Consequently, $f$ is invertible if and only if it is a bijection.
- For a real function defined on an interval $I$, if $f$ is strictly increasing on $I$ or strictly decreasing on $I$, then $f$ is one-to-one and so bijective onto its image.
- When an inverse is required for a given function $f$, it may be necessary to restrict the domain and obtain instead the inverse function of this restriction of $f$. For example, suppose that $f : \mathbb{R} \to \mathbb{R}$ is defined by $f(x) = x^2 - 4x + 5$. This function is not one-to-one but is strictly increasing for $x \ge 2$. Use $f$ now to denote the function defined by $f(x) = x^2 - 4x + 5$ with domain $[2, \infty)$. The image is $[1, \infty)$ and the function $f : [2, \infty) \to [1, \infty)$ has inverse $f^{-1} : [1, \infty) \to [2, \infty)$. A formula for $f^{-1}$ can be found by setting $y = x^2 - 4x + 5$ and, remembering that $x \in [2, \infty)$, obtaining $x = 2 + \sqrt{y - 1}$. So, with a change of notation, $f^{-1}(x) = 2 + \sqrt{x - 1}$ for $x \ge 1$.
- ![[Pasted image 20260909002651.png|227]]
	- The graph of a function and its inverse
- When the inverse function exists, the graphs $y = f(x)$ and $y = f^{-1}(x)$ are reflections of each other in the line $y = x$. See INVERSE FUNCTION THEOREM, INVERSE HYPERBOLIC FUNCTION, INVERSE TRIGONOMETRIC FUNCTION, LEFT INVERSE, RIGHT INVERSE.
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]
[^2]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]