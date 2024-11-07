[Video](https://www.youtube.com/watch?v=x0Jx5IC-IRI)

---
- ![[Screenshot 2023-05-25 at 4.58.23 AM.png]]
- The [[Informal Limit Definition]] to [[Formal Limit Definition]]
	- Informal: 
		- If f(x) becomes arbitrarily close to a single number L as x approaches c from either side, then the limit of f(x) as x approaches c is L, is written as $lim_{x \rightarrow c}f(x) = L$
	- Problems: 
		- "f(x) becomes arbitrarily close to a single number L"
			- No meaning for <mark style="background: #FFF3A3A6;">arbitrarily close</mark>
		- "as x approaches c"
			- How do we know how close x needs to get to c?
	- Formal:
		- Let f be a function defined on an open interval containing c (except possible at c) and let L be a real number. The statement $lim_{x\rightarrow c} = L$ means that for each $\varepsilon > 0$ there exists a $\delta > 0$ such that if $0 < |x - c| < \delta$, then $|f(x) - L| < \varepsilon$
			- $\delta$ is sort of the radius from c
			- $\varepsilon$ is sort of like a radius
			- Changing size of $\varepsilon$ will change size of $\delta$ 
---
- ![[Screenshot 2023-05-25 at 5.01.45 AM.png]]
- Finding $\delta$ for a given $\varepsilon$ 
	- Given the limit $lim_{x \rightarrow 3}(2x - 5) = 1$, find $\delta$ such that $|(2x-5)-1| < 0.01$ whenever $0 < |x-3| < \delta$
	- Seems like you can factor out a number from an absolute value sign
---
- ![[Screenshot 2023-05-25 at 5.04.53 AM.png]]
- Finding $\delta$ in terms of $\varepsilon$ 
	- Use the $\delta$ - $\varepsilon$ limit definition to prove that $lim_{x-2}(3x-2) = 4$
	- We must show that for each $\varepsilon$ > 0 there exists a $\delta$ > 0 such that $|(3x - 2) - 4| < $\varepsilon$ whenever 0 < |x - 2 | < $\delta$.
	- This isn't as easy because your choice for $\delta$ depends on your choice for $\varepsilon$. Therefore, we must establish a connection between |(3x - 2) - 4| and |x-2|.
---
- ![[Screenshot 2023-05-25 at 5.18.00 AM.png]]
- Finding $\delta$ in terms of $\varepsilon$
	- find the limit, L, for $lim_{x \rightarrow -3}(2x + 5) = L$. Then use the $\varepsilon\delta$ definition to prove the limit is L.