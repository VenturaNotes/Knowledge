## Synthesis
- 
## Source [^1]
- A numerical method for finding a root of an equation $f(x)=0$. If values $a$ and $b$ are found such that $f(a)$ and $f(b)$ have opposite signs and $f$ is  continuous on the interval $[a, b]$, then (by the intermediate value theorem) the equation has a root in $(a, b)$. The method is to bisect the interval and replace it by either one half or the other, thereby closing in on the root.
- Let $c=\frac{1}{2}(a+b)$. Calculate $f(c)$. If $f(c)$ has the same sign as $f(a)$, then take $c$ as a new value for $a$; if not (so that $f(c)$ has the same sign as $f(b)$), take $c$ as a new value for $b$. (If it should happen that $f(c)=0$, then $c$ is already a root.) Repeat this whole process until the length of the interval $[a, b]$ is less than $2 \varepsilon$, where $\varepsilon$ is the desired  accuracy, specified in advance. The midpoint of the interval can then be taken as an approximation to the root, and the error will be less than $\varepsilon$. Compare BINARY SEARCH ALGORITHM.
- See Web Links
	- http://archives.math.utk.edu/visual.calculus/1/bisection.3/index.html
		- #comment Not functional
	- An interactive page which demonstrates the method for finding a root of a cubic equation.
## References

[^1]: [[Home Page - The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]